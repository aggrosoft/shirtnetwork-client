import axios from 'axios';
import backend from './backend.js';
export default {

  store: undefined,
  config: undefined,
  useStock: false,

  init (store, config, useStock) {
    this.store = store
    this.config = config
    this.useStock = useStock

    this._attachEventListeners()
  },

  async _attachEventListeners () {
    this.store.watch(function(state, getters){ return getters.selectedVariant; }, () => this.reloadShopInfos() && this.reloadStockInfos() );
    this.store.watch(function(state, getters){ return getters.selectedSize; }, () => this.reloadShopInfos() && this.reloadStockInfos() );
    this.store.watch(function(state, getters){ return getters.selectedPrinttype; }, () => this.reloadShopInfos() );
    this.store.watch(function(state, getters){ return getters.amount; }, () => this.reloadShopInfos() );
    this.store.dispatch('observe', {event: 'checkout', callback: () => this.checkout() });
    this.store.dispatch('observe', {event: 'tocart', callback: () => {
        top.location.href = this.config.cart.link;
    }});
  },

  _getShopRequestData () {
    const sizes = this.store.getters.selectedSizes;
    const selections = this.store.getters.localVar('selections');
    const custom = this.store.getters.localVar('checkoutData');

    const product = this.store.getters.selectedProduct;
    const variant = this.store.getters.selectedVariant;
    const size = this.store.getters.selectedSize;
    const printtype = this.store.getters.selectedPrinttype;
    const amount = this.store.getters.amount;
    return {
      psku: product ? product.artNr : '',
      vsku: variant ? variant.artnr : '',
      ssku: size ? size.artnr : '',
      ptid: printtype ? printtype.id : '',
      ptname: printtype ? printtype.name : '',
      vtitle: variant ? variant.name : '',
      stitle: size ? size.name : '',
      sskus: sizes.map( function (s) { return { sku: s.size.artnr, amount: s.amount, size: s.size.id }}),
      custom: custom,
      sel: selections,
      am: amount
    }
  },

  async reloadShopInfos () {
    const data = this._getShopRequestData()

    const settings = this.config.infos
    this.shopCancelToken && this.shopCancelToken.cancel()
    this.shopCancelToken = axios.CancelToken.source();

    try {
      const response = await axios.post(settings.url, this._buildFormData(new FormData(), Object.assign(data, settings.data)), { headers: { "Content-Type": "multipart/form-data" }, cancelToken: this.shopCancelToken.token })
      this.store.dispatch('setLocalVar', {localVar: 'shopProductInfos', value: response.data});
    } catch(e) {}

  },

  async reloadStockInfos () {
    if (this.useStock) {
      const data = this._getShopRequestData()

      const settings = this.config.stock
      this.stockCancelToken && this.stockCancelToken.cancel()
      this.stockCancelToken = axios.CancelToken.source();

      try {
        const response = await axios.post(settings.url, this._buildFormData(new FormData(), Object.assign(data, settings.data)), { headers: { "Content-Type": "multipart/form-data" }, cancelToken: this.stockCancelToken.token })
        this.store.dispatch('setStocks', response.data);
      } catch(e) {}

    }
  },

  async checkout () {
    this.store.dispatch('setLoading', true)
    document.body.dispatchEvent(new Event('designerBeforeGetCheckoutInfos'))
    await this.config.cart.init()
    const data = await this._getCheckoutData()
    const sizes = data.sizes || [{oxid: data.aid, amount: this.store.getters.amount, size: this.store.getters.selectedSize ? this.store.getters.selectedSize.id: undefined}]
    for (const selection of sizes) {
      const confids = await backend.saveConfig({size: selection.size})
      const config = confids.pop()
      await this.config.cart.addItem(config, data, selection)
      document.body.dispatchEvent(new Event('designerAfterCartAdd', {detail: {config, data, selection}}))
    }

    document.body.dispatchEvent(new Event('designerBeforeCheckout'))
    await this.config.cart.submit()

    this.store.dispatch('setLoading', false);
    this.store.dispatch('setShowAfterSalesModal', true);
  },

  async _getCheckoutData () {
    const settings = this.config.cart
    const data = this._getShopRequestData()
    const response = await axios.post(settings.url, this._buildFormData(new FormData(), Object.assign(data, settings.data)), { headers: { "Content-Type": "multipart/form-data" } })
    return response.data
  },

  _buildFormData(formData, data, parentKey) {
    if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
      Object.keys(data).forEach(key => {
        this._buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
      });
    } else {
      const value = data == null ? '' : data;
      formData.append(parentKey, value);
    }
    return formData
  }
}
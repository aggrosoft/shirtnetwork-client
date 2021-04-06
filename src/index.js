import defaults from './config.defaults.js'
import loadScript from './util/loadscript.js'
import merge from './util/merge.js';
import shop from './shop.js'
import backend from './backend.js';

export default {

  config: Object.assign({}, defaults),
  instance: undefined,
  shopCancelToken: undefined,
  stockCancelToken: undefined,

  async init (config) {
    // Apply config to defaults
    merge(this.config, config)

    // Load needed scripts for designer
    await this._loadRequirements()

    // Load designer main
    await this._loadDesignerScript()

    // Initialize designer
    await this._initDesigner()

    // Initialize backend
    backend.init(this.instance.$store, this.config.settings.backend.config)

    // Attach event listeners
    await this._attachEventListeners()

    // Boot up
    await this._bootDesigner()

    // After boot routines
    await this._onAfterBoot()

  },

  async _loadRequirements () {
    for (const url of this.config.requirements) {
      await loadScript(url)
    }
  },

  async _loadDesignerScript () {
    return await loadScript (this.config.designerUrl())
  },

  async _initDesigner () {
    this.instance = window.designer = new ShirtnetworkDesigner();
    this.config.applyConfig(this.instance)
    document.body.dispatchEvent(new CustomEvent('designerInitialized', {detail: this.instance}))
    this.instance.$mount(document.getElementById(this.config.settings.container));
    document.body.dispatchEvent(new CustomEvent('designerMounted', {detail: this.instance}))
  },

  async _bootDesigner () {
    const settings = this.config.settings

    try {
      if (settings.initial.config) {
        const response = await fetch(settings.backend.config + '/config/' + settings.initial.config)
        await this.instance.$store.dispatch('applyConfig', await response.json())
      } else {
        await this.instance.$store.dispatch('boot', settings.initial)
      }
    } catch (e) {
      // Fallback to default product if booting failed
      await this.instance.$store.dispatch('boot', {
        user: settings.initial.user,
        product: settings.initial.defaultProduct
      })
    }

  },

  async _onAfterBoot () {

    if (this.config.settings.initial.amount) {
      this.instance.$store.dispatch('setAmount', this.config.settings.initial.amount);
    }

    if (this.config.settings.initial.printtype) {
      const printtype = this.instance.$store.getters.productPrinttypes.find((pt) =>
        pt.name == this.config.settings.initial.printtype || pt.id == this.config.settings.initial.printtype
      )
      if (printtype) {
        app.$store.dispatch('setSelectedPrinttype', printtype);
      }
    }
    document.body.dispatchEvent(new CustomEvent('designerBooted', {detail: this.instance}))
  },

  async _attachEventListeners () {
    shop.init(this.instance.$store, this.config.settings.shop, this.config.settings.interface.stock)
  },

}
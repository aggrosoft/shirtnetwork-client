const CDN_URL = 'https://cdn.shirtnetwork.de/'

export default {
  version: '2.0.0',

  requirements: [
    'https://polyfill.io/v3/polyfill.js?features=es5,es6',
    `${CDN_URL}vue/2.6.9/vue.min.js`
  ],

  settings: {
    container: 'app',
    debug: false,
    initial: {
      user: undefined,
      config: undefined,
      product: undefined,
      variant: undefined,
      size: undefined,
      logo: undefined,
      text: undefined,
      font: undefined,
      amount: undefined,
      printtype: undefined,
      defaultProduct: undefined
    },
    backend: {
      upload: '',
      config: '',
      fonts: '',
      cacheKey: '',
      type: ''
    },
    shop: {
      infos: {
        url: '',
        data: {},
        handler: undefined
      },
      stock: {
        url: '',
        data: {},
        handler: undefined
      },
      links: {
        delivery: ''
      },
      cart: {
        url: '',
        data: {},
        link: '',
        init: () => {},
        addItem: () => {},
        submit: () => {},
      }
    },
    locale: {
      language: 'de-DE',
      currency: 'EUR',
    },
    interface: {
      printtypeMode: 'object',
      stock: false,
      constraints: true,
      loadCSS: true
    },
    paging: {
      products: 12,
      logos: 12
    },
    localVars: {},
  },

  applyConfig (instance) {
    const store = instance.$store
    const settings = this.settings

    store.dispatch('setLoadCSS', settings.interface.loadCSS)
    store.dispatch('setCacheKey', settings.backend.cacheKey)
    store.dispatch('setUploadServer', settings.backend.upload)
    store.dispatch('setFontListUrl', settings.backend.fonts)
    store.dispatch('setPrinttypeMode', settings.interface.printtypeMode)

    store.dispatch('setLanguage', settings.locale.language)
    store.dispatch('setCurrency', settings.locale.currency)
    store.dispatch('setProductsPerPage', settings.paging.products);
    store.dispatch('setLogosPerPage', settings.paging.logos);
    store.dispatch('setUseStock', settings.interface.stock);
    store.dispatch('setUseConstraints', settings.interface.constraints);

    for(const key in settings.localVars) {
      store.dispatch('setLocalVar', {localVar: key, value: settings.localVars[key]})
    }

    if (this.settings.debug) {
      Vue.config.devtools = true
      store.dispatch('setShowDevTools', true);
      localStorage.setItem('debug', 'shirtnetwork:*')
    } else {
      localStorage.removeItem('debug')
    }
  },

  designerUrl () {
    return `${CDN_URL}designer/${this.version}/ShirtnetworkDesigner.umd.min.js`
  }
}
import merge from './util/merge.js';

export default {

  store: undefined,
  endpoint: undefined,
  type: undefined,

  init (store, endpoint, type) {
    this.store = store
    this.endpoint = endpoint
    this.type = type
  },

  async saveConfig (data) {
    const file = await this.store.dispatch('exportFile', true)
    merge(file, data)

    const contentType = this.type === 'node' ? 'application/json' : 'text/plain'

    const response = await fetch(this.endpoint + '/config', {
      method: 'POST',
      headers: {
        'Content-Type': contentType
      },
      body: JSON.stringify(file) // body data type must match "Content-Type" header
    });

    return await response.json()
  }
}
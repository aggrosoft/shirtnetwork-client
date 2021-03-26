import merge from './util/merge.js';

export default {

  store: undefined,
  endpoint: undefined,

  init (store, endpoint) {
    this.store = store
    this.endpoint = endpoint
  },

  async saveConfig (data) {
    const file = await this.store.dispatch('exportFile', true)
    merge(file, data)

    const response = await fetch(this.endpoint + '/config', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(file) // body data type must match "Content-Type" header
    });

    return await response.json()
  }
}
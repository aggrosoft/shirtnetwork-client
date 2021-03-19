import merge from './util/merge.js';
import axios from 'axios';

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

    const response = await axios.post(this.endpoint + '/config', file)
    return response.data
  }
}
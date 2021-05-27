import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: JSON.parse(window.localStorage.getItem('user') || null)
  },
  mutations: {
    // 存储用户数据
    setUser (state, payload) {
      state.user = JSON.parse(payload)
      // 将payload数据存储到本地存储中
      window.localStorage.setItem('user', payload)
    }
  },
  actions: {
  },
  modules: {
  }
})

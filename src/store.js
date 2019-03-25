import Vue from 'vue'
import Vuex from 'vuex'
import { store, productTypes } from '@/constants';

Vue.use(Vuex);
const INITIAL_DATA = {

};
const INITIAL_LAYOUT = {};
const INITIAL = {
  loading: false,
  status: 'init',
  data: undefined
};
store.data.forEach(key => {
  INITIAL_DATA[key] = INITIAL;
});

store.layout.forEach(key => {
  INITIAL_LAYOUT[key] = INITIAL;
});
export default new Vuex.Store({
  state: { data: INITIAL_DATA, layout: INITIAL_LAYOUT, productTypes },
  mutations: {
    data(state, action) {
      const { type, key, payload } = action;
      state[type] = {
        ...state[type],
        [key]: payload
      };
    },
    layout(state, action) {
      const { type, key, payload } = action;
      state[type] = {
        ...state[type],
        [key]: payload
      };

    },
    login(state, action) {
      const { payload} = action;
      console.log(  {
        status: 'success',
        data:payload
      },'action')
      state.data.user = {
        status: 'success',
        data:payload
      }
    }
  },
  actions: {
    asyncActionWrapper({ commit, state }, { call, type, key, params = {} }) {
      commit(
        {
          type,
          key,
          payload: {
            status: 'loading',
            loading: true,
          }
        }
      );
      call(params)
        .then(data => {
          commit({
            type,
            key,
            payload: {
              status: 'success',
              loading: false,
              data
            }
          });
        })
        .catch(msg => {
          commit({
            type,
            key,
            payload: {
              status: 'success',
              loading: false,
              msg
            }
          });
        })
    },

  }
})

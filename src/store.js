import Vue from 'vue'
import Vuex from 'vuex'
import { store, productTypes } from '@/constants';

Vue.use(Vuex);
const INITIAL_DATA = {};
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

// INITIAL_DATA.user = {
//   status: 'success',
//   data: {
//     id: 4,
//     state: 0
//   }
// }
const userCacheData = localStorage.getItem('user');
INITIAL_DATA.user = userCacheData ? { status: 'success', data: JSON.parse(userCacheData) } : INITIAL_DATA.user;
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
      const { payload } = action;
      localStorage.setItem('user', JSON.stringify(payload));
      state.data.user = {
        status: 'success',
        data: payload
      }
    },
    logout(state, action) {
      localStorage.removeItem('user');
      state.data.user = {
        status: 'init',
        data: {}
      }
    },
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
              status: 'error',
              loading: false,
              msg
            }
          });
        })
    },
  }
})

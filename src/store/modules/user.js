/*
 * @Author: David
 * @Date: 2019-10-31 10:49:34
 * @LastEditTime: 2019-11-29 15:50:47
 * @LastEditors: Do not edit
 * @Description: 
 */
/* eslint-disable */
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { AppMessage } from '@/components/AppMessage/index.js';
import api from '@/utils/api'


function generateHttpRoles (privileges) {
    let roles = []
    roles = privileges.map(item=>item.desc)
    let step = (arr,prefix)=>{
        arr.forEach((item)=>{
          roles.push(prefix+'/'+item.desc)
          if (item.children&&item.children.length>0) {
            step(item.children,prefix+'/'+item.desc)
          }
        })
    }
    roles.forEach((item,index)=>{
      step(privileges[index].children,item)
    })
    if (roles.indexOf('首页')<0) {
        roles.push('欢迎页')
    }
    return roles;
    
}

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  user: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  updateUser (state, data) {
    state.user = data
    state.token = data.token
    setToken(data.token)
  }
}

const actions = {
  // user login
  // login({ commit }, userInfo) {
  //   const { username, password } = userInfo
  //   return new Promise((resolve, reject) => {
  //     login({ username: username.trim(), password: password }).then(response => {
  //       const { data } = response
  //       commit('SET_TOKEN', data.token)
  //       setToken(data.token)
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      api.getInfo({token:state.token}).then(response => {
        const { data } = response
        commit('updateUser',data);
        const { privileges } = data
        const roles = generateHttpRoles(privileges)
        data.roles = roles
        commit('SET_ROLES', roles)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  //user logout
  LOGOUT({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      api.logout() 
      .then(()=>{
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  LOGIN ({commit,dispatch},param) {
    api.login(param.param||{})
    .then((data)=>{
        AppMessage({
          message: '登录成功',
          type: 'success',
          duration: 5 * 1000
        })
        commit('updateUser',data.data);
        let {privileges} = data.data
        let roles = generateHttpRoles(privileges)
        commit('SET_ROLES',roles)
        dispatch('permission/generateRoutes', roles, { root: true }).then(accessRoutes=>{
          router.addRoutes(accessRoutes)
          param.cb&&param.cb(data.data)
        })
        
    })
    .catch((data)=>{
      param.fb&&param.fb(data.message)
    })
  },
  updateLogin ({commit}) {
    let token = getToken();
    api.get_info()
    .then(data=>{
      commit('updateUser',data.data)
    })
  },

  // dynamically modify permissions
  // changeRoles({ commit, dispatch }, role) {
  //   return new Promise(async resolve => {
  //     const token = role + '-token'

  //     commit('SET_TOKEN', token)
  //     setToken(token)

  //     const { roles } = await dispatch('getInfo')

  //     resetRouter()

  //     // generate accessible routes map based on roles
  //     const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

  //     // dynamically add accessible routes
  //     router.addRoutes(accessRoutes)

  //     // reset visited views and cached views
  //     dispatch('tagsView/delAllViews', null, { root: true })

  //     resolve()
  //   })
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

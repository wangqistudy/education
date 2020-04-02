/*
 * @Author: David
 * @Date: 2019-11-01 13:56:04
 * @LastEditTime: 2019-11-29 11:45:17
 * @LastEditors: Do not edit
 * @Description: 弹框数据层
 */
/* eslint-disable */

const state = {
  previewInfo:{
    show:false,
    src:'',
    id:''
  },
  errorInfo:{
    
  } 
}
const mutations = {
    updatePreviewInfo (state,param) {
      state.previewInfo = param
    },
    updateErrorInfo (state,param) {
      
    }
}

const actions = {
    openPreview ({commit,state},param) {
      let id = 'viewr_'+Date.now()+''+Math.floor(Math.random()*10000)
      commit('updatePreviewInfo',Object.assign({},state.previewInfo,param,{show:true,id}))
    },
    closePreview ({commit,state},param) {
      commit('updatePreviewInfo',Object.assign({},state.previewInfo,param,{show:false}))
    },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


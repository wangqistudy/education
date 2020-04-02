/*
 * @Author: David
 * @Date: 2019-11-01 13:56:04
 * @LastEditTime: 2019-11-29 11:45:17
 * @LastEditors: Do not edit
 * @Description: 挑战筛选数据
 */
/* eslint-disable */

  const state = {
    '/system_set/teacher_set':{},
    '/course_setting/off_shelves':{},
    '/course_setting/on_shelves':{},
    '/course_setting/not_on_shelf':{},
    '/financial_mgr/order_mgr':{},
    '/financial_mgr/data_statistics':{},
    '/course_setting/not_on_shelf':{},
    '/usr_mgr/index':{}
  }
  const mutations = {
      updatePathRedirect (state,param) {
            let {path,data} = param
            state[path] = data
      }
  }
  
  const actions = {
      
  }
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions
  }
  
  
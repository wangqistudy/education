/*
 * @Author: David
 * @Date: 2019-11-19 10:34:35
 * @LastEditTime: 2019-12-05 15:14:20
 * @LastEditors: Do not edit
 * @Description: 检查权限
 */
/* eslint-disable */
import {mapGetters} from 'vuex'

export default {
  computed: {
    ...mapGetters(['roles']),
    
    // 检查此路径是否有编辑权限
    hasEditPermission () {
      let {roles} = this.$route.meta
      if (!roles&&roles.length<=0){
        return false;
      }
      roles = roles[0]
      return this.roles.indexOf(roles+'/编辑')>=0
    },
    // 检查此路径是否需要脱敏
    needSecret () {
      let {roles} = this.$route.meta
      if (!roles&&roles.length<=0){
        return false;
      }
      roles = roles[0]
      return this.roles.indexOf(roles+'/不脱敏')>=0
    }
  }
}
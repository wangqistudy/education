/*
 * @Author: David
 * @Date: 2019-11-04 15:11:59
 * @LastEditTime: 2019-11-04 15:12:56
 * @LastEditors: Do not edit
 * @Description: 
 */
/*eslint-disable*/
import {mapActions} from 'vuex'
export default {
  methods: {
    ...mapActions({
      openPreview:'dialog/openPreview'
    })
  },
}
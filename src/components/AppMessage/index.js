/*
 * @Author: David
 * @Date: 2019-11-29 13:47:55
 * @LastEditTime: 2019-12-04 16:08:35
 * @LastEditors: Do not edit
 * @Description: 
 */
/*eslint-disable*/

import Main from './index.vue';
import Vue from 'vue'
let AppMessageConstructor = Vue.extend(Main);

let instances = []
let seed = 0;


const AppMessage = function (option) {
      option = option||{}
      // //console.log(option)
      let id = 'app_message_'+(seed++);
      if (instances.length>0) {
        instances.forEach(item=>item.close())
      }
      let instance = new AppMessageConstructor({
          data:Object.assign(option,{visible:true})
      })
      // //console.log(instance)
      instance.id = id;
      instances.push(instance);
      instance.vm = instance.$mount();
      document.body.appendChild(instance.vm.$el);
}

export {
  AppMessage
};

export default {
  install (vue) {
      vue.prototype.$appmessage = AppMessage
  }
}

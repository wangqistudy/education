/*
 * @Author: David
 * @Date: 2019-08-22 15:35:11
 * @LastEditTime: 2019-11-29 15:24:42
 * @LastEditors: Do not edit
 * @Description: 
 */
/* eslint-disable */
import {getToken} from '@/utils/auth'
const axios = require ('axios')
const qs = require('qs')
import { MessageBox,Message } from 'element-ui';
import { AppMessage } from '@/components/AppMessage/index.js';
// import baseUrl from './urlConfig'

const baseUrl = process.env.NODE_ENV==='development'?'/api':'http://admin.zwk7.top/api';

const instance = axios.create({
    baseURL: baseUrl,
    timeout:30000
})

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么

    let token = getToken()
    if (token) {
      config.headers['token'] = token
      if (config.method=='post'){
        config.data = { 
            ...config.data, 
            token: token
        }
        let data = qs.stringify(config.data)
        config.data = data;
      }else if (config.method=='get'){
        config.params = { 
            ...config.params,
            token: token
        } 
      }
    }
    return config;
    
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    
    // 对响应数据做点什么
   
    let data = response.data;
    if (data.code==0){
      return response;
    }

    if (data.code==401){
      store.dispatch('user/LOGOUT')
      return Promise.reject(data);
    }

    if (data.code==1){
      
      AppMessage({
          message:data.message,
          type:'error',
      })
      
      return Promise.reject(data);
    }
    
    return response;
}, function (error) {
    MessageBox({
      title:'服务器错误',
      type:'error',
      message: error.response.data.message || '服务器错误',
      closeOnClickModal:false
    })
    return Promise.reject(error);
});
function post (url,data,config) {

    let {token} = global
    if (token){
        data.token = token
    }
    return new Promise((res,rej)=>{
        instance.post(url,data,config||{}).then(data=>{
            res(data.data);
        })
        .catch((err)=>{
            rej(err);
        })
    })
    
    
}

function get (url,params){
    return params?instance.get(url,{
        params
    }):instance.get(url);
}

export {post,get,baseUrl};

export default  {
    post,get
}
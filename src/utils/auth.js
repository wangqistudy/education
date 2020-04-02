/*
 * @Author: David
 * @Date: 2019-10-31 10:49:34
 * @LastEditTime: 2019-10-31 15:13:08
 * @LastEditors: Do not edit
 * @Description: 
 */
import Cookies from 'js-cookie'

const TokenKey = 'xinyidai_Admin_Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

/*
 * @Author: David
 * @Date: 2019-09-04 19:16:00
 * @LastEditTime: 2019-09-04 19:18:02
 * @LastEditors: Do not edit
 * @Description: 
 */
import Cookies from 'js-cookie'

export function getKey(key) {
  return Cookies.get(key)
}

export function setKey(key, val) {
  return Cookies.set(key, val)
}

export function removeKey(key) {
  return Cookies.remove(key)
}

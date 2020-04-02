/*
 * @Author: David
 * @Date: 2019-10-31 10:49:34
 * @LastEditTime: 2019-11-18 09:38:45
 * @LastEditors: Do not edit
 * @Description: 
 */
import defaultSettings from '@/settings'

const title = defaultSettings.title || '少儿编程'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}

/*
 * @Author: David
 * @Date: 2019-10-31 10:49:33
 * @LastEditTime: 2019-11-27 11:57:38
 * @LastEditors: Do not edit
 * @Description: 
 */
import Mock from 'mockjs'

const NameList = []
const count = 100

for (let i = 0; i < count; i++) {
  NameList.push(Mock.mock({
    name: '@first'
  }))
}
NameList.push({ name: 'mock-Pan' })

export default [
  
]

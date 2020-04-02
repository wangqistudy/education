<!--
 * @Author: David
 * @Date: 2019-11-06 13:57:34
 * @LastEditTime: 2019-11-12 16:41:08
 * @LastEditors: Do not edit
 * @Description: 顶部切换组件
 -->
<template>
  <div class="top-tab-wrap">
      <div class="top-tab-item" v-for="(tab,index) in tabs" :key="index" :class="{act:activeName==tab.id}" @click="handleClick(tab)">
          {{tab.value}}
      </div>
  </div>
</template>
<script>
export default {
  name:'topTab',
  model:{
    prop:'activeName',
    event:'changetab'
  },
  props:{
    tabs:{
      type:Array,
      default () {
        return [
          {value:'测试1',id:'act1'},
          {value:'测试2',id:'act2'},
        ]
      }
    },
    activeName:{
      type:[String,Number],
      default:'act1'
    }
  },
  data () {
    return {
      
    }
  },
  methods:{
    handleClick (tab) {
      if (this.activeName==tab.id) {
        return;
      }
      this.$emit('changetab',tab.id);
    }
  }
}
</script>
<style lang="scss">
  .top-tab-wrap{
    border-bottom:1px solid #eeeeee;
    .top-tab-item{
      display: inline-block;
      line-height: 40px;
      padding:0 18px;
      color:#444444;
      font-size:16px;
      position: relative;
      height: 40px;
      background-color:rgba(255, 255, 255,1);
      cursor: pointer;
      transition: background .1s linear;
      &.act{
        color:#fff;
        background-color:rgba(19, 195, 194,1);
        border-bottom:1px solid #13c3c2;
        top:1px;
        border-radius: 5px 5px 0 0 ;
        line-height: 39px;
      }
    }
  }
  
</style>
<!--
 * @Author: David
 * @Date: 2019-11-22 09:11:42
 * @LastEditTime: 2019-11-22 15:43:50
 * @LastEditors: Do not edit
 * @Description: 欢迎页
 -->
<template>
  <div class="welcomePage">
    <div class="container-wrap">
        <div class="container">
          <img :src="require('@/assets/icon_demo.png')" alt="">

          <h3>少儿编程后台管理系统</h3>

          <p>你好！欢迎回来</p>
      </div>
    </div>
      
  </div>
</template>
<script>
export default {
  name:'welcomePage',
  data () {
    return {

    }
  },
  methods:{
    
  }
}
</script>
<style lang="scss" scoped>
    .welcomePage{
      width: 100%;
      min-height: calc(100vh - 84px);
      background:#f6f9fc;
      overflow: hidden;
      .container-wrap{
        width:100%;
        text-align: center;
        width: 760px;
        height:607px;
        background:url('~@/assets/welcomeBg.png') no-repeat center top;
        background-size:cover;
        margin:0 auto;
        margin-top:50px;
        img{
          width: 160px;
        }
        h3{
          font-size:38px;
          text-align: center;
          color: #0150a4;
          margin-top:30px;
        }
        p{
          font-size:60px;
          text-align: center;
          margin-top:40px;
        }
      }
    }
</style>
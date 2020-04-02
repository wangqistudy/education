<!--
 * @Author: David
 * @Date: 2019-10-31 17:46:28
 * @LastEditTime: 2019-11-19 11:28:29
 * @LastEditors: Do not edit
 * @Description: 首页卡片
 -->
<template>
  <div class="ds-card-wrap">
        <div class="dscard">
            <div class="circle-icon-outer" :style="{backgroundColor:bg1}">
                <div class="circle-icon" :style="{backgroundColor:bg2}">
                  <svg-icon :icon-class="icon" />
                </div>
            </div>
            <div class="card-desc">
              <h2>{{title}}</h2>
              <p class="desc">{{desc}}</p>
              <p class="link" @click="handleLinkTo">
                点击查看<svg-icon icon-class="icon-jiantou" />
              </p>
            </div>
        </div>
  </div>
</template>
<script>
import {mapMutations} from 'vuex'
import moment from '@/utils/localMoment'
export default {
  name:'dsCard',
  props:{
    icon:{
      type:String,
      required:true
    },
    link:{
      type:String
    },
    title:{
      type:[String,Number],
      required:true
    },
    desc:{
      type:String,
      required:true
    },
    bg1:{
      type:String,
      required:true
    },
    bg2:{
      type:String,
      required:true
    }
  },
  data () {
    return {

    }
  },
  methods :{
    ...mapMutations({
        updatePathRedirect:'redirect/updatePathRedirect'
      }),
    handleLinkTo () {
        if (this.desc.indexOf('今日')>=0) {
          this.updatePathRedirect({path:this.link,data:{
            timeRange:[moment().format('YYYY-MM-DD')+' 00:00:00',moment().format('YYYY-MM-DD')+' 00:00:00']
          }})
          this.$router.push(this.link)
        }else if(this.link.indexOf('/financial_mgr/order_mgr')>=0){
          this.updatePathRedirect({path:this.link,data:{
            timeRange:[]
          }})
          this.$router.push(this.link)
        }else{
          this.$router.push(this.link)
        }
    }
  }
}
</script>
<style lang="scss" scoped>
  .ds-card-wrap{
    width: 100%;
    background-color:#fff;
    border-radius: 8px;
    .dscard{
      width:100%;
      padding-top:22px;
      padding-bottom:22px;
      padding-left:30px;
      display:flex;
      
      .circle-icon-outer{
        width: 106px;
        height: 106px;
        border-radius:106px;
        background-color:#edf2fe;
        display:flex;
        align-items:center;
        justify-content:center;
        margin-right:30px;
        .circle-icon{
          width: 68px;
          height: 68px;
          border-radius:68px;
          color:#fff;
          background-color:#4c84ff;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:36px;
          
        }
      }
    }
    .card-desc{
      h2{
        font-size:40px;
        color:#777;
        margin-bottom:8px;
      }
      .desc{
        font-size:16px;
        color:#ababab;
        margin-bottom:8px;
      }
      .link{
        color:#13c3c2;
        font-size:16px;
        cursor: pointer;
        a{
          color:#13c3c2;
        }
      }
    }
  }
</style>
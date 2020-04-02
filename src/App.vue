<!--
 * @Author: David
 * @Date: 2019-10-31 10:49:33
 * @LastEditTime: 2019-12-04 16:08:28
 * @LastEditors: Do not edit
 * @Description: 
 -->
<template>
  <div id="app">
    <router-view />


    <!-- 图片预览dialog -->
      <!-- <el-dialog :visible.sync="previewInfo.show" width="65%"  :close-on-click-modal="false" top="20px" :show-close="true" class="previewDialog">
          <div class="priview-img">
              <img :src="previewInfo.src||(require('@/assets/loginBg.jpg'))" alt="">
          </div>
      </el-dialog> -->
    <!-- 图片预览dialog -->

    <viewer ref="previews" v-if="this.previewInfo.show">
        <img
        width="0"
        :src="previewInfo.src"
        :key="previewInfo.src"
        :id="previewInfo.id"
      >
   </viewer>


  </div>
</template>

<script>
import {getToken} from '@/utils/auth'
import { mapActions,mapState } from 'vuex'
import AppMessage from '@/components/AppMessage/index.vue'
export default {
  name: 'App',
  components:{AppMessage},
  mounted() {
    
  },
  data () {
    return {
      showPre:false
    }
  },
  computed:{
    ...mapState({
      previewInfo:state=>state.dialog.previewInfo
    }),
    getPrevieImages () {
      return [this.previewInfo.src]
    }
  },
  watch:{
    'previewInfo.show' : function (news) {
        if (news) {
            // //console.log(this.previewInfo.id)
            this.$nextTick(()=>{
              document.getElementById(this.previewInfo.id).click()
              setTimeout(()=>{
                let hideDom1 = document.querySelector('[data-viewer-action=hide]')
                let hideDom2 = document.querySelector('.viewer-close.viewer-button')
                let ls = (e)=>{
                    if (e.target.nodeName=='IMG') {
                      return ;
                    }
                    this.previewInfo.show = false;
                    hideDom1.removeEventListener('click',ls)
                    hideDom2.removeEventListener('click',ls)
                }
                hideDom1.addEventListener('click',ls)
                hideDom2.addEventListener('click',ls)

              },100)
            })
            
            
        }else{
            this.showPre = news;
        }
        
        
    }
  },
  methods:{
    ...mapActions({
      updateLogin:'user/updateLogin'
    })
  }
}
</script>
<style lang="scss">
  *{
    margin:0;
    padding:0;
  }
  #app .el-dialog__header{
    border-bottom: 1px solid #ddd;
    padding-top: 20px;
  }
  .page-table .headrowcell{
    font-weight: bold !important;
  }
  .el-form-item .el-form-item__label{
    font-weight: 400;
  }
  .viewer-play.viewer-large{
    display:none;
  }
  .viewer-next{
    display:none;
  }
  .viewer-prev{
    display:none;
  }
  .html5EditTips{
    color:red;
        
  }
</style>

<style lang="scss" scoped>
  #app{

 
    .previewDialog{
      /deep/.el-dialog__header{
        border-bottom: 1px solid transparent;
      }
      .priview-img{
        width: 100%;
        text-align: center;
        img{
          max-width:100%;
          height: auto;
        }
      }
    }
   }
   
</style>

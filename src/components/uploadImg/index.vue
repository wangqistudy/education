<!--
 * @Author: David
 * @Date: 2019-11-01 11:07:09
 * @LastEditTime: 2019-12-04 16:09:17
 * @LastEditors: Do not edit
 * @Description: 图片上传控件
 -->
<template>
  <div class="upload-img-wrap">
      <div class="upload-img-inner">
          <div class="uploaded-img"  v-if="type==1">
            <div class="img-item el-upload el-upload--picture-card" v-for="(item,index) in fileList" :key="index">
                <img :src="item.url" alt="">
                <p class="img-opt">
                    <span @click="handlePictureCardPreview(item)">
                      <i class="el-icon-zoom-in"></i>
                    </span>
                    <span @click="handleLocalRemove(index)">
                      <i class="el-icon-delete"></i>
                    </span>
                </p>
            </div>
          </div>
          <div class="uploaded-img"  v-if="type==2">
            <div class="img-item el-upload el-upload--picture-card" v-for="(item,index) in fileList" :key="index">
                <video :src="item.url" controls width="100%" height="100%"></video>
                <p class="img-opt1">
                    <span @click="handlePictureCardPreview(item)" v-if="!(type==2)">
                      <i class="el-icon-zoom-in"></i>
                    </span>
                    <span @click="handleLocalRemove(index)">
                      <i class="el-icon-delete"></i>
                    </span>
                </p>
            </div>
          </div>
          <div class="input-wrap">
              <el-upload
                :action="actionUrl+'?token='+token"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :on-progress="handleProgress"
                :on-error="handleError"
                :file-list="fileList"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :accept="accept"
                :limit="fileNumber"
                v-if="fileList.length<fileNumber"
                class="el-upload"
                >
                <i class="el-icon-plus"></i>
              </el-upload>
              <p>{{desc}}</p>
          </div>

          <!-- loading -->
          <div class="loading-wrap" v-show="showLoading" v-loading="showLoading" >
          </div>
          
      </div>
  </div>
</template>
<script>
import {mapActions} from 'vuex'
import {getToken} from '@/utils/auth'
import { MessageBox, Message } from 'element-ui'
export default {
  name:'uploadImg',
  model:{
    event:'changelist'
  },
  props:{
    // 
    type:{
      type:String,
      default () {
        return '1' // 1 图片  2视频
      }
    },

    // 图片数量
    fileNumber:{
      type:Number,
      default () {
        return 1;
      }
    },
    
    // 图片高宽
    imgSize:{
      type:Object,
      default () {
        return {
          width:250,
          height:250
        };
      }
    },

    // 文件大小
    fileStorageSize:{
      type:Number,
      default () {
        return 1024   //单位kb
      }
    },

    desc:{
      type:String,
      default:''
    },

    // 接收文件类型
    accept:{
      type:String,
      default () {
        return '.png,.jpeg,.JPG,.gif'
      }
    },
    // 接收文件类型
    actionUrl:{
      type:String,
      required:true
    },

    // 文件列表 
    files:{
      type:Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      fileList:this.files,
      token:getToken(),
      loadingProgress:0,
      showLoading:false
    }
  },
  watch:{
    'files':{
      handler (list) {
        // //console.log(this.files)
        this.fileList = this.files.map((item)=>item)
      },
      immediate:true,
      deep:true
    }
  },
  methods:{
    
    handleLocalRemove (index) {
      this.fileList.splice(index,1);
      this.$emit('changelist',this.fileList)
    },
    handleRemove(file, fileList) {
      
    },
    handleSuccess (data) {
      this.showLoading = false;
      this.fileList.push({url:data.url})
      this.$emit('changelist',this.fileList)
    }, 
    handlePictureCardPreview(file) {
        this.openPreview({src:file.url})
    },
    handleProgress (event, file, fileList) {
        this.showLoading = true;
        let {percent} = event
        this.loadingProgress = percent;
        //console.log(event,file,fileList)
    },
    handleError (error) {
      this.showLoading = false;
      this.loadingProgress = 0;
      // //console.log({error})
      try {
        error.message = JSON.parse(error.message)
        MessageBox({
          title:'上传文件出错',
          type:'error',
          message: error.message.message || '上传文件出错',
          closeOnClickModal:false
        })
      }catch(e) {

      }
      
    },
    beforeUpload () {
      return true
    }
  }
  
}
</script>
<style lang="scss" scoped>
    .upload-img-wrap{
      width:100%;
      .upload-img-inner{
        width:100%;
        display:flex;
        .input-wrap{
          display: flex;
          align-items: flex-end;
          .el-upload{
            margin-right:10px;
          }
          p{
            color:#b0b0b0;
          }
        }
        .uploaded-img{
          display: flex;
          .img-item{
            margin-right:10px;
            position: relative;
            img{
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .img-opt{
              width: 100%;
              height:100%;
              background-color:rgba(0,0,0,0.5);
              display:flex;
              justify-content: center;
              align-items: center;
              display: none;
              position: absolute;
              top:0;
              i{
                color:#fff;
              }
            }
            .img-opt1{
              position: absolute;
              top:10px;
              right:10px;
              line-height: 30px;
              display: none;
              i{
                color:#666;
              }
            }
            &:hover{
              .img-opt{
                display: block;
              }
              .img-opt1{
                display: block;
              }
            }
          }
        }
      }
    }
    .loading-wrap{
      position: absolute;
      width:148px;
      height: 148px;
      top:0;
      left: 0;
      z-index: 200;
      background-color:rgba(0,0,0,0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      /deep/.el-progress__text{
        color:#fff;
      }
    }
</style>
<!--
 * @Author: David
 * @Date: 2019-10-31 19:13:06
 * @LastEditTime: 2019-12-04 16:04:06
 * @LastEditors: Do not edit
 * @Description: 通用设置
 -->
<template>
  <div class="comment-set-wrap page-wrap">
      <div class="common-set  page-inner">
          <p class="set-header page-header">
              通用设置
          </p>

          <div class="set-form">
              <el-form label-width="100px" label-position="right" :model="formData" ref="formData" :rules="formRule">
                <el-form-item label="公司名称：" prop="common.company_name">
                    <el-input v-model="formData.common.company_name"></el-input>
                </el-form-item>
                <el-form-item label="公司地址：" prop="common.address">
                    <el-input v-model="formData.common.address"></el-input>
                </el-form-item>
                <div class="inline">
                    <el-form-item label="机构电话：" prop="common.telephone">
                        <el-input v-model="formData.common.telephone"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱：" prop="common.email">
                        <el-input v-model="formData.common.email"></el-input>
                    </el-form-item>
                </div>
                 <div class="inline">
                    <el-form-item label="客服微信：" prop="common.wechat">
                        <el-input v-model="formData.common.wechat"></el-input>
                    </el-form-item>
                    <el-form-item label="QQ群号："  prop="common.qq">
                        <el-input v-model="formData.common.qq"></el-input>
                    </el-form-item>
                </div>

                 <!-- <div class="inline">
                    <el-form-item label="备案号：" prop="common.aduit" required>
                        <el-input v-model="formData.common.aduit"></el-input>
                    </el-form-item>
                </div> -->
                <el-form-item label="备案号：" prop="common.aduit">
                    <el-input v-model="formData.common.aduit"></el-input>
                </el-form-item>

                <el-form-item label="用户协议：" prop="protocol.content_2">
                    <editorCom
                    v-model="formData.protocol.content_2"
                    :options="editOptions"
                    >
                      
                    </editorCom>
                </el-form-item>

                <el-form-item label="报名协议：" prop="protocol.content_1">
                    <editorCom
                    v-model="formData.protocol.content_1"
                    :options="editOptions"
                    >
                      
                    </editorCom>
                </el-form-item>

                <el-form-item label="机构介绍：" required prop="aboutUs.detail">
                    <editorCom
                    v-model="formData.aboutUs.detail"
                    :options="editOptions"
                    >
                      
                    </editorCom>
                </el-form-item>
                
              </el-form>

              <div class="subBtn-list" v-if="hasEditPermission">
                  <el-button type="success" @click="handleSave">
                      确定
                  </el-button>
              </div>
          </div>
      </div>
  </div>
</template>
<script>
import editorCom from '@/components/editor/editorCom.vue'
import uploadImg from '@/components/uploadImg'
import filterCom from '@/components/filterCom'
import api from '@/utils/api'
import {apiList} from '@/utils/api'
import {getToken} from '@/utils/auth'
export default {
    name:'commonSet',
    components:{editorCom,uploadImg,filterCom},
    
    data () {
      
      let validateTelPhone = (rule,value,cb)=>{
          let telReg = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
          let mobileReg = /^1(3|4|5|7|6|8)\d{9}$/
          if (telReg.test(value)||mobileReg.test(value)){
            return cb()
          }
          return cb(new Error('号码格式不对'))
      }

      let validateEmail = (rule,value,cb)=>{
        let emailReg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
        if (!emailReg.test(value)){
          return cb(new Error('邮箱格式不正确'))
        }
        cb()
      }

      return {
        editOptions:{
            uploadJson:'/api'+apiList.protocol_upload+'?token='+getToken()
        },
        imgList:[],
        formData:{
          common:{
            company_name:'',
            address:'',
            telephone:'',
            wechat:'',
            aduit:'',
            qq:'',
            email:'',
          },
          aboutUs:{
            detail:''
          },
          protocol:{
            content_1:'',//报名协议
            content_2:''//用户协议
          }
          
        },
        formRule:{
          'common.company_name':[
            {required:true,message:'请填写公司名称',trigger:'blur'}
          ],
          'common.address':[
            {required:true,message:'请填写公司地址',trigger:'blur'}
          ],
          'common.telephone':[
            {required:true,message:'请填写公司电话',trigger:'blur'},
            {validator:validateTelPhone,trigger:'blur'},
          ],
          'common.email':[
            {required:true,message:'请填写邮箱',trigger:'blur'},
            {validator:validateEmail,trigger:'blur'},
          ],
          'common.wechat':[
            {required:true,message:'请填写微信群号',trigger:'blur'},
          ],
          'common.qq':[
            {required:true,message:'请填写QQ号',trigger:'blur'},
          ],
          'common.aduit':[
            {required:true,message:'请填写QQ号',trigger:'blur'},
          ],
          'protocol.content_2':[
            {required:true,message:'请填写协议',trigger:'blur'},
          ],
          'protocol.content_1':[
            {required:true,message:'请填写协议',trigger:'blur'},
          ],
          'aboutUs.detail':[
            {required:true,message:'请填写机构介绍',trigger:'blur'},
          ],

        }
      }
    },
    mounted () {
      this.getPageInfo();
    },
    methods:{
      handleSave () {
        this.$refs.formData.validate(valid=>{
          if (valid) {
            let param = JSON.parse(JSON.stringify(this.formData))
            let protocol = param.protocol;
            param.protocol = {}
            param.protocol[1] = {content:protocol.content_1}
            param.protocol[2] = {content:protocol.content_2}

            api.common_set_save(param)
            .then(data=>{
                this.$appmessage({
                  type:'success',
                  message:'保存成功'
                })
            })
          }
        })
      },
      hadleDoSearch (str) {
        
      },
      setForm (data) {
        let {common,aboutUs,protocol} = data;
        Object.keys(this.formData.common).forEach((key)=>{
          this.formData.common[key] = common[key]
        })
        Object.keys(this.formData.aboutUs).forEach((key)=>{
          this.formData.aboutUs[key] = aboutUs[key]
        })

        Object.keys(this.formData.protocol).forEach((key)=>{
          let index;
          if (key=='content_1') {
              index=1;
          }
          if (key=='content_2') {
            index=2;
          }
          index&&(this.formData.protocol[key] = protocol[index].content)
        })
        
      },  
      getPageInfo () {
        api.common_set_detail()
        .then(response=>{
          let {data} = response;
          this.setForm(data);
        })
      }
    }
}
</script>
<style lang="scss" scoped>
  .page-wrap{
    width: 100%;
    padding-top:13px;
    padding-bottom:13px;
    .page-inner{
      max-width:1200px;
      width: 100%;
      padding-bottom:24px;
      margin:0 auto;
      background-color:#fff;
    }
  }
  .page-header{
    padding-top:18px;
    padding-left:27px;
    padding-bottom:14px;
    border-bottom:1px solid #f7f7f7;
    color:#444444;
  }
  .set-form{
    margin-top:18px;
    padding-left:50px;
    padding-right:26px;
  }
  .inline{
    .el-form-item{
      display: inline-block;
    }
  }
  .subBtn-list{
    text-align: center;
    .el-button{
      border-radius: 0px;
    }
  }
</style>
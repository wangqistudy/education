<!--
 * @Author: David
 * @Date: 2019-10-31 19:13:06
 * @LastEditTime: 2019-11-19 11:22:11
 * @LastEditors: Do not edit
 * @Description: 小区设置
 -->
<template>
  <div class="comment-set-wrap page-wrap">
      <div class="common-set  page-inner">
          <p class="set-header page-header">
              签到IP设置  <span>(注意:非下列IP地址签到时，IP显示红色)</span>
          </p>
          
          <div class="page-table">
              <div class="tag-wrapper">
                <el-tag
                  v-for="tag in tableData"
                  :key="tag.ip"
                  :closable="hasEditPermission"
                  :type="tag.type"
                  @close="proxy_handleDelete(tag.id,'handleDelete')"
                  >
                  {{tag.ip}}
                </el-tag>

                <el-button type="primary" icon="el-icon-plus" @click="handleEdit(null,'add')" size="mini" v-if="hasEditPermission">
                  新增
                </el-button>
              </div>
          </div>
          
      </div>

      <!-- 修改面板 -->
      <el-dialog :visible.sync="showEdit" width="526px"  :close-on-click-modal="false" :title ="`${dialogType=='edit'?'修改':'新增'}IP地址`">

          <el-form :model="formData" :rules="formRule" ref="formData">
              <el-form-item  prop="ip">
                  <el-input
                  v-model="formData.ip"
                  >

                  </el-input>
              </el-form-item>
          </el-form>

          <div class="subBtn">
            <el-button type="success" @click="handleSub">确定</el-button>
          </div>
      </el-dialog>
      <!-- 修改面板 -->
      
  </div>
</template>
<script>
import editorCom from '@/components/editor/editorCom.vue'
import uploadImg from '@/components/uploadImg'
import filterCom from '@/components/filterCom'
import pagination from '@/mixins/pagination'
import api from '@/utils/api'
import {apiList} from '@/utils/api'
export default {
    name:'subjectSet',
    components:{editorCom,uploadImg,filterCom},
    mixins:[pagination],
    data () {

      let validateAddress = (rule,value,cb) => {
          let  pattern = /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g
          if (!value) {
            return cb(new Error('请填写ip地址'))
          }
          if (!pattern.test(value)){
            return cb(new Error('ip地址格式不正确'))
          }
          cb()
      }
     

      return {
        imgList:[],
        listApi:api.sign_ip_list,
        dialogType:'add',//edit 修改  add 新增
        formData:{
          name:''
        },
        formRule:{
          ip:[
            {validator:validateAddress}
          ]
        },
        showEdit:false,
        apiList,
        pageSize:10000
      }
    },
    mounted () {
        this.getList();
    },
    methods:{
        handleDelete (id) {
          api.sign_ip_delete({id})
          .then(data=>{
            this.showEdit = false;
            this.getList()
          })
        },
        handleSub () {
          this.$refs.formData.validate(valid=>{
            if (valid) {
                let param = JSON.parse(JSON.stringify(this.formData))
                api.sign_ip_save(param)
                .then(data=>{
                  this.showEdit = false;
                  this.$appmessage({
                    type:'success',
                    message:data.message||'添加成功'
                  })
                  this.getList()
                })
            }
          })
        },
        handleEdit (item,type) {
            this.dialogType = type
            if (type=='add') {
                this.formData = {
                  
                }
                this.imgList = []
                this.showEdit = true;
                return
            }
            Object.keys(item).forEach(key=>{
              this.$set(this.formData,key,item[key])
              if (key=='thumbnail') {
                  this.imgList = [{url:item[key]}]
              }
            })
            
            this.showEdit = true;
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
      .page-table{
        padding: 0 32px;
        margin-top:22px;
      }
    }
  }
  .page-header{
    padding-top:18px;
    padding-left:27px;
    padding-bottom:14px;
    border-bottom:1px solid #f7f7f7;
    color:#444444;
    span{
      color:#ffa524;
    }
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
  .page-table{
    background-color:#fff;
    /deep/.headrow{
      height: 40px;
    }
    /deep/.headrowcell{
      background-color:#eeeeee;
      font-size: 14px;
      font-weight: 400;
    }
    /deep/.has-gutter{
      color:#666666;
    }
    .pagination{
      padding:10px 0;
      border-top:1px solid #ddd;
    }
  }

  .img-item{
      position: relative;
      width: 122px;
      height:67px;
      margin:0 auto;
      img{
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .img-opt{
        width: 100%;
        height:100%;
        background-color:rgba(0,0,0,0.5);
        display: none;
        position: absolute;
        top:0;
        i{
          color:#fff;
          line-height: 67px;
          font-size: 30px;
          cursor: pointer;
        }
      }
      &:hover{
        .img-opt{
          display: block;
        }
      }
    }
    .subBtn{
      text-align: center;
      margin-top:20px;
    }
    .header-btn{
      margin-bottom:20px;
    }
    .tag-wrapper{
      min-height: 550px;
      .el-tag{
        margin-right:20px;
      }
    }
</style>
<!--
 * @Author: David
 * @Date: 2019-10-31 19:13:06
 * @LastEditTime: 2019-12-05 17:18:07
 * @LastEditors: Do not edit
 * @Description: 账号设置
 -->
 <!-- eslint-disable -->
<template>
  <div class="comment-set-wrap page-wrap">

    
      <div class="common-set  page-inner">
          <p class="set-header page-header">
              账号设置
          </p>
          
          <div class="page-table">
              
              <div class="filter-wrap">
                <filterCom
                :filterOptions="filterOptions"
                @dosearch="handleDoSearch"
                type="keyValue"
                >
                 <template slot="anotherbtn">
                    <el-button type="success" icon="el-icon-plus" @click="handleEdit(null,'add')">新增账号</el-button>
                 </template>
                </filterCom>
              </div>

              

              <el-table
              :data="tableData"
              header-row-class-name="headrow"
              header-cell-class-name="headrowcell"
              v-loading="pageLoading"
              >
                <el-table-column
                prop="id"
                label="序号"
                header-align="center"
                align="center"  width="50px"
                >
                </el-table-column>
                
                <el-table-column
                label="账号"
                header-align="center"
                align="center"
                prop="login"
                >
                 
                </el-table-column>

                <el-table-column
                label="工号"
                header-align="center"
                align="center"
                prop="job_num"
                >
                    
                </el-table-column>

                
                

                <el-table-column
                prop="roleName"
                label="角色"
                header-align="center"
                align="center"
                >
                </el-table-column>

               

                <el-table-column
                label="操作"
                header-align="center"
                align="center"
                min-width="140px"
                >

                  <template slot-scope="scope">
                      <el-button size="mini" type="primary" @click="handleEdit(scope.row,'edit')">
                          修改
                      </el-button>
                      <el-button type="default" size="mini" @click="handleDisable(scope.row)">
                          {{scope.row.is_banned==1?`启用`:'禁用'}}
                      </el-button>
                  </template>

                </el-table-column>

                

                

              </el-table>

              <div class="pagination">
                <el-pagination
                  @current-change="handleCurrentChange"
                  :current-page.sync="currPage"
                  :page-size="pageSize"
                  layout="prev, pager, next, jumper"
                  :total="totalCount">
                </el-pagination>
              </div>
          </div>
          
      </div>


      <!-- 修改面板 -->
      <el-dialog :visible.sync="showEdit" width="526px"  :close-on-click-modal="false" :title ="`${dialogType=='edit'?'修改':'新增'}信息`">

          <el-form :model="formData" label-width="100px" :rules="formRule" ref="formData">
              <el-form-item label="账号：" prop="login">
                  <el-input
                  v-model="formData.login"
                  placeholder="设置账号(数字\汉字\字母\字符组合，位数不限制)"
                  >
                      
                  </el-input>
              </el-form-item>

              <el-form-item label="密码：" prop="password">
                  <el-input
                  v-model="formData.password"
                  type="password"
                  placeholder="设置密码(6-16位数字\字母组合)"
                  >
                      
                  </el-input>

                  <span style="font-size:12px;color:#aaa;"></span>
              </el-form-item>

              <el-form-item label="工号：" prop="job_num">
                  <el-input
                  v-model="formData.job_num"
                  >
                      
                  </el-input>
              </el-form-item>

              <el-form-item label="角色：" prop="role_id">
                  <el-select v-model="formData.role_id" style="width:100%;">
                      <el-option v-for="(role,index) in roleConfig" :key="index" :label="role.value" :value="role.id">

                      </el-option>
                  </el-select>
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
import Calendar from '@/components/Calendar'
import TopTab from '@/components/TopTab'
import pagination from '@/mixins/pagination'
import api from '@/utils/api'
import {apiList} from '@/utils/api'
export default {
    name:'dataStatistics',
    components:{editorCom,uploadImg,filterCom,Calendar,TopTab},
    mixins:[pagination],
    data () {

      let validateEmpty = (rule,value,cb)=>{
        if (!value) {
            return cb(new Error('请填写信息'))
          }
          cb()
      }

      let validatePass = (rule,value,cb) => {
          if (!value&&!this.formData.id) {
            return cb(new Error('请填写密码'))
          }
          let reg = /^[0-9A-Za-z]{6,16}$/
          if (!reg.test(value)){
            return cb(new Error('密码应为6-16位数字、字母组成'))
          }
          cb()
      }
      

      return {
        imgList:[],
        videoList:[],
        listApi:api.manager_list,
        activeName:'act1',
        filterOptions:[
          {  label:'账号:',filed:'login' , opt:'$like' , options:[] , defaultValue:'' , type:'input' , optionUrl:'' },
          {  label:'工号:',filed:'job_num' , opt:'$eq' , options:[] , defaultValue:'' , type:'input' , optionUrl:'' },
          {  label:'角色:',filed:'role_id' , opt:'$eq' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
         
        ],
        teacherConfig:[],
        dialogType:'edit',//edit 修改  add 新增
        pageType:'table',//edit   table
        formData:{
          
        },
        formRule:{
          login:[
            {validator:validateEmpty}
          ],
          password:[
            {validator:validatePass}
          ],
          job_num:[
            {validator:validateEmpty}
          ],
          role_id:[
            {validator:validateEmpty}
          ]
        },
        showEdit:false,
        showViewHistory:false,
        apiList,
        gradeConfig:[],
        subjectConfig:[],
        roleConfig:[],
      }
    },
    mounted () {
        this.getList();
        this.getOptions();
    },
    computed :{
     
    },
    methods:{
        handleDisable (row) {
            let {id,is_banned} = row
            is_banned = is_banned==1?0:1;
            api.manager_disable({id,is_banned})
            .then(data=>{
              row.is_banned = is_banned;
            })
        },
        handleDoSearch (filter) {
            this.setDataFilters(filter)
            this.getList()
        },
        handleDelete (id) {
          
          api.teacher_delete({id})
          .then(data=>{
            this.showEdit = false;
            this.getList()
            this.$appmessage({
              type:'success',
              message:data.message||'删除成功'
            })
          })
        },
        getOptions () {
          api.manager_config()
          .then(data=>{ 
            this.roleConfig = data.data;
            this.filterOptions[2].options = JSON.parse(JSON.stringify(data.data))
          })
        },  
        handleSub () {
          this.$refs.formData.validate(valid=>{
            if (valid) {
                let param = JSON.parse(JSON.stringify(this.formData))
                api.manager_save(param)
                .then(data=>{
                  this.showEdit = false;
                  this.getList()
                  this.$appmessage({
                    type:'success',
                    message:data.message||'保存成功'
                  })
                })
            }
          })
        },
        handlePictureCardPreview(file) {
            this.openPreview({src:file.thumbnail})
        },
        handleEdit (item,type) {
            this.dialogType = type
            if (type=='add') {
                this.formData = {
                  
                }
                this.showEdit = true;
                return
            }
            this.formData = {
              
            }
            api.manager_detail({id:item.id})
            .then(data=>{
                let info = data.data
                Object.keys(info).forEach(key=>{
                  this.$set(this.formData,key,info[key])
                })
                this.showEdit = true;
            })
            
            
        }
    }
}
</script>
<style lang="scss" scoped>
  .page-wrap{
    width: 100%;
    padding:0 20px;
    padding-top:13px;
    padding-bottom:13px;
    .page-inner{
      width: 100%;
      padding-bottom:24px;
      margin:0 auto;
      background-color:#fff;
      &.video-set{
        max-width: 1200px;
        margin:0 auto;
      }
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

  .page-tables{
    background-color:#fff;
    padding:0 ;
    padding-top:20px;
    .el-form{
      .line{
        border-bottom:1px solid #dddddd;
      }
    }
    .doc-list{
      margin-top:20px;
      padding:0 32px;
      .doc-item{
        .item-header{
          margin-bottom:20px;
          display: flex;
          justify-content: space-between;
          .doc-left{
            .doc-label{
              width: 120px;
              padding-right:12px;
              display: inline-block;
              text-align: right;
            }
            .doc-no{
              font-size:16px;
              color:#333333;
              margin-right:15px;
            }
            .doc-title{
              color:#333;
              margin-right:74px;
            }
            .doc-teacher{
              color:#0566ce;
            }
            
          }
          .doc-right{
            font-size:16px;
            color:#333333;
          }
        }
      }
    }
    /deep/.headrowcell{
      font-size: 18px;
      font-weight: 400;
    }

    .botton-back{
      text-align: center;
      margin-top:20px;
    }
    .lesson-name,.teacher-name{
        font-size:16px !important;
        color:#0566ce !important;
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
    .filter-form-wrap{
      /deep/.el-select {
        /deep/.el-input{
          width:136px;

        }
      }
      /deep/.el-input{
          width:136px;

      }
    }
    .people-wrap{
      .avatar{
        width: 50px;
        height: 50px;
        border-radius: 50px;
        margin-right:8px;
      }
      .name{
        color:#0566ce;
      }
    }
    .tab-wrapper{
      margin-bottom:20px;
      width: 100%;
    }
    .filter-wraps{
      /deep/.el-select {
        width: 100%;
        /deep/.el-input{
          width:100%;

        }
      }
      /deep/.el-input{
          width:100%;

      }
    }

    .data-preview{
      display: flex;
      margin-bottom:15px;
      p{
        margin-right:34px;
        font-size:16px;
        span{
          color:#fb3131;
          font-size:18px;
        }
      }
    }
    .item-inner{
      width:300px;
      
    }
    .viewHistory{
      color:#0566ce;
      cursor: pointer;
    }
</style>
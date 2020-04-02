<!--
 * @Author: David
 * @Date: 2019-10-31 19:13:06
 * @LastEditTime: 2019-11-29 15:46:30
 * @LastEditors: Do not edit
 * @Description: 账号设置
 -->
 <!-- eslint-disable -->
<template>
  <div class="comment-set-wrap page-wrap">

    
      <div class="common-set  page-inner">
          <p class="set-header page-header">
              日志
          </p>
          
          <div class="page-table">
              
              <div class="filter-wrap">
                <filterCom
                :filterOptions="filterOptions"
                @dosearch="handleDoSearch"
                type="keyValue"
                >
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
                label="工号"
                header-align="center"
                align="center"
                prop="job_num"
                >
                 
                </el-table-column>

                <el-table-column
                label="ip地址"
                header-align="center"
                align="center"
                prop="ip"
                >
                    
                </el-table-column>

                <el-table-column
                label="模块"
                header-align="center"
                align="center"
                prop="module_name"
                >
                    
                </el-table-column>
                

                <el-table-column
                prop="note"
                label="简介"
                header-align="center"
                align="center"
                >
                </el-table-column>

                <el-table-column
                prop="before_data"
                label="操作前数据"
                header-align="center"
                align="center"
                >
                </el-table-column>


                <el-table-column
                prop="after_data"
                label="操作后数据"
                header-align="center"
                align="center"
                >
                </el-table-column>


                <el-table-column
                prop="operateion_time"
                label="操作时间"
                header-align="center"
                align="center"
                >
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
    name:'journal',
    components:{editorCom,uploadImg,filterCom,Calendar,TopTab},
    mixins:[pagination],
    data () {

      let validateEmpty = (rule,value,cb)=>{
        if (!value) {
            return cb(new Error('请填写信息'))
          }
          cb()
      }

      let validateAddress = (rule,value,cb) => {
          if (!value) {
            return cb(new Error('请填写地址'))
          }
          cb()
      }
      let validateThumbnail = (rule,value,cb) => {
          if (!value) {
            return cb(new Error('请上传图片'))
          }
          cb()
      }


      let validateMobile = (rule,value,cb) => {
          if (!value) {
            return cb(new Error('请填写联系方式'))
          }
          cb()
      }

      let validateName = (rule,value,cb) => {
          
          if (!value) {
            return cb(new Error('请填写校区名'))
          }
          cb()
      }

      return {
        imgList:[],
        videoList:[],
        listApi:api.operation_log_list,
        activeName:'act1',
        filterOptions:[
          {  label:'模块:',filed:'module_id' , opt:'$like' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
          {  label:'操作时间:',filed:'timeRange' , opt:'$eq' , options:[] , defaultValue:'' , type:'dateRange' , optionUrl:'' }
         
        ],
        teacherConfig:[],
        dialogType:'edit',//edit 修改  add 新增
        pageType:'table',//edit   table
        formData:{
          
        },
        formRule:{
          title:[
            {validator:validateEmpty}
          ],
          thumbnail:[
            {validator:validateEmpty}
          ],
          url:[
            {validator:validateEmpty}
          ],
          grade_id:[
            {validator:validateEmpty}
          ],
          subject_id:[
            {validator:validateEmpty}
          ],
          type_id:[
            {validator:validateEmpty}
          ],
          teacher_id:[
            {validator:validateEmpty}
          ],
          introduce:[
            {validator:validateEmpty}
          ]
        },
        showEdit:false,
        showViewHistory:false,
        apiList,
        gradeConfig:[],
        subjectConfig:[],
        typeConfig:[],
      }
    },
    mounted () {
        this.getList();
        this.getOptions();
    },
    computed :{
     
    },
    methods:{
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
          api.operation_log_config()
          .then(data=>{ 
              this.filterOptions[0].options = data.data;
          })  
        },  
       
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
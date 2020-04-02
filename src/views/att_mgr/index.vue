<!--
 * @Author: David
 * @Date: 2019-10-31 19:13:06
 * @LastEditTime: 2019-12-05 15:14:58
 * @LastEditors: Do not edit
 * @Description: 签到管理
 -->
<template>
  <div class="comment-set-wrap page-wrap">
      <div class="common-set  page-inner">
          <p class="set-header page-header">
              签到管理 <span>(注：非系统设置的IP地址签到时，IP显示红色)</span>
          </p> 
          
          <div class="page-table">

              <div class="filter-wrap">
                <filterCom
                :filterOptions="filterOptions"
                @dosearch="handleDoSearch"
                type="keyValue"
                >
                  <template slot="anotherbtn">
                      <el-button type="success" icon="el-icon-plus" @click="handleEdit(null,'add')">
                        新增签到
                      </el-button>

                      <el-button type="warning" icon="el-icon-plus" @click="handleEdit(null,'edit')">
                        新增签退
                      </el-button>

                      <el-button type="primary" @click="handleExport('/api'+apiList.search_list)" v-if="needSecret">
                        导出Excel
                      </el-button>
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
                label="工号"
                header-align="center"
                align="center"
                prop="job_num"
                >
                 
                </el-table-column>
                <el-table-column
                prop="sign_in"
                label="签到时间"
                header-align="center"
                align="center"

                >
                </el-table-column>

                <el-table-column
                label="签到IP地址"
                header-align="center"
                align="center"
                >
                  <template slot-scope="scope">
                      <span :class="{red:scope.row.sign_in_ip_illegal==1}">{{scope.row.sign_in_ip}}</span>
                  </template>
                </el-table-column>


                <el-table-column
                prop="sign_in_note"
                label="签到备注"
                header-align="center"
                align="center"
                >
                </el-table-column>

                <el-table-column
                prop="sign_out"
                label="签退时间"
                header-align="center"
                align="center"
                >
                </el-table-column>

                <el-table-column
                label="签退IP地址"
                header-align="center"
                align="center"
                >
                  <template slot-scope="scope">
                      <span :class="{red:scope.row.sign_out_ip_illegal==1}">{{scope.row.sign_out_ip}}</span>
                  </template>
                </el-table-column>

                <el-table-column
                prop="sign_out_note"
                label="签退备注"
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

      <!-- 修改面板 -->
      <el-dialog :visible.sync="showEdit" width="626px"  :close-on-click-modal="false" :title ="`新增${dialogType=='edit'?'签退':'签到'}`">

          <el-form :model="formData" label-width="100px" :rules="formRule" ref="formData">

              <el-form-item label="备注：" prop="note">
                  <el-input v-model="formData.note" type="textarea">

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
    name:'attMgr',
    components:{editorCom,uploadImg,filterCom},
    mixins:[pagination],
    data () {

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
        listApi:api.search_list,
        filterOptions:[
          {  label:'工号:',filed:'job_num' , opt:'$like' , options:[] , defaultValue:'' , type:'input' , optionUrl:'' },
          {  label:'签到时间段:',filed:'timeRange' , opt:'$eq' , options:[] , defaultValue:'' , type:'dateRange' , optionUrl:'' }
        ],
        dialogType:'add',//edit 修改  add 新增
        showInput:false,
        formData:{
          note:''
        },
        inputData:{

        },
        inputRule:{

        },
        formRule:{
          address:[
            {validator:validateAddress}
          ],
          mobile:[
            {validator:validateMobile}
          ],
          name:[
            {validator:validateName}
          ],
          thumbnail:[
            {validator:validateThumbnail}
          ]
        },
        showEdit:false,
        apiList
      }
    },
    mounted () {
        this.getList();
    },
    methods:{  
        handleDelete (id) {
            
        },
        handleDoSearch (filter) {
            this.setDataFilters(filter)
            this.getList()
        },
        handleSub () {
            let type = this.dialogType=='add'?1:2;
            api.sign_admin_in({type,note:this.formData.note})
            .then(data=>{
              this.getList()
              this.showEdit = false
            })
            
        },
        
        handlePictureCardPreview(file) {
            this.openPreview({src:file.thumbnail})
        },
        handleEdit (item,type) {
            this.dialogType = type
            this.formData.note = ''
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
    .el-form-item{
      .el-tag{
        margin-right:10px;
      }
    }
    .activity_input_wrap{
      .iptIcon{
        font-size:20px;
        margin-left:20px;
        i{
          margin-right:10px;
          cursor: pointer;
        }
      }
    }
    .red{
      color:red;
    }
</style>
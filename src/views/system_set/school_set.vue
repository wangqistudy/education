<!--
 * @Author: David
 * @Date: 2019-10-31 19:13:06
 * @LastEditTime: 2019-12-04 09:44:42
 * @LastEditors: Do not edit
 * @Description: 小区设置
 -->
<template>
  <div class="comment-set-wrap page-wrap">
      <div class="common-set  page-inner">
          <p class="set-header page-header">
              校区设置
          </p>
          
          <div class="page-table">

              <div class="header-btn">
                <el-button icon="el-icon-plus" type="primary" @click="handleEdit(null,'add')" v-if="hasEditPermission">新增</el-button>
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
                label="校区名称"
                header-align="center"
                align="center"
                prop="name"
                >
                 
                </el-table-column>
                <el-table-column
                prop="address"
                label="地址"
                header-align="center"
                align="center"
                >
                </el-table-column>

                <el-table-column
                prop="mobile"
                label="电话"
                header-align="center"
                align="center"
                >
                </el-table-column>

                <el-table-column
                label="图片"
                header-align="center"
                align="center"
                >
                  <template slot-scope="scope">
                      <div class="imgWrap img-item">
                          <img :src="scope.row.thumbnail" alt="">
                          <p class="img-opt">
                              <span @click="handlePictureCardPreview(scope.row)">
                                <i class="el-icon-zoom-in"></i>
                              </span>
                          </p>
                      </div>
                  </template>
                </el-table-column>
                <el-table-column
                label="操作"
                header-align="center"
                align="center"
                v-if="hasEditPermission"
                >

                  <template slot-scope="scope">
                      <el-button size="mini" type="primary" @click="handleEdit(scope.row,'edit')">
                        修改
                      </el-button>
                      <el-button size="mini" type="default" @click="proxy_handleDelete(scope.row.id,'handleDelete')">
                        删除
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
              <el-form-item label="校区名称：" prop="name">
                  <el-input
                  v-model="formData.name"
                  >

                  </el-input>
              </el-form-item>

              <el-form-item label="校区地址：" prop="address">
                  <el-input
                  v-model="formData.address"
                  >

                  </el-input>
              </el-form-item>

              <el-form-item label="电话：" prop="mobile">
                  <el-input
                  v-model="formData.mobile"
                  >

                  </el-input>
              </el-form-item>

              <el-form-item label="图片：" prop="thumbnail">
                  <uploadImg
                    v-model="imgList"
                    desc="上传图片推荐尺寸：212x146"
                    :actionUrl="`/api`+apiList.shcool_upload"
                    :files="imgList"
                  >
                  </uploadImg>
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
    name:'schoolSet',
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
          let telReg = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
          let mobileReg = /^1(3|4|5|7|6|8)\d{9}$/
          if (telReg.test(value)||mobileReg.test(value)){
            return cb()
          }
          return cb(new Error('号码格式不对'))
      }

      let validateName = (rule,value,cb) => {
          
          if (!value) {
            return cb(new Error('请填写校区名'))
          }
          cb()
      }

      return {
        imgList:[],
        listApi:api.school_list,
        dialogType:'edit',//edit 修改  add 新增
        formData:{
          address:'',
          mobile:'',
          name:'',
          id:'',
          thumbnail:''
        },
        formRule:{
          address:[
            {required:true,message:'请填写地址',trigger:'blur'},
            {validator:validateAddress}
          ],
          mobile:[
            {required:true,message:'请填写号码',trigger:'blur'},
            {validator:validateMobile,trigger:'blur'}
          ],
          name:[
            {required:true,message:'请填写名称',trigger:'blur'},
            {validator:validateName}
          ],
          thumbnail:[
            {required:true,message:'请上传图片',trigger:'blur'},
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
          
          api.school_delete({id})
          .then(data=>{
            this.showEdit = false;
            this.getList()
          })
        },
        handleSub () {
          let thumbnail = this.imgList[0]?this.imgList[0].url:''
          // this.formData.thumbnail = thumbnail
          this.$set(this.formData,'thumbnail',thumbnail)
          this.$refs.formData.validate(valid=>{
            if (valid) {
                let param = JSON.parse(JSON.stringify(this.formData))
                param.thumbnail = thumbnail;
                api.school_save(param)
                .then(data=>{
                  this.showEdit = false;
                  this.getList()
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
                  address:'',
                  mobile:'',
                  name:'',
                  id:'',
                  thumbnail:''
                }
                this.imgList = []
                this.showEdit = true;
                return
            }
            Object.keys(item).forEach(key=>{
              this.formData[key] = item[key]
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
</style>
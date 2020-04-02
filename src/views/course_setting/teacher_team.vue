<!--
 * @Author: David
 * @Date: 2019-10-31 19:13:06
 * @LastEditTime: 2019-11-27 16:31:30
 * @LastEditors: Do not edit
 * @Description: 教学组设置
 -->
<template>
  <div class="comment-set-wrap page-wrap">
      <div class="common-set  page-inner">
          <p class="set-header page-header">
              教学组设置
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
                label="组名"
                header-align="center"
                align="center"
                prop="name"
                >
                 
                </el-table-column>
                <el-table-column
                prop="teacher_num"
                label="人数"
                header-align="center"
                align="center"
                >
                </el-table-column>

                <el-table-column
                label="人员"
                header-align="center"
                align="center"
                >

                <template slot-scope="scope" >
                  <div v-if="scope.row.member_info.length>0">
                     <span v-for="(member,index) in scope.row.member_info" :key="index">
                      {{member.teacherName}}
                    </span>
                  </div>

                  <div v-else>
                      --
                  </div>
                   
                </template>

                

                </el-table-column>


                <el-table-column
                prop="created_at"
                label="创建时间"
                header-align="center"
                align="center"
                >
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
              <el-form-item label="组名：" prop="name">
                  <el-input
                  v-model="formData.name"
                  >

                  </el-input>
              </el-form-item>

              <el-form-item label="勾选教师：">
                  <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                  
                  <el-checkbox-group v-model="checkedTeacher" @change="handleCheckedChange">
                    <el-checkbox v-for="(teacher,index) in teacherConfig" :label="teacher.id" :key="index" :disabled="teacher.isSelected==1">{{teacher.value}}</el-checkbox>
                  </el-checkbox-group>

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
    name:'teacherTeam',
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
            return cb(new Error('请填写组名'))
          }
          cb()
      }

      return {
        imgList:[],
        checkedTeacher:[],
        listApi:api.teacher_team_list,
        isIndeterminate:false,
        checkAll:false,
        teacherConfig:[],
        dialogType:'edit',//edit 修改  add 新增
        formData:{
          
        },
        formRule:{
          name:[
            {validator:validateName}
          ]
        },
        showEdit:false,
        apiList
      }
    },
    mounted () {
        this.getList();
        this.getTeacherConfig();
    },
    methods:{
        handleCheckAllChange (val) {
          this.checkedTeacher = val ? this.teacherConfig.filter(item=>item.isSelected==0).map(item=>item.id) : [];
          this.isIndeterminate = false;
        },
        handleCheckedChange  (value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.teacherConfig.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.teacherConfig.length;
        },  
        getTeacherConfig (id) {
          api.teacher_team_config({id})
          .then(data=>{
            this.teacherConfig = data.data;
          })
        },
        handleDelete (id) {
          
          api.teacher_team_delete({id})
          .then(data=>{
            this.showEdit = false;
            this.getList()
            this.$appmessage({
                    type:'success',
              message:data.message||'删除成功'
            })
          })
        },
        handleSub () {
          let thumbnail = this.imgList[0]?this.imgList[0].url:''
          // this.formData.thumbnail = thumbnail
          this.$set(this.formData,'thumbnail',thumbnail)
          this.$refs.formData.validate(valid=>{
            if (valid) {
                let param = JSON.parse(JSON.stringify(this.formData))
                let {name,id} = param
                let finalParam = {name,id}
                let teacher_ids = this.checkedTeacher;
                finalParam.teacher_ids = teacher_ids;
                api.teacher_team_save(finalParam)
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
            this.getTeacherConfig(item?item.id:'')
            if (type=='add') {
                this.formData = {
                  
                }
                this.imgList = []
                this.checkedTeacher = []
                this.showEdit = true
                this.checkAll = false
                this.isIndeterminate = false
                return
            }
            Object.keys(item).forEach(key=>{
              this.$set(this.formData,key,item[key])
              if (key=='member_info') {
                  this.checkedTeacher = item[key].map(item=>item.teacher_id)
              }
            })
            this.handleCheckedChange(this.checkedTeacher)
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
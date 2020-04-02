<!--
 * @Author: David
 * @Date: 2019-10-31 19:13:06
 * @LastEditTime: 2019-11-22 10:38:17
 * @LastEditors: Do not edit
 * @Description: 教学组设置
 -->
<template>
  <div class="comment-set-wrap page-wrap">
      <div class="common-set  page-inner">
          <p class="set-header page-header">
              权限分配
          </p>
          
          <div class="page-table">

              <div class="header-btn">
                <el-button icon="el-icon-plus" type="success" @click="handleEdit(null,'add')" v-if="hasEditPermission">新增普通教务</el-button>
              </div>

              <el-table
              :data="tableData"
              header-row-class-name="headrow"
              header-cell-class-name="headrowcell"
              >
                <el-table-column
                prop="id"
                label="序号"
                header-align="center"
                align="center"  width="50px"
                >
                </el-table-column>

                <el-table-column
                label="普通教务账号"
                header-align="center"
                align="center"
                prop="education_admin_login"
                >
                 
                </el-table-column>
                <el-table-column
                prop="education_admin_job_num"
                label="工号"
                header-align="center"
                align="center"
                >
                </el-table-column>

                <el-table-column
                prop="mobile"
                label="二次更改签到状态"
                header-align="center"
                align="center"
                >
                  <template slot-scope="scope">

                      <span>{{scope.row.can_modify_sign==1?'是':'否'}}</span>
                      
                    
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
      <el-dialog :visible.sync="showEdit" width="700px"  :close-on-click-modal="false" :title ="`${dialogType=='edit'?'修改':'新增'}普通教务`">

          <el-form :model="formData" label-width="100px" :rules="formRule" ref="formData">
            <div class="inline">
                <el-form-item label="教务账号：" prop="education_admin_login">
                    <el-input
                    v-model="formData.education_admin_login"
                    :disabled="dialogType=='edit'"
                    >

                    </el-input>
                </el-form-item>

                <el-form-item label="工号：" prop="education_admin_job_num">
                  
                    <el-input
                    v-model="formData.education_admin_job_num"
                    :disabled="dialogType=='edit'"
                    >

                    </el-input>

                </el-form-item>
            </div>
              
              <el-form-item label="选择校区">
                  <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                  <el-checkbox-group v-model="SelSchoolList" @change="handleSchoolChange">
                      <el-checkbox v-for="(item,index) in schoolList"  :label="item.id" :key="index">
                          {{item.name}}
                      </el-checkbox>
                  </el-checkbox-group>
              </el-form-item>

              <el-form-item label="课程编号: " prop="lesson_ids">
                  <el-checkbox :indeterminate="isIndeterminate1" v-model="checkAll1" @change="handleCheckAllChange1">全选</el-checkbox>
                  <el-checkbox-group v-model="SelCourseSns" @change="handleCoursnChange">
                      <el-checkbox v-for="(item,index) in courseSnList"  :label="item.id" :key="index">
                          {{item.value}}
                      </el-checkbox>
                  </el-checkbox-group>
              </el-form-item>

              <el-form-item label="是否可以二次更改签到状态:" label-width="200px" prop="can_modify_sign">

                <div>
                  <el-radio-group v-model="formData.can_modify_sign">
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1">是</el-radio>
                  </el-radio-group>
                </div>

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
    name:'authority',
    components:{editorCom,uploadImg,filterCom},
    mixins:[pagination],
    data () {

      let validateEmpty = (rule,value,cb) => {
          if (value===0) {
            return cb()
          }
          if (!value) {
            return cb(new Error('请填将信息填写完整'))
          }
          cb()
      }
      

      return {
        imgList:[],
        checkedTeacher:[],
        listApi:api.privilege_list,
        dynamicTags: ['标签一', '标签二', '标签三'],
        dialogType:'edit',//edit 修改  add 新增
        formData:{
          
        },
        formRule:{
          education_admin_login:[
            {validator:validateEmpty}
          ],
          education_admin_job_num:[
            {validator:validateEmpty}
          ],
          courses:[
            {validator:validateEmpty}
          ],
          can_modify_sign:[
            {validator:validateEmpty}
          ]
        },
        showEdit:false,
        apiList,
        schoolList:[],
        SelSchoolList:[],
        isIndeterminate:false,
        checkAll:false,

        SelCourseSns:[],
        courseSnList:[],
        isIndeterminate1:false,
        checkAll1:false,
      }
    },
    mounted () {
        this.getList()
        this.getSchoolList()
    },
    watch:{
      SelSchoolList:{
          handler () {
              if (this.SelSchoolList.length>0){
                let ids = this.SelSchoolList.join(',')
                api.education_admin_search_course({ids})
                .then(data=>{
                  this.courseSnList = data.data;
                  this.handleCoursnChange(this.SelCourseSns)
                })
              }else{
                this.courseSnList = []
                this.SelCourseSns = []
              }
          },
          deep:true
        }
    },
    methods:{
        handleCheckAllChange (val) {
          this.SelSchoolList = val ? this.schoolList.map(item=>item.id) : [];
          this.isIndeterminate = false;
        },
        handleCheckAllChange1 (val) {
          this.SelCourseSns = val ? this.courseSnList.map(item=>item.id) : [];
          this.isIndeterminate1 = false;
        },
        handleSchoolChange (schools) {
          let checkedCount = schools.length;
          this.checkAll = checkedCount === this.schoolList.length;
          this.isIndeterminate = checkedCount > 0 && checkedCount < this.schoolList.length;
        },
        handleCoursnChange (sns) {
          let checkedCount = sns.length;
          this.checkAll1 = checkedCount === this.courseSnList.length;
          this.isIndeterminate1 = checkedCount > 0 && checkedCount < this.courseSnList.length;
        },
        getSchoolList () {
          api.school_list({pase_num:10000,page:1})
          .then(data=>{
            this.schoolList = data.data.data;
          })
        },
        handleAddNewSn () {
            if (!this.formData.courseSn) {
              this.$appmessage({
                type:'error',
                message:'请填写正确的课程编号'
              })
              return
            }
            
            if (!this.formData.courses) {
              this.$set(this.formData,'courses',[])
            }
            if (this.formData.courses.some(item=>item.course_sn===this.formData.courseSn)){
                 this.$appmessage({
                    type:'error',
                    message:'不能重复添加'
                  })
                  return
            }
            this.formData.courses.push({course_sn:this.formData.courseSn})
        } , 
        handleDelete (id) {
          
          api.privilege_delete({id})
          .then(data=>{
            this.showEdit = false;
            this.$appmessage({
              type:'success',
              message:data.message||'删除成功'
            })
            this.getList()
          })
          
        },
        handleSub () {
          
          this.$refs.formData.validate(valid=>{
            if (valid) {
                let param = JSON.parse(JSON.stringify(this.formData))
                param.courses = this.SelCourseSns.join(',')
                api.privilege_save(param)
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
        handlePictureCardPreview(file) {
            this.openPreview({src:file.thumbnail})
        },
        handleEdit (item,type) {
            this.dialogType = type
            if (type=='add') {
                this.formData = {
                  
                }
                this.SelCourseSns = []
                this.courseSnList = []
                this.SelSchoolList = []
                this.checkAll = false;
                this.checkAll1 = false;
                this.isIndeterminate = false;
                this.isIndeterminate1 = false;
                this.showEdit = true;
                return
            }
            api.privilege_detail({id:item.id})
            .then(data=>{
              data = data.data;
              Object.keys(data).forEach(key=>{
                if (key=='courses') {
                  let sList = [];
                  for (let i=0,len=data[key].length;i<len;i++) {
                      sList.indexOf(data[key][i].school_id)<=-1&&sList.push(data[key][i].school_id)
                  }


                  this.SelSchoolList = sList
                  let cSlist = JSON.parse(JSON.stringify(sList));
                  this.handleSchoolChange(cSlist)

                  let CList = []
                   for (let i=0,len=data[key].length;i<len;i++) {
                      CList.indexOf(data[key][i].course_id)<=-1&&CList.push(data[key][i].course_id)
                  }
                  this.SelCourseSns = CList
                  let CCList = JSON.parse(JSON.stringify(CList));
                  this.handleCoursnChange(CCList)
                }else{
                  this.$set(this.formData,key,item[key])
                }
                
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
    .tag-list-wrap{
      .el-tag{
        margin-right:10px;
      }
    }
    .el-checkbox{
        margin-right: 15px;
      }
</style>
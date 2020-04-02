<!--
 * @Author: David
 * @Date: 2019-10-31 19:13:06
 * @LastEditTime: 2019-11-27 16:31:59
 * @LastEditors: Do not edit
 * @Description: 教学组设置
 -->
<template>
  <div class="comment-set-wrap page-wrap">
      <div class="common-set  page-inner">
          <p class="set-header page-header">
              优惠设置 <span>(注：两次活动之间不得交叉日期段设置)</span>
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
                label="优惠时间段"
                header-align="center"
                align="center"
                prop="name"
                width="400px"
                >
                 <template slot-scope="scope">
                   
                     <span>{{scope.row.start_time|formatTime}} 至 {{scope.row.end_time|formatTime}}</span>
                   
                 </template>
                </el-table-column>
                <el-table-column
                label="参与课程编号"
                header-align="center"
                align="center"
                >
                    <template slot-scope="scope">
                        {{scope.row.coursesSns.join(',')}}
                    </template>
                </el-table-column>

                <el-table-column
                prop="mobile"
                label="优惠力度"
                header-align="center"
                align="center"
                >

                  <template slot-scope="scope">
                      <p v-for="(item,index) in scope.row.course_activity_rules" :key="index">
                        下单{{item.course_max_num}}门课程{{item.discount*10}}折优惠
                      </p>
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
                prop="mobile"
                label="状态"
                header-align="center"
                align="center"
                >
                  <template slot-scope="scope">
                      <span :class="getTimeRangeStr(scope.row).classes">{{getTimeRangeStr(scope.row).str}}</span>
                  </template>
                </el-table-column>

                <el-table-column
                label="操作"
                header-align="center"
                align="center"
                v-if="hasEditPermission"
                >

                  <template slot-scope="scope">
                      
                      <el-button size="mini" type="default" @click="proxy_handleDelete(scope.row.id,'handleDelete')" :disabled="getTimeRangeStr(scope.row).status>=1">
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
      <el-dialog :visible.sync="showEdit" width="700px"  :close-on-click-modal="false" :title ="`${dialogType=='edit'?'修改':'新增'}优惠`">

          <el-form :model="formData" label-width="100px" :rules="formRule" ref="formData">

              <el-form-item label="优惠时间段：" prop="start_time">
                  <el-date-picker
                    v-model="timeRanges"
                    type="datetimerange"
                    range-separator="至"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
              </el-form-item>

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

              <el-form-item label="优惠力度:">
                
                  <div class="activity_input_wrap" v-for="(act,index) in course_activity_rules" :key="index">
                      <span>{{index+1}}、下单</span>
                      <el-input-number :controls="false" style="width:40px;"  v-model="act.course_max_num"></el-input-number>
                      <span>门课程</span>
                      <el-input-number :controls="false" style="width:40px;"  v-model="act.discount"></el-input-number>
                      <span>折优惠</span>

                      <span class="iptIcon" v-if="(index+1)==course_activity_rules.length">
                          <i class="el-icon-circle-plus" @click="addAct(index)"></i>
                          <i class="el-icon-circle-close" @click="delAct(index)" v-show="index>=1"></i>
                      </span>
                  </div>
                  
              </el-form-item>

          </el-form>

          <div class="subBtn">
            <el-button type="success" @click="handleSub">确定</el-button>
          </div>
      </el-dialog>
      <!-- 修改面板 -->

      <!-- 填写编号 -->
      <el-dialog :visible.sync="showInput" width="526px"  :close-on-click-modal="false" :title ="`填写课程编号`">

          <el-form :model="inputData" :rules="inputRule" ref="inputData">
              <el-form-item  prop="name">
                  <el-select
                  v-model="inputData.name"
                  remote
                  :remote-method="queryCourseConfig"
                  filterable
                  style="width:100%;"
                  >
                    <el-option v-for="(cf,index) in course_activity_courseConfig" :key="index" :label="cf.value" :value="cf.id">

                    </el-option>
                  </el-select>
              </el-form-item>
          </el-form>

          <div class="subBtn">
            <el-button type="success" @click="handleInputSub">确定</el-button>
          </div>
      </el-dialog>
      <!-- 填写编号 -->
      
  </div>
</template>
<script>
import editorCom from '@/components/editor/editorCom.vue'
import uploadImg from '@/components/uploadImg'
import filterCom from '@/components/filterCom'
import pagination from '@/mixins/pagination'
import api from '@/utils/api'
import moment from '@/utils/localMoment'
import {apiList} from '@/utils/api'
export default {
    name:'teacherTeam',
    components:{editorCom,uploadImg,filterCom},
    mixins:[pagination],
    data () {

      let validateTimeRange = (rule,value,cb) => {
          if (this.timeRanges.length<2) {
            return cb(new Error('请将时间段信息填写完整'))
          }
          cb();
      }
      

      let validateCourseSns = (rule,value,cb) => {
        if (this.coursesSns.some(item=>item.id==value)){
          return cb(new Error('该课程编号已选'))
        }
        if (!value) {
          return cb(new Error('请填写课程编号'))
        }
        cb()
      }

      return {
        imgList:[],
        listApi:api.course_activity_list,
        dialogType:'add',//edit 修改  add 新增
        showInput:false,

        coursesSns:[],
        timeRanges:[],
        course_activity_courseConfig:[],
        course_activity_rules:[
          {
            course_max_num:0,
            discount:0
          }
        ],

        formData:{
          
        },
        inputData:{
            name:''
        },
        inputRule:{
          name:[
            {validator:validateCourseSns}
          ]
        },
        formRule:{
          start_time:[
             {validator:validateTimeRange}
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
        this.getList();
        this.getSchoolList();
    },
    watch:{
        SelSchoolList:{
          handler () {
              if (this.SelSchoolList.length>0){
                let ids = this.SelSchoolList.join(',')
                api.course_activity_search({ids})
                .then(data=>{
                  // //console.log(data);
                  this.courseSnList = data.data;
                })
              }else{
                this.courseSnList = []
                this.SelCourseSns = []
              }
          },
          deep:true
        }
    },
    filters:{
        formatTime (time) {
          
          return moment(time*1000).format('YYYY-MM-DD HH:mm:ss')
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
        
        queryCourseConfig (query){
            api.course_activity_courseConfig({query})
            .then(data=>{
              this.course_activity_courseConfig = data.data;
            })
        },
        handleDeleteSns (index) {
            this.coursesSns.splice(index,1)
        },
        addAct  () {
          this.course_activity_rules.push({
            course_max_num:'',
            discount:''
          })
        },
        delAct (index) {
            this.course_activity_rules.splice(index,1);
        },
        getTimeRangeStr (row) {
            let currTime = new Date().getTime();
            let str = "未开始"
            let classes = "blue"
            let status = 0
            if (currTime>row.start_time*1000&&currTime<row.end_time*1000) {
                str="进行中"
                classes = "green"
                status = 1
            }else if (currTime>=row.end_time*1000){
                str="已结束"
                classes = "black"
                status = 2
            }
            return {str,classes:[classes],status}
        },
        handleDelete (id) {
             api.course_activity_delete({id})
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
          
          this.$refs.formData.validate(valid=>{
            if (valid) {
                // let param = JSON.parse(JSON.stringify(this.formData))
                let param = {}
                let start_time = this.timeRanges[0]                
                let end_time = this.timeRanges[1]
                let coursesSns = this.SelCourseSns.join(',')
                let course_activity_rules = this.course_activity_rules;
                param = {start_time,end_time,coursesSns,course_activity_rules}                
                api.course_activity_save(param)
                .then(data=>{
                  this.showEdit = false;
                  this.getList()
                })
            }
          })
        },
        handleInputSub () {
            this.$refs.inputData.validate((valid)=>{
              if (valid) {
                let item = this.course_activity_courseConfig.filter(it=>it.id==this.inputData.name)
                this.coursesSns.push(...item)
                this.showInput = false;
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
                this.timeRanges = []
                this.SelCourseSns = []
                this.courseSnList = []
                this.SelSchoolList = []
                this.checkAll = false;
                this.checkAll1 = false;
                this.isIndeterminate = false;
                this.isIndeterminate1 = false;
                this.course_activity_courseConfig = []
                this.course_activity_rules=[{
                  course_max_num:0,
                  discount:0
                }]
                this.showEdit = true;
                return
            }
            Object.keys(item).forEach(key=>{
              this.formData[key] = item[key]
              
            })
            
            this.showEdit = true;
        }
    }
}
</script>
<style lang="scss" scoped>
  .page-wrap{
    width: 100%;
    padding: 0 20px;
    padding-top:13px;
    padding-bottom:13px;
    .page-inner{
      // max-width:1200px;
      
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
    .black{
      color:#444444;
    }
    .blue{
      color:#2970ff;
    }
    .green{
      color:#41e063;
    }
    // .el-checkbox-group{
    //   display: inline-block;
      
    // }
    .el-checkbox{
        margin-right: 15px;
      }
</style>
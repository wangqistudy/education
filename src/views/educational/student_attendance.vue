<!--
 * @Author: David
 * @Date: 2019-10-31 19:13:06
 * @LastEditTime: 2019-12-04 09:59:14
 * @LastEditors: Do not edit
 * @Description: 正式课程
 -->
 <!-- eslint-disable -->
<template>
  <div class="comment-set-wrap page-wrap">
      <div class="common-set  page-inner" v-if="!showEdit">  
          <div class="page-table">


              <div class="filter-wrap">
                <filterCom
                :filterOptions="filterOptions"
                @dosearch="handleDoSearch"
                type="keyValue"
                >
                  <template slot="prebtn">
                    <el-button-group>
                      <el-button :type="sign_running_state===''?`danger`:'default'" @click="handleLessonStatusList('')">

                        全部课程

                      </el-button>

                      <el-button :type="sign_running_state==1?`danger`:'default'" @click="handleLessonStatusList(1)">

                        在上课程

                      </el-button>

                      <el-button :type="sign_running_state==2?`danger`:'default'" @click="handleLessonStatusList(2)">

                        结束课程

                      </el-button>
                    </el-button-group>
                  </template>
                </filterCom>
              </div>

              <div class="cards-wrapper" v-loading="pageLoading"  element-loading-text="加载中....">
                
                <div class="hasCard-wrap" v-if="tableData.length>0">
                  <div class="card-wrapper" v-for="(lesson,index) in tableData" :key="index" >
                    <lessonCard :info="lesson">
                      <template slot="detail" slot-scope="info" :info="lesson">
                          <div class="lesson-top-info"> 
                              <div class="total">
                                <p>人数</p>
                                <p>{{info.info.selected_num}}</p>
                              </div>

                              
                              <div class="price">
                                <p>课程价格</p>
                                <p>
                                  <span>￥</span>
                                  <span>{{info.info.source_price}}</span>
                                </p>
                              </div>
                          </div>
                      </template>
                      <template slot="button" slot-scope="info">
                          <el-button type="primary" size="mini" @click="handleStartSign(info.info)" v-if="isShowSignBtn(info.info)">开始签到</el-button>
                      </template>
                      
                    </lessonCard>
                  </div>
                </div>

                <div class="empty-card" v-if="tableData.length<=0&&!pageLoading">
                      <svgIcon :iconClass="`zanwu`">
                          
                      </svgIcon>
                      <p>暂无信息</p>
                </div>


              </div>


              
              
              

              
          </div>

          <div class="pagination" v-if="totalCount/pageSize>1">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page.sync="currPage"
              :page-size="pageSize"
              layout="prev, pager, next, jumper"
              :total="totalCount">
            </el-pagination>
          </div>
          
      </div>

      <div class="page-inner video-set" v-else>
          <p class="set-header page-header">
              学生签到
          </p>
          <div class="page-content">
            <div class="filter-wraps">
              <filterCom
              :filterOptions="filterOptions1"
              @dosearch="handleDoSearch1"
              type="keyValue"
              >
                <template slot="anotherbtn">
                    <el-button type="success" icon="el-icon-plus" @click="handleAddNews" v-if="hasEditPermission">
                      新增学员
                    </el-button>
                    <el-button type="warning" size="mini" :disabled="user_ids.length<=0" @click="handleUserSign(signTableData[0],'multi')" v-if="hasEditPermission">批量签到</el-button>
                </template>
              </filterCom>
            </div>
            <div class="page-table">
                <el-table
                :data="signTableData"
                header-row-class-name="headrow"
                header-cell-class-name="headrowcell"
                @selection-change="handleSelectionChange"
                >
                  <el-table-column
                    type="selection"
                    width="55">
                  </el-table-column>
                  <el-table-column
                  prop="id"
                  label="序号"
                  header-align="center"
                  align="center"
                  >
                  </el-table-column>

                  <el-table-column
                  label="姓名"
                  header-align="center"
                  align="center"
                  prop="name"
                  >
                  
                  </el-table-column>
                  <el-table-column
                  prop="sex"
                  label="性别"
                  header-align="center"
                  align="center"
                  >
                  </el-table-column>

                  <el-table-column
                  prop="gradeName"
                  label="年级"
                  header-align="center"
                  align="center"
                  >
                  </el-table-column>


                  <el-table-column
                  prop="school"
                  label="学校"
                  header-align="center"
                  align="center"
                  >
                  </el-table-column>

                  <el-table-column
                  prop="mobile"
                  label="手机号"
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
                        
                        <el-button size="mini" type="primary" @click="handleUserSign(scope.row)">
                          立即签到
                        </el-button>
                    </template>

                  </el-table-column>
                </el-table>

                <div class="pagination">
                  <el-pagination
                    @current-change="handleCurrentChange1"
                    :current-page.sync="currPage1"
                    :page-size="pageSize1"
                    layout="prev, pager, next, jumper"
                    :total="totalCount1">
                  </el-pagination>
                </div>
                <div class="subBtn-list">
                    <el-button type="primary" @click="showEdit=false">
                      返回课程列表
                    </el-button>
                </div>
            </div>
          </div>
          
      </div>
      
      <!-- 学生签到 -->
      <el-dialog :visible.sync="showUserSign" width="526px"  :close-on-click-modal="false" :title ="`学生签到`">

          <el-form :model="signFormData" label-width="100px" :rules="singFormRule" ref="signFormData" class="filter-wraps">
              <el-form-item label="订单编号：" v-if="showOrderSn">
                  <span>{{signFormData.order_sn}}</span>
              </el-form-item>
              <el-form-item label="签到课时：" prop="course_hour">
                  <el-select v-model="signFormData.course_hour_id">
                      <el-option v-for="(config,index) in sign_course_hour" :key="index" :value="config.id" :label="`${config.class_time_start}至${config.class_time_end}`">
                        {{config.class_time_start}}至{{config.class_time_end}}
                      </el-option>
                  </el-select>
              </el-form-item>
              
              
              <el-form-item label="签到状态：" prop="name"  class="sign_status">
                    <el-radio-group v-model="signFormData.sign_type">
                      <el-radio v-for="(config,index) in sign_config" :key="index" :label="config.id">{{config.value}}</el-radio>
                    </el-radio-group>
              </el-form-item>

          </el-form>

          <div class="subBtn">
            <el-button type="success" @click="handleSign">确定</el-button>
          </div>
      </el-dialog>
      <!-- 学生签到 -->


      <!-- 新增学员 -->
      <el-dialog :visible.sync="showAddUser" width="526px"  :close-on-click-modal="false" :title ="`新增学员`">

          <el-form :model="addFormData" label-width="100px" :rules="addFormRule" ref="addFormData"  class="filter-wraps">

              <el-form-item label="手机号：" prop="mobile">
                    <el-input v-model="addFormData.mobile">

                    </el-input>
              </el-form-item>
              <el-form-item label="签到课时：" prop="course_hour">
                  <el-select v-model="addFormData.course_hour_id">
                      <el-option v-for="(config,index) in sign_course_hour" :key="index" :value="config.id" :label="`${config.class_time_start}至${config.class_time_end}`">
                        {{config.class_time_start}}至{{config.class_time_end}}
                      </el-option>
                  </el-select>
              </el-form-item>
              
              
              <el-form-item label="签到状态：" prop="sign_type" class="sign_status">
                   

                    <el-radio-group v-model="addFormData.sign_type">
                      <el-radio v-for="(config,index) in sign_config" :key="index" :label="config.id">{{config.value}}</el-radio>
                    </el-radio-group>
              </el-form-item>

          </el-form>

          <div class="subBtn">
            <el-button type="success" @click="handleAddSub">确定</el-button>
          </div>
      </el-dialog>
      <!-- 新增学员 -->

      
  </div>
</template>
<script>
import editorCom from '@/components/editor/editorCom.vue'
import uploadImg from '@/components/uploadImg'
import filterCom from '@/components/filterCom'
import lessonCard from '@/components/lessonCard'
import SeatList from '@/components/SeatList'
import pagination from '@/mixins/pagination'
import api from '@/utils/api'
import {apiList} from '@/utils/api'
import moment from '@/utils/localMoment'
import svgIcon from '@/components/SvgIcon'
export default {
    name:'studentAttendance',
    components:{editorCom,uploadImg,filterCom,lessonCard,SeatList,svgIcon},
    mixins:[pagination],
    data () {

      let validateEmpty = (rule,value,cb)=>{
        if (!value) {
            return cb(new Error('请填写信息'))
          }
          cb()
      }

      return {
        courseList:[
          {},{},{}
        ],
        activeName:'user',
        listApi:api.student_sign_courses,
        pageSize:5,
        filterOptions:[
          {  label:'学期:',filed:'semester_id' , opt:'$like' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
          {  label:'教学组:',filed:'teacher_team_id' , opt:'$eq' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
          {  label:'主讲老师:',filed:'teacher_id' , opt:'$eq' , options:[] , defaultValue:'' , type:'select' , optionUrl:'',remoteUrl:apiList.teacher_search },
          {  label:'课程标题:',filed:'name' , opt:'$eq' , options:[] , defaultValue:'' , type:'input' , optionUrl:'' },
          {  label:'课程编号:',filed:'courseSn' , opt:'$eq' , options:[] , defaultValue:'' , type:'input' , optionUrl:'' },
          {  label:'校区:',filed:'school_id' , opt:'$eq' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
          {  label:'教室:',filed:'classroom_id' , opt:'$eq' , options:[] , defaultValue:'' , type:'input' , optionUrl:'' },
        ],
        filterOptions1:[
          {  label:'姓名:',filed:'userName' , opt:'$eq' , options:[] , defaultValue:'' , type:'input' , optionUrl:'' },
          {  label:'手机号:',filed:'userMobile' , opt:'$eq' , options:[] , defaultValue:'' , type:'input' , optionUrl:'' },
        ],
        
        dialogType:'edit',//edit 修改  add 新增
        pageType:'table',//edit   table
        formData:{
          
        },
        signFormData:{
          sign_time:'',
          sign_type:'',
          course_id:''
        },
        sign_running_state:'',
        user_ids:[],
        addFormData:{
          mobile:'',
          sign_time:'',
          sign_type:'',
          course_id:'',
        },
        singFormRule:{
            sign_time:[
              {validator:validateEmpty}
            ],
            sign_type:[
              {validator:validateEmpty}
            ]
        },
        addFormRule:{
            sign_time:[
              {validator:validateEmpty}
            ],
            sign_type:[
              {validator:validateEmpty}
            ],
            mobile:[
              {validator:validateEmpty}
            ]
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
        showUserSign:false,
        showAddUser:false,
        showOrderSn:false,
        apiList,
        gradeConfig:[],
        subjectConfig:[],
        typeConfig:[],
        signTableData:[],
        signTableDataFilter:{

        },

        currPage1:1,
        pageSize1:10,
        totalCount1:1,
        
        currRowData:{

        },
        sign_config:[
          
        ],
        sign_course_hour:[
          
        ]
      }
    },
    mounted () {
        this.getList();
        this.getOptions();
    },
    computed :{
     
    },
    methods:{
        isShowSignBtn (info) {
          let {class_end_date} = info
          let str = class_end_date + ' ' +'00:00:00'
          let curStr = moment().format('YYYY-MM-DD') +' '+'00:00:00'
          let lstDate = new Date(str).getTime()
          let currDate = new Date(curStr).getTime()
          if (currDate-lstDate>30*24*3600*1000) {
            return false;
          }
          return true;
        },
        handleSelectionChange (data) {
          this.user_ids = data.map(item=>item.user_id)
        },
        handleAddNews () {
          this.addFormData = {
            mobile:'',
            sign_time:'',
            sign_type:'',
            course_id:this.currRowData.id,
            order_sn:this.currRowData.order_sn
          }

          api.sign_course_hours({id:this.currRowData.id})
          .then(data=>{
            this.sign_course_hour = data.data;
            this.showAddUser = true;
          })
        },

        handleAddSub () {
            this.$refs.addFormData.validate(valid=>{
              if (valid) {
                api.sign_add(Object.assign({},this.addFormData,{sign_time:moment().format('YYYY-MM-DD HH:mm:ss')}))
                .then(data=>{
                  this.$appmessage({
                    type:'success',
                    message:data.message||'添加成功'
                  })
                  this.getSignList(this.currRowData.id)
                  this.showAddUser = false;
                })
              }
            })
        },
        handleLessonStatusList (status) {
          if (status==this.sign_running_state) {
            return
          }
          this.sign_running_state = status;
          this.setDataFilters(Object.assign({},this.dataFilters,{sign_running_state:this.sign_running_state}))
          this.getList()
        },
        handleUserSign (info,type="single") {
          this.signFormData = {
            sign_time:'',
            sign_type:'',
            course_id:'',
            order_sn:info.order_sn
          }
          this.signFormData.course_id = info.course_id
          if (type=='single') {
            this.signFormData.user_id = info.user_id
            delete this.signFormData.user_ids
            this.showOrderSn = true
          }else{
            this.signFormData.user_ids = this.user_ids.slice(0);
            delete this.signFormData.user_id
            this.showOrderSn = false
          }
          api.sign_course_hours({id:info.course_id})
          .then(data=>{
            this.sign_course_hour = data.data;
            this.showUserSign = true;
          })
          
        },
        handleSign () {
          this.$refs.signFormData.validate(valid=>{
            if (valid) {
              let param = JSON.parse(JSON.stringify(this.signFormData))
              let apiKey;
              if ('user_id' in this.signFormData) {
                apiKey = 'sign_sign'
              }
              if ('user_ids' in this.signFormData) {
                apiKey = 'batch_sign'
                param.user_ids = param.user_ids.join(',');
              }
              if (!apiKey) {
                return;
              }
              api[apiKey](Object.assign({},param,{sign_time:moment().format('YYYY-MM-DD HH:mm:ss')}))
              .then(data=>{
                this.$appmessage({
                  type:'success',
                  message:data.message||'签到成功'
                })
                this.showUserSign = false;
                this.getSignList(this.currRowData.id)
              })
            }
          })
        },

        setSignTableDataFilter (filter) {
          this.$set(this,'signTableDataFilter',filter||{})
        },

        getSignConfig () {
          if (this.sign_config.length>0) {
            return;
          }
          api.sign_config()
          .then(data=>{
            this.sign_config = data.data;
          })
        },
      
        handleDoSearch (filter,type) {
            this.setDataFilters(filter)
            if (type=='reset') {
              this.sign_running_state = ''
            }
            this.getList()
        },
        handleDoSearch1 (filter) {
            this.setSignTableDataFilter(filter)
            this.getSignList(this.currRowData.id)
        },
        handleCurrentChange1 () {
          this.getSignList(this.currRowData.id) 
        },
        getSignList (id,filter=this.signTableDataFilter) {
          filter = filter||{}
          return new Promise((res,rej)=>{
              api.student_sign_list({id,page:this.currPage1,page_num:this.pageSize1,...filter})
              .then(data=>{
                let {pagination} = data.data.meta;
                let info = data.data.data;
                this.signTableData = info;
                let {total,per_page,current_page,total_pages} = pagination
                this.totalCount1 =total-0;
                this.pageSize1 = per_page-0;
                this.currPage1 = current_page-0;
                res(info)
              })
              .catch((err)=>{
                rej(err)
              })
          })
        },
        handleStartSign (info) {
            Object.keys(info).forEach(key=>{
              this.$set(this.currRowData,key,info[key])
            })
            this.currPage1 = 1;
            this.getSignList(info.id)
            .then((data)=>{
              this.showEdit = true
              this.getSignConfig()
            })
            
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
          api.course_config()
          .then(data=>{ 
            let {gradeMap,schoolMap,semesterMap,subjectMap,teacherTeamMap,typeMap} = data.data;
            this.filterOptions[0].options = semesterMap
            this.filterOptions[1].options = teacherTeamMap
            this.filterOptions[5].options = schoolMap
          })
        },  
        handleSub () {
          this.$refs.formData.validate(valid=>{
            if (valid) {
                let param = JSON.parse(JSON.stringify(this.formData))
                param.user_ids = param.user_ids.join(',');
                api.video_save(param)
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
                this.imgList = []
                this.videoList = []
                this.showEdit = true;
                return
            }
            
            Object.keys(item).forEach(key=>{
              this.$set(this.formData,key,item[key])
              if (key=='thumbnail') {
                  if (item[key]){
                    this.imgList = [{url:item[key]}]
                  }else{
                    this.imgList = []
                  }
                  
              }
              if (key=='url') {
                 if (item[key]){
                    this.videoList = [{url:item[key]}]
                  }else{
                    this.videoList = []
                  }
              }
              if (key=='teacher_id') {
                this.teacherConfig = [{id:item[key],value:item['teacherName']}]
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
    padding:0 20px;
    padding-top:13px;
    padding-bottom:13px;
    .page-inner{
      width: 100%;
      padding-bottom:24px;
      margin:0 auto;
      .page-content{
        padding:0 32px;
        margin-top:15px;
      }
      // background-color:#fff;
      &.video-set{
        max-width: 1200px;
        margin:0 auto;
        background-color:#fff;
        // padding:0 32px;
        padding-bottom:24px;
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
    // background-color:#fff;
    .exports-data{
      margin-bottom:20px;
    }
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
    .addButton{
      margin-top:20px;
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
    .lesson-top-info{
      width: 100%;
      height: 100%;
      display:flex;
      justify-content: flex-end;
      &>div{
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        p{
          &:first-child{
            color:#999999;
          }
          &:last-child{
            color:#ff9657;
            font-size:18px;
          }
        }
        &.price{
          p:last-child{
            display: flex;
            align-items: flex-end;
            color:#f3000d;
            font-size:30px;
            line-height: 30px;
            span:first-child{
              font-size:18px;
              line-height: 24px;
            }
          }
        }
        &:nth-child(1){
          padding:0 30px;
        }
        &:nth-child(2){
          padding:0 30px;
          border-left:1px solid  #dddddd;
        }
      }
    }
    .card-wrapper{
      margin-bottom:20px;
    }
    .filter-wrap{
      /deep/.el-select {
        /deep/.el-input{
          width:136px;

        }
      }
      /deep/.el-input{
          width:136px;

      }
    }

    .filter-wraps{
      /deep/.el-select {
        width: 100%;
        min-width: 386px;
        /deep/.el-input{
          width:100%;

        }
      }
      /deep/.el-input{
          width:100%;

      }
    }

    .cards-wrapper{
      min-height: 300px;
      position: relative;
      /deep/.el-loading-mask{
        background-color:transparent;
      }
    }
    .empty-card{
      font-size:60px;
      height:300px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color:#999999;
      p{
        font-size:20px;
        margin-top:20px;
      }
    }
    .sign_status{
      .el-radio-group{
        padding-top:10px;
      }
      .el-radio{
        margin-right:20px;
        margin-bottom:20px;
      }
    }
</style>
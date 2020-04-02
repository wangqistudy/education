<!--
 * @Author: David
 * @Date: 2019-10-31 19:13:06
 * @LastEditTime: 2019-12-04 09:57:23
 * @LastEditors: Do not edit
 * @Description: 老师签到
 -->
 <!-- eslint-disable -->
<template>
  <div class="comment-set-wrap page-wrap">
      <div class="common-set  page-inner">  
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

                          <div class="sign-item" v-if="info.info.teachers[1]&&info.info.teachers[1].length>0&&isShowSignBtn(info.info)">
                            <span>
                              授课老师:
                            </span>
                            <p v-for="(teacher,index) in info.info.teachers[1]" :key="index" class="signTeacher">
                              <span>{{teacher.teacher_name}}</span>
                              <el-button type="primary" size="mini" @click="handleUserSign(info.info,teacher.teacher_id)">签到</el-button>
                            </p>
                            
                          </div>
                          
                          
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

      
      <!-- 老师签到 -->
      <el-dialog :visible.sync="showUserSign" width="526px"  :close-on-click-modal="false" :title ="`老师签到`">

          <el-form :model="formData" label-width="100px" :rules="formRule" ref="formData" class="filter-wraps">
              <el-form-item label="签到时间：" prop="sign_time">
                      <el-date-picker
                        v-model="formData.sign_time"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :time-arrow-control="true"
                        format="yyyy-MM-dd HH:mm"
                        placeholder="选择日期">
                      </el-date-picker>
              </el-form-item>
              
              <el-form-item label="签到状态：" prop="sign_type">
                    <el-radio-group v-model="formData.sign_type">
                      <el-radio v-for="(config,index) in signTypeConfig" :key="index" :label="config.id">{{config.value}}</el-radio>
                    </el-radio-group>
              </el-form-item>

              <el-form-item label="备注">
                    <el-input type="textarea" v-model="formData.note">
                      
                    </el-input>
              </el-form-item>

          </el-form>

          <div class="subBtn">
            <el-button type="success" @click="handleSub">确定</el-button>
          </div>
      </el-dialog>
      <!-- 老师签到 -->

      
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
    name:'teacherAttendance',
    components:{editorCom,uploadImg,filterCom,lessonCard,SeatList,svgIcon},
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
        pageSize:5,
        activeName:'user',
        listApi:api.teacher_sign_list,
        filterOptions:[
          {  label:'学期:',filed:'semester_id' , opt:'$like' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
          {  label:'教学组:',filed:'teacher_team_id' , opt:'$eq' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
          {  label:'主讲老师:',filed:'teacher_id' , opt:'$eq' , options:[] , defaultValue:'' , type:'select' , optionUrl:'', remoteUrl:apiList.teacher_search},
          {  label:'课程标题:',filed:'courseName' , opt:'$eq' , options:[] , defaultValue:'' , type:'input' , optionUrl:'' },
          {  label:'课程编号:',filed:'courseSn' , opt:'$eq' , options:[] , defaultValue:'' , type:'input' , optionUrl:'' },
        ],
        
        dialogType:'edit',//edit 修改  add 新增
        pageType:'table',//edit   table
        formData:{
            sign_time:'',
            sign_type:'',
            teacher_id:'',
            course_id:'',
            note:''
        },
        formRule:{
          sign_time:[
            {validator:validateEmpty}
          ],
          sign_type:[
            {validator:validateEmpty}
          ]
        },
        showEdit:false,
        showUserSign:false,
        showAddUser:false,
        apiList,
        schoolConfig:[],
        semesterConfig:[],
        signTypeConfig:[],
        teacherTeamConfig:[],
        sign_running_state:''
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
        handleUserSign (info,teacher_id) {
          this.formData = {
            sign_time:'',
            sign_type:'',
            teacher_id:'',
            course_id:'',
            note:''
          }
          this.formData.course_id = info.id
          this.formData.teacher_id = teacher_id
          this.showUserSign = true
        },  
        handleDoSearch (filter,type) {
            this.setDataFilters(filter)
            if (type=='reset') {
              this.sign_running_state = ''
            }
            this.getList()
        },
        handleDoSearch1 (filter) {
              
        },
        handleLessonStatusList (status) {
          if (status==this.sign_running_state) {
            return
          }
          this.sign_running_state = status;
          this.setDataFilters(Object.assign({},this.dataFilters,{sign_running_state:this.sign_running_state}))
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
          api.teacher_sign_config()
          .then(data=>{ 
            let {schoolMap,semesterMap,signTypeMap,teacherTeamMap} = data.data;
            this.filterOptions[0].options = semesterMap
            this.filterOptions[1].options = teacherTeamMap
            this.signTypeConfig = signTypeMap
          })
        },  
        handleSub () {
          this.$refs.formData.validate(valid=>{
            if (valid) {
                api.teacher_sign(this.formData)
                .then(data=>{
                  this.showUserSign = false;
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
        /deep/.el-input{
          width:100%;

        }
      }
      /deep/.el-input{
          width:100%;

      }
    }
    .sign-item{
      display: inline-block;
      
      span{
        color:#666666;
        
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
    .signTeacher{
      display:inline-block;
      margin-left:5px; 
    }
</style>
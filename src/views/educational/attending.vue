<!--
 * @Author: David
 * @Date: 2019-10-31 19:13:06
 * @LastEditTime: 2019-12-05 15:15:10
 * @LastEditors: Do not edit
 * @Description: 小区设置
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
                          <el-button type="primary" size="mini" @click="viewUserInfo(info.info)">查看学员信息</el-button>
                          <el-button type="default" size="mini" @click="handleEndedCourse(info.info)" v-if="hasEditPermission">结束课程</el-button>
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
          <div class="page-table">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="学员信息" name="user">
                    <div class="exports-data">
                      <el-button type="primary" size="mini" @click="handleUserExport('/api'+apiList.course_students)"  v-if="needSecret">导出数据</el-button>
                    </div>
                    <el-table
                      :data="userTableData"
                      header-row-class-name="headrow"
                      header-cell-class-name="headrowcell"
                      class="user-data"
                      >
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
                        v-if="roles.indexOf('用户管理/查看')>0"
                        >

                          <template slot-scope="scope">
                              <el-button size="mini" type="primary" @click="viewDocument(scope.row)">
                                查看档案
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
                </el-tab-pane>
                <el-tab-pane label="座位排列" name="seat">
                    

                    <SeatList
                    :info="seatInfo"
                    >
                    
                    </SeatList>
                    
                </el-tab-pane>
              </el-tabs>
              <div class="subBtn-list">
                  <el-button type="primary" @click="backToList">
                     返回课程列表
                  </el-button>

                  
              </div>
          </div>
          
      </div>

      
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
import moment from '@/utils/localMoment'
import {apiList} from '@/utils/api'
import svgIcon from '@/components/SvgIcon'
import {getToken} from '@/utils/auth'
import qs from 'qs'
import { MessageBox,Message } from 'element-ui';
export default {
    name:'attending',
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
        listApi:api.education_admin_list,
        userTableData:[],
        seatInfo:{},
        activeName:'user',
        filterOptions:[
          {  label:'学期:',filed:'semester_id' , opt:'$like' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
          {  label:'教学组:',filed:'teacher_team_id' , opt:'$eq' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
          {  label:'主讲老师:',filed:'teacher_id' , opt:'$eq' , options:[] , defaultValue:'' , type:'select' , optionUrl:'',remoteUrl:apiList.teacher_search },
          {  label:'课程类别:',filed:'type_id' , opt:'$eq' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
          {  label:'课程标题:',filed:'name' , opt:'$eq' , options:[] , defaultValue:'' , type:'input' , optionUrl:'' },
          {  label:'课程编号:',filed:'courseSn' , opt:'$eq' , options:[] , defaultValue:'' , type:'input' , optionUrl:'' },
          {  label:'课程日期:',filed:'timeRange' , opt:'$eq' , options:[] , defaultValue:'' , type:'dateRange' , optionUrl:'' },
          {  label:'年级:',filed:'grade_id' , opt:'$eq' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
          {  label:'科目:',filed:'subject_id' , opt:'$eq' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
          {  label:'校区:',filed:'school_id' , opt:'$eq' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
          {  label:'教室:',filed:'classroom_id' , opt:'$eq' , options:[] , defaultValue:'' , type:'input' , optionUrl:'' },
        ],
        
        dialogType:'edit',//edit 修改  add 新增
        pageType:'table',//edit   table
        formData:{
          
        },
        showEdit:false,
        showEditTime:false,
        apiList,
        gradeConfig:[],
        subjectConfig:[],
        typeConfig:[],
        semesterConfig:[],
        teacherTeamConfig:[],
        schoolConfig:[],
        teacherConfig:[],

        currPage1:1,
        pageSize1:10,
        totalCount1:1
      }
    },
    mounted () {
        this.getLocalList();
        this.getOptions();
    },
    computed :{
     
    },
    methods:{
        backToList () {
          this.activeName = 'user'
          this.showEdit = false;
        },
        getLocalList () {
          this.setDataFilters(Object.assign({},this.dataFilters,{running_state:1}))
          this.getList()
        },
        handleClick (name) {
            //console.log(name)
        },  
        getUserTableData (id) {
          api.course_students({id,page_num:this.pageSize1,page:this.currPage1})
          .then(data=>{
              //console.log(data);
          })
        },
        handleCurrentChange1 () {
          api.course_students({id,page_num:this.pageSize1,page:this.currPage1})
          .then(data=>{
              let tableData = data.data.data;
              let {pagination} = data.data
              this.userTableData = tableData
              let {total,per_page,current_page,total_pages} = pagination
              this.totalCount1 =total-0;
              this.pageSize1 = per_page-0;
              this.currPage1 = current_page-0;
          })
        },
        handleEndedCourse (info) {
            this.$confirm('即将结束该课程, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
              api.course_on_end({id:info.id})
              .then(data=>{
                this.getLocalList()
                this.$appmessage({
                  type:'success',
                  message:data.message||'结束课程成功'
                })
              })
          }).catch(() => {
                   
          });
        },
        viewUserInfo (info) {
          Object.keys(info).forEach(key=>{
            this.$set(this.seatInfo,key,info[key])
          })
          this.$currUserId = info.id
          api.course_students({id:info.id,page_num:this.pageSize1,page:this.currPage1})
          .then(data=>{
              let tableData = data.data.data;
              let {pagination} = data.data.meta
              this.userTableData = tableData
              let {total,per_page,current_page,total_pages} = pagination
              this.totalCount1 =total-0;
              this.pageSize1 = per_page-0;
              this.currPage1 = current_page-0;
              this.showEdit = true  
          })
          
        },
        handleUserExport (url) {
          let id = this.$currUserId
          let token = getToken()
          let data = Object.assign({},{is_export:1,id})
          let config = {}
          config.responseType = 'blob'
          data.token = token
          data = qs.stringify(data)
          this.$http.post(url,data,config)
          .then(res=>{
            let {headers} = res;
            let fileName;
            if (headers.exportexcelname){
                fileName = decodeURI(headers.exportexcelname)
            }else{
              fileName = 'excel.xlsx'
            }
            this.download(res.data,fileName)
          })
          .catch(err=>{
            this.$appmessage({
              type:'error',
              message:'导出失败'
            })
          })
        },
        handleRemote (query) {
          api.teacher_search({query})
          .then(data=>{
              this.teacherConfig = data.data
          })
        },
        viewDocument (row) {
          this.$router.push(`/usr_mgr/index?user_id=${row.user_id}`)
        },
        handleEditHour (item,type) {
          if (type=='add'){
            this.timeFormData = {

            }
            this.hourstimeRange = [moment().format('HH:mm:ss'),moment().format('HH:mm:ss')]
            this.showEditTime = true;
            return
          }
          Object.keys(item).forEach(key=>{
            this.$set(this.timeFormData,key,item[key])
            if (key=='teacher_id') {
              this.teacherConfig = [{id:item[key],value:item.teacherName}]
            }
            if (key=='class_time_start') {
              
              this.hourstimeRange = [moment(item.class_date+' '+item[key]).format('HH:mm:ss'),moment(item.class_date+' '+item.class_time_end).format('HH:mm:ss')]
            }
          })
          this.showEditTime = true;
        },
        handleDeleteHour (id) {
          this.hoursTableData = this.hoursTableData.filter((item=>item.id!==id));
        },
        handleSubEidtTime () {
            this.$refs.timeFormData.validate(valid=>{
              if (valid) {
                let param = this.timeFormData;
                param.class_time_start = this.hourstimeRange[0]
                param.class_time_end = this.hourstimeRange[1]
                param.teacherName = this.teacherConfig.filter(teacher=>teacher.id==this.timeFormData.teacher_id)[0].value
                param.weekName = moment(this.formData.class_date).format('dddd')
                let copyData = JSON.parse(JSON.stringify(param));
                this.hoursTableData.push(copyData)

                this.showEditTime = false;
              }
            })
        },
        doOffLine (id) {
          api.course_not_online({id})
          .then(data=>{
            this.getLocalList()
          })
        },
        doOnLine (id) {
          api.course_online({id})
          .then(data=>{
            this.getLocalList()
          })
        },
        handleDoSearch (filter) {
            this.setDataFilters(filter)
            this.getLocalList()
        },
        handleDelete (id) {
          
          api.course_delete({id})
          .then(data=>{
            this.showEdit = false;
            this.getLocalList()
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
            this.filterOptions[3].options = typeMap
            this.filterOptions[7].options = gradeMap
            this.filterOptions[8].options = subjectMap
            this.filterOptions[9].options = schoolMap
            this.semesterConfig = JSON.parse(JSON.stringify(semesterMap))
            this.teacherTeamConfig = JSON.parse(JSON.stringify(teacherTeamMap))
            this.typeConfig = JSON.parse(JSON.stringify(typeMap))
            this.gradeConfig = JSON.parse(JSON.stringify(gradeMap))
            this.subjectConfig = JSON.parse(JSON.stringify(subjectMap))
            this.schoolConfig = JSON.parse(JSON.stringify(schoolMap))
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
                param.course_hour_list = JSON.stringify(this.hoursTableData);
                api.course_save(param)
                .then(data=>{
                  this.showEdit = false;
                  this.getLocalList()
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
        getHoursList (id) {
          // 课时列表
          return api.course_hour({id:id,page_num:10000})
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
            api.course_detail({id:item.id})
            .then(data=>{
              let info = data.data;
              Object.keys(info).forEach(key=>{
                this.$set(this.formData,key,info[key])
                if (key=='thumbnail'){
                  this.imgList = [{url:info[key]}]
                }
              })
              this.showEdit = true;
              this.getHoursList(item.id)
              .then(data=>{
                 this.hoursTableData = data.data.data;
              })
              
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
      // background-color:#fff;
      &.video-set{
        max-width: 1200px;
        margin:0 auto;
        background-color:#fff;
        padding:0 32px;
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
        &:first-child{
          padding-right:30px;
        }
        &:last-child{
          padding-right:30px;
        }
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
        &:nth-child(2){
          padding:0 30px;
          border-left: 1px solid #dddddd;
          
        }
      }
    }
    .card-wrapper{
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
    .user-data{
      margin-top:20px;
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
</style>
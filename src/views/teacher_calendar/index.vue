<!--
 * @Author: David
 * @Date: 2019-10-31 19:13:06
 * @LastEditTime: 2019-11-27 16:28:02
 * @LastEditors: Do not edit
 * @Description: 教师课表
 -->
 <!-- eslint-disable -->
<template>
  <div class="comment-set-wrap page-wrap">
      <div class="common-set  page-inner" v-if="!showEdit">
          <div class="set-header">
             <div class="teacher_filter_wrap">
                <TopTab
                    v-model="activeName"
                    :tabs="tabs"
                    >

                    </TopTab>
              </div>
          </div>

          
          
          <div class="page-table" v-if="activeName=='canlendar'">


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
                label="教师姓名"
                header-align="center"
                align="center"
                width="200px"
                >
                  <template slot-scope="scope">
                      <div class="people-wrap" @click="handleLinkTo(scope.row.teacher_id)">
                          <img :src="scope.row.teacherThumbnail" alt="" class="avatar">
                          <span class="name">{{scope.row.teacherName||'--'}}</span>
                      </div>
                  </template>
                </el-table-column>
                
                <el-table-column
                label="课程编号"
                header-align="center"
                align="center"
                prop="courseSn"
                >
                 
                </el-table-column>

                <el-table-column
                label="教学组"
                header-align="center"
                align="center"
                prop="teacherTeamName"
                >
                    
                </el-table-column>
                

                <el-table-column
                prop="courseName"
                label="课程标题"
                header-align="center"
                align="center"
                >
                </el-table-column>

                <el-table-column
                prop="subjectName"
                label="科目"
                header-align="center"
                align="center"
                >
                </el-table-column>

                <el-table-column
                prop="typeName"
                label="课程类别"
                header-align="center"
                align="center"
                >
                </el-table-column>

                <el-table-column
                label="课程日期"
                header-align="center"
                align="center"
                min-width="150px"
                >
                   <template slot-scope="scope">
                      <span v-if="scope.row.classStartDate&&scope.row.classEndDate">{{scope.row.classStartDate}}至{{scope.row.classEndDate}}</span>
                      <span v-else>--</span>
                    </template>
                </el-table-column>


                <el-table-column
                prop="classHour"
                label="课时"
                header-align="center"
                align="center"
                >
                </el-table-column>


                <el-table-column
                prop="selectedNum"
                label="人数"
                header-align="center"
                align="center"
                >
                </el-table-column>

                <el-table-column
                prop="schoolName"
                label="校区"
                header-align="center"
                align="center"
                width="200px"
                >
                </el-table-column>

                <el-table-column
                prop="classRoomId"
                label="教室"
                header-align="center"
                align="center"
                >
                </el-table-column>

                

                
                <el-table-column
                label="操作"
                header-align="center"
                align="center"
                min-width="100px"
                >

                  <template slot-scope="scope">
                      <el-button size="mini" type="primary" @click="handleEdit(scope.row,'edit')">
                        查看课表
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
          <div class="page-table" v-else>


              <div class="filter-wrap">
                <filterCom
                :filterOptions="filterOptions1"
                @dosearch="handleDoSearch1"
                type="keyValue"
                >
                 
                </filterCom>
              </div>

              

              <el-table
              :data="localTabelData"
              header-row-class-name="headrow"
              header-cell-class-name="headrowcell"
              border
              :span-method="objectSpanMethod"
              >

               <el-table-column
            
              label="时间段"
              header-align="center"
              align="center"
              prop="time"
              >
                
              </el-table-column>

              <el-table-column
              v-for="(value,index) in getTableFields"
              :label="value.label"
              header-align="center"
              align="center"
              :key="index+Math.random()"
              >
                <template slot-scope="scope">
                  <span class="blue" @click="handlePahtLink(scope.row[value.prop])">{{scope.row[value.prop]?(scope.row[value.prop].course_name||'--'):'--'}}</span>
                </template>
              </el-table-column>
                
              </el-table>

              <div class="pagination">
                <el-pagination
                  @current-change="handleCurrentChange1"
                  :current-page.sync="currPage1"
                  :page-size="pageSize1"
                  layout="prev, pager, next, jumper"
                  :page-count="totalPage1">
                </el-pagination>
              </div>
          </div>
          
      </div>

      <div class="page-inner video-set" v-else>
          <p class="set-header page-header">
              教师课表
          </p>

          <div class="page-tables">
             <Calendar
             @changedate="handleChangeDate"
             >
                <template slot="headers_right">
                  <span class="lesson-name">{{currRowData.courseName}}</span>
                  <span class="teacher-name">主讲：{{currRowData.teacherName}}</span>
                </template>
             </Calendar>

             <div class="botton-back">
              <el-button type="primary" @click="showEdit=false">返回列表</el-button>
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
import pagination from '@/mixins/pagination'
import TopTab from '@/components/TopTab'
import api from '@/utils/api'
import {apiList} from '@/utils/api'
import moment from '@/utils/localMoment'
import {mapMutations} from 'vuex'
export default {
    name:'teacherSet',
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
        listApi:api.teacher_calendar_list,
        listApi1:api.course_calendar_list,
        activeName:'canlendar',//canlendar教师课表  all_canlendar所有课表
        tabs:[{id:'canlendar',value:'教师课表'},{id:'all_canlendar',value:'总课表'}],
        filterOptions:[
          {  label:'标题:',filed:'courseName' , opt:'$like' , options:[] , defaultValue:'' , type:'input' , optionUrl:'' },
          {  label:'课程编号:',filed:'courseSn' , opt:'$like' , options:[] , defaultValue:'' , type:'input' , optionUrl:'' },
          {  label:'校区:',filed:'school_id' , opt:'$eq' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
          {  label:'教师:',filed:'teacher_id' , opt:'$eq' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' ,remoteUrl:apiList.teacher_search},
          {  label:'日期:',filed:'timeRange' , opt:'$eq' , options:[] , defaultValue:'' , type:'dateRange' , optionUrl:'' },
        ],
        filterOptions1:[
          {  label:'校区:',filed:'school_id' , opt:'$like' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
          {  label:'年级:',filed:'grade_id' , opt:'$eq' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
          {  label:'科目:',filed:'subject_id' , opt:'$eq' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
          {  label:'课程日期:',filed:'timeRange' , opt:'$eq' , options:[] , defaultValue:'' , type:'dateRange' },
        ],
        teacherConfig:[],
        dialogType:'edit',//edit 修改  add 新增
        pageType:'table',//edit   table
        formData:{
          
        },
        currRowData:{

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
        apiList,
        schoolConfig:[],
        pageSize1:10,
        currPage1:1,
        totalCount1:1,
        totalPage1:1,
        dataFilters1:{

        },
        localData:{}
      }
    },
    mounted () {
        this.getList();
        this.getOptions();
        this.getLocalList();
    },
    computed :{
      localTabelData () {
            let localData = JSON.parse(JSON.stringify(this.localData))
            if (Object.keys(localData).length<=0) {
                return []
            }

            let arr = []
            Object.keys(localData).forEach(key=>{
                Object.keys(localData[key]).forEach(k=>{
                    if (localData[key][k].length>0) {
                        localData[key][k].forEach(k2=>{
                            let obj = {}
                            obj.day = key;
                            obj.time = k ;
                            obj = Object.assign({},obj,k2)
                            arr.push(obj);
                        })
                    }else{
                      
                          let obj = {}
                          obj.day = key;
                          obj.time = k ;
                          arr.push(obj);
                      
                    }
                })
            })

            console.log(arr)

            arr.sort((a,b)=>{
                if (a.time>b.time){
                    return 1;
                }
                if (a.time==b.time){
                    return 0;
                }
                if (a.time <b.time) {
                    return -1;
                }
            }) 

            
            // 找出所有的时间段
            let timeArr = []
            arr.forEach(item=>{
                if (timeArr.indexOf(item.time)<0) {
                    timeArr.push(item.time)
                }
            })

            console.log(timeArr)
            
            // 找出所有的日期
            let dateArr = []
            arr.forEach(item=>{
                if (dateArr.indexOf(item.day)<0) {
                    dateArr.push(item.day)
                }
            })
            dateArr.sort((a,b)=>{
              if (a>b){
                  return 1;
              }
              if (a==b){
                  return 0;
              }
              if (a <b) {
                  return -1;
              }
            })
            
            // 
            let finalArr = []
            for (let i=0,len=timeArr.length;i<len;i++){
              let sum =0
              for (let j=0,len=dateArr.length;j<len;j++){
                let res = arr.filter((item=>{
                  return item.day==dateArr[j]&&item.time==timeArr[i]
                }))
                sum = sum>res.length?sum:res.length
              }
              console.log(timeArr[i],sum)
              for (let d=0;d<sum;d++) {
                let singleTime = {}
                dateArr.forEach((day,index)=>{
                  singleTime.time = timeArr[i]
                  let idx = arr.findIndex((it)=>{
                    return it.day==day&&it.time==timeArr[i]&&!it.selected
                  })
                  if (idx<0) {
                    singleTime[day] = {}
                  }else{
                    arr[idx].selected = true
                    singleTime[day] = {}
                    Object.keys(arr[idx]).forEach(key=>{
                      singleTime[day][key] = arr[idx][key]
                    })
                  }
                  if (d==0){
                    singleTime.firstColSpan = sum;
                  }
                  else{
                    singleTime.firstColSpan = 0;
                  }
                })
                finalArr.push(singleTime)
              }
            }

            return finalArr;


        },

      getTableFields () {
        let dateArr = Object.keys(this.localData)
        dateArr.sort((a,b)=>{
          if (a>b){
              return 1;
          }
          if (a==b){
              return 0;
          }
          if (a <b) {
              return -1;
          }
        })
        dateArr = dateArr.map(date=>{
          return {
              prop:date,
              label:moment(date).format('MM.DD')+' ('+moment(date).format('dddd')+')'
            }
        })
        return dateArr;
      }
    },
    methods:{
        ...mapMutations({
          updatePathRedirect:'redirect/updatePathRedirect'
        }),
        handlePahtLink (row) {
           if (!row||!row.course_name) {
            return
          }
          let path = '/course_setting/on_shelves'
          if (row.online_state==2) {
            path="/course_setting/not_on_shelf"
          }
            this.updatePathRedirect({
              path:path,
              data:{
                online_state:row.online_state,
                course_id:row.course_id,
              }
            })
            this.$router.push(path)
        },
        handleLinkTo(id) {
          let key = '/system_set/teacher_set'
          this.updatePathRedirect({data:{
            teacher_id:id
          },path:key})
          this.$router.push(key)
        },
        setDataFilters1 (value) {
          this.$set(this,'dataFilters1',value)
        },
        handleCurrentChange1 (page) {
          this.currPage1 = page
          this.getLocalList()
        },
        objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
          
          if (columnIndex==0) {
            if(row.firstColSpan==0) {
              return {
                rowspan:0,
                colspan:0
              }
            }else{
              return {
                rowspan:row.firstColSpan,
                colspan:1
              }
            }
            
            
          }
        },
        handleChangeDate ({news,cb,fcb}) {
          api.teacher_calendar_detail({month:news,teacher_id:this.currRowData.teacher_id})
          .then(data=>{
            let arr = Object.keys(data.data).map(item=>{
              return {
                date:item,
                lessons:data.data[item]
              }
            })
            cb&&cb(arr)
          })
          .catch(()=>{
            fcb&&fcb()
          })
          cb([])
        },

        handleDoSearch1 (filter) {
          this.currPage1 = 1
          this.setDataFilters1(filter)
          this.getLocalList()
        },

        getLocalList () {
            this.setDataFilters1(Object.assign({},this.dataFilters1,{
                page_num:this.pageSize1,
                page:this.currPage1
            }))
            this.listApi1(this.dataFilters1)
            .then(data=>{
                let {pagination} = data.data.meta
                this.setPagination1(pagination)
                this.$set(this,'localData',data.data.data)
            })
        },

        setPagination1 (pagination) {
            if (!pagination) {
              return;
            }
            let {total,per_page,current_page,total_pages} = pagination
            this.totalCount1 =total-0;
            this.pageSize1 = per_page-0;
            this.currPage1 = current_page-0;
            this.totalPage1 = total_pages-0;
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
          api.course_calendar_config()
          .then(data=>{ 
            let {schoolMap,gradeMap,subjectMap} = data.data
            this.schoolConfig = schoolMap
            this.filterOptions[2].options = JSON.parse(JSON.stringify(schoolMap))
            this.filterOptions1[0].options = schoolMap
            this.filterOptions1[2].options = subjectMap
            this.filterOptions1[1].options = gradeMap
          })
        },  
        handleSub () {
          let thumbnail = this.imgList[0]?this.imgList[0].url:''
          // this.formData.thumbnail = thumbnail
          this.$set(this.formData,'thumbnail',thumbnail)
          let url = this.videoList[0]?this.videoList[0].url:''
          this.$set(this.formData,'url',url)
          this.$refs.formData.validate(valid=>{
            if (valid) {
                let param = JSON.parse(JSON.stringify(this.formData))
                param.thumbnail = thumbnail;
                param.url = url;
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
              this.$set(this.currRowData,key,item[key])
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
    padding:0 20px;
    padding-top:20px;
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
      display:flex;
      align-items: center;
      cursor: pointer;
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
    .teacher_filter_wrap{
      padding-left:14px;
    }
    .blue{
      color:#0566ce;
      cursor: pointer;
    }
</style>
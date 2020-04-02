<!--
 * @Author: David
 * @Date: 2019-10-31 19:13:06
 * @LastEditTime: 2019-12-04 16:09:40
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
                  <template slot="anotherbtn">
                      <el-button type="success" icon="el-icon-plus" @click="handleEdit(null,'add')" v-if="hasEditPermission">
                        新增
                      </el-button>
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
                                <p>名额</p>
                                <p>{{info.info.total_num}}</p>
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
                          <el-button type="primary"  size="mini"  @click="doOnSale(info.info.id)" v-if="hasEditPermission">上架</el-button>
                          <el-button type="primary" plain size="mini" @click="handleEdit(info.info,'edit')" v-if="hasEditPermission">修改</el-button>
                          <el-button type="default" size="mini"  @click="proxy_handleDelete(info.info.id,'handleDelete')" v-if="hasEditPermission">删除</el-button>
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
              {{dialogType=='edit'?'修改':'新增'}}课程
          </p>
          
          <div class="page-table">
              <el-form :model="formData" ref="formData" :rules="formRule" label-width="130px" style="margin-top:20px;">
                
                <div class="inline">
                  <el-form-item label="课程编号:" prop="courser_sn">
                      <el-input v-model="formData.courser_sn"></el-input>
                  </el-form-item>
                   <el-form-item label="课程标题:" prop="name">
                      <el-input v-model="formData.name"></el-input>
                  </el-form-item>
                </div>

                <el-form-item label="上传图片:"  prop="thumbnail">
                  <uploadImg
                  v-model="imgList"
                  desc="上传图片推荐尺寸：243×150"
                  :actionUrl="`/api`+apiList.course_upload"
                  :files="imgList"
                  
                  >
                    
                  </uploadImg>
                </el-form-item>
                
                <div class="inline">
                  <el-form-item label="学期:" prop="semester_id">
                      <el-select v-model="formData.semester_id">
                        <el-option v-for="(option,index) in semesterConfig" :key="index" :label="option.value" :value="option.id">
                  
                        </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="教学组:" prop="teacher_team_id">
                      <el-select v-model="formData.teacher_team_id">
                        <el-option v-for="(option,index) in teacherTeamConfig" :key="index" :label="option.value" :value="option.id">
                            
                        </el-option>
                      </el-select>
                  </el-form-item>
                </div>

                <div class="inline">
                  <el-form-item label="课程类别:" prop="course_type_id">
                      <el-select v-model="formData.course_type_id">
                        <el-option v-for="(option,index) in typeConfig" :key="index" :label="option.value" :value="option.id">
                  
                        </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="科目:" prop="subject_id">
                      <el-select v-model="formData.subject_id">
                        <el-option v-for="(option,index) in subjectConfig" :key="index" :label="option.value" :value="option.id">
                  
                        </el-option>
                      </el-select>
                  </el-form-item>
                </div>


                <div class="inline">
                  
                  <el-form-item label="年级:" prop="grade_id">
                      <el-select v-model="formData.grade_id">
                        <el-option v-for="(option,index) in gradeConfig" :key="index" :label="option.value" :value="option.id">
                  
                        </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="价格:" prop="source_price">
                      <el-input style="width:85%;" v-model="formData.source_price">
                        
                      </el-input>
                      <span>元</span>
                  </el-form-item>
                </div>

                <div class="inline">
                  
                  <el-form-item label="名额:" prop="total_num">
                      <el-input v-model="formData.total_num"></el-input>
                  </el-form-item>

                  <el-form-item label="校区:" prop="school_id">
                      <el-select v-model="formData.school_id">
                        <el-option v-for="(option,index) in schoolConfig" :key="index" :label="option.value" :value="option.id">
                  
                        </el-option>
                      </el-select>
                  </el-form-item>
                </div>

                

                <div class="inline">
                  
                  <el-form-item label="教室:" prop="classroom_id">
                      <el-input v-model="formData.classroom_id"></el-input>
                  </el-form-item>
                  <el-form-item label="座位安排:">
                      <el-input-number :controls="false" style="width:80px" v-model="formData.seat_row_num"></el-input-number>
                      <span>行</span>
                      <el-input-number :controls="false" style="width:80px" v-model="formData.seat_column_num"></el-input-number>
                      <span>列</span>
                  </el-form-item>
                </div>

                <div class="inline">
                    <el-form-item label="排序权重" prop="weight">
                        <el-input-number v-model="formData.weight" :controls="false">
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="是否展示在首页：" prop="is_show_index">
                          <el-checkbox v-model="formData.is_show_index" :true-label="1" :false-label="0">是</el-checkbox>
                    </el-form-item>
                </div>
                
                
                
                <el-form-item label="新增课时:" prop="detail">
                      <div class="time-table page-table">
                          <el-table :data="hoursTableData"
                          header-row-class-name="headrow"
                          header-cell-class-name="headrowcell"
                          >
                            <el-table-column
                            type="index"
                            label="序号"
                            header-align="center"
                            align="center"
                            >
                            </el-table-column>

                            <el-table-column
                            prop="class_date"
                            label="日期"
                            header-align="center"
                            align="center"
                            >
                            </el-table-column>

                            <el-table-column
                            label="时间"
                            header-align="center"
                            align="center"
                            >
                              <template slot-scope="scope">
                                
                                  <span>{{getHourTimeRange(scope.row)}}</span>
                                
                              </template>
                            </el-table-column>

                            <el-table-column
                            prop="weekName"
                            label="星期"
                            header-align="center"
                            align="center"
                            >
                            </el-table-column>

                            <el-table-column
                            prop="hour_num"
                            :label="`课时数(${getHourNum})`"
                            header-align="center"
                            align="center"
                            >
                            </el-table-column>

                            <el-table-column
                            prop="teacherName"
                            label="主讲老师"
                            header-align="center"
                            align="center"
                            >
                            </el-table-column>

                            <el-table-column
                              label="操作"
                              header-align="center"
                              align="center"
                              min-width="140px"
                              >

                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary" @click="handleEditHour(scope.row,'edit')">修改</el-button>
                                    <el-button size="mini" type="default" @click="proxy_handleDelete(scope.row.id,'handleDeleteHour')">
                                      删除
                                    </el-button>
                                </template>

                              </el-table-column>
                          </el-table>

                          <el-button icon="el-icon-plus" type="success" class="addButton" @click="handleEditHour(null,'add')">新增课时</el-button>
                      </div>
                </el-form-item>

                <el-form-item label="备注：" prop="note">
                    <el-input v-model="formData.note"></el-input>
                </el-form-item>

                <el-form-item label="课程介绍：" prop="detail">
                    <editorCom v-model="formData.detail"
                    :options="editOptions"
                    >
                      
                    </editorCom>
                </el-form-item>
                
              </el-form>

              <div class="subBtn-list">
                  <el-button type="primary" @click="handleSub">
                      确定
                  </el-button>

                  <el-button type="info" @click="showEdit=false">
                     取消
                  </el-button>
              </div>
          </div>
          
      </div>
      
      <!-- 修改面板 -->
      <el-dialog :visible.sync="showEditTime" width="526px"  :close-on-click-modal="false" :title ="`${dialogType=='edit'?'修改':'新增'}课时`">

          <el-form :model="timeFormData" label-width="100px" :rules="timeFormRule" ref="timeFormData" class="timeformer">
              <el-form-item label="日期：" prop="class_date">
                      <el-date-picker
                        v-model="timeFormData.class_date"
                        type="date"
                        :picker-options="pickOption"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                      </el-date-picker>
              </el-form-item>
              
              <el-form-item label="时间段：" prop="hours_id">
                       <!-- <el-time-picker
                        is-range
                        v-model="hourstimeRange"
                        value-format="HH:mm"
                        format="HH:mm"
                        range-separator="至"
                        arrow-control
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        placeholder="选择时间范围">
                      </el-time-picker> -->
                      <el-select v-model="timeFormData.hours_id">
                        <el-option v-for="(option,index) in classHourTimeConfig" :key="index" :label="option.value" :value="option.id">
                        
                        </el-option>
                      </el-select>
              </el-form-item>

              <el-form-item label="主讲老师" prop="teacher_id">

                  <el-select v-model="timeFormData.teacher_id" filterable :remote="true" :remote-method="handleRemote">
                      <el-option v-for="(option,index) in teacherConfig" :key="index" :label="option.value" :value="option.id">
                        
                      </el-option>
                  </el-select>

              </el-form-item>

              <el-form-item label="课时数" prop="hour_num">

                  <el-input v-model="timeFormData.hour_num"></el-input>

              </el-form-item>

          </el-form>

          <div class="subBtn">
            <el-button type="success" @click="handleSubEidtTime">确定</el-button>
          </div>
      </el-dialog>
      <!-- 修改面板 -->

      
  </div>
</template>
<script>
import editorCom from '@/components/editor/editorCom.vue'
import uploadImg from '@/components/uploadImg'
import filterCom from '@/components/filterCom'
import lessonCard from '@/components/lessonCard'
import pagination from '@/mixins/pagination'
import api from '@/utils/api'
import moment from '@/utils/localMoment'
import {apiList} from '@/utils/api'
import {getToken} from '@/utils/auth'
import svgIcon from '@/components/SvgIcon'
export default {
    name:'offShelves',
    components:{editorCom,uploadImg,filterCom,lessonCard,svgIcon},
    mixins:[pagination],
    data () {

      let validateEmpty = (rule,value,cb)=>{
        if (!value) {
            return cb(new Error('请填写信息'))
          }
          cb()
      }

      let getValiableTimes = ()=>{
        let startTime = moment().format('HH:mm:ss')
        let endTime = '23:59:59'
        return `${startTime}-${endTime}`
      }

      let validateHourstimeRange = (rule,value,cb)=>{
          let timeValue = this.hourstimeRange
          let str = timeValue.join('-')
          let nowStr = getValiableTimes()
          let currDate = moment().format('YYYY-MM-DD')
          // //console.log(currDate,this.timeFormData.class_date)
          if (this.timeFormData.class_date==currDate) {
            if (str<nowStr) {
              return   cb(new Error('开始时间不能小于当前时间'))
            }
            cb()
          }else{
            cb()
          }
          
      }

      return {
        editOptions:{
            uploadJson:'/api'+apiList.course_upload+'?token='+getToken()
        },
        courseList:[
          {},{},{}
        ],
        imgList:[],
        pageSize:5,
        listApi:api.course_list,
        hoursTableData:[],
        hourstimeRange:[],
        timeFormData:{},
        timeFormData_timeRange:[],
        
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
        formRule:{
          courser_sn:[
            {validator:validateEmpty}
          ],
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
        timeFormRule:{
          hourstimeRange:[
            {validator:validateHourstimeRange}
          ],
          class_date:[
            {validator:validateEmpty}
          ],
          teacher_id:[
            {validator:validateEmpty}
          ],
          hours_id:[
            {validator:validateEmpty}
          ],
          hour_num:[
            {validator:validateEmpty}
          ]
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
        classHourTimeConfig:[],
        pickOption:{
          disabledDate (currDate) {
              let nowDateTamp = new Date().getTime()
              let currDateTamp = currDate.getTime()
              return (nowDateTamp-24*3600*1000)>=currDateTamp;
          }
        },
      }
    },
    mounted () {
        this.getLocalList();
        this.getOptions();
    },
    computed :{
        getHourNum () {
          let count = 0;
          if (this.hoursTableData.length>0) {
            count = this.hoursTableData.reduce((sum,curr)=>{
                return sum + (curr.hour_num-0)
            },count)
          }
          return count;
        }
        
    },
    filters:{
      filterSeconds (str) {
        
        return moment(str).format('HH:mm')
      },
    },
    methods:{
        getLocalList () {
          this.setDataFilters(Object.assign({},this.dataFilters,{online_state:0}))
          this.getList()
        },
        getHourTimeRange (item) {
            let timeArr = this.classHourTimeConfig.filter(it=>it.id==item.hours_id)
            console.log(timeArr)
            if (timeArr.length<=0){
              return '--至--'
            }
            return timeArr[0].value.replace('-','至')
        },
        handleRemote (query) {
          api.teacher_search({query,team_id:this.formData.teacher_team_id?this.formData.teacher_team_id:''})
          .then(data=>{
              this.teacherConfig = data.data
          })
        },
        handleEditHour (item,type) {
          if (type=='add'){
            this.timeFormData = {

            }
            this.hourstimeRange = [moment().format('HH:mm:ss'),moment().format('HH:mm:ss')]
            this.showEditTime = true;
            this.$timeType='add'
            return
          }
          this.$timeType='edit'
          this.$currTime = item
          Object.keys(item).forEach(key=>{
            if (key=='teacher_id') {
              this.teacherConfig = [{id:item[key],value:item.teacherName}]
            }
            
            this.$nextTick(()=>{
              this.$set(this.timeFormData,key,item[key])
            })
            
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
                param.teacherName = this.teacherConfig.filter(teacher=>teacher.id==this.timeFormData.teacher_id)[0].value
                param.weekName = moment(this.timeFormData.class_date).format('dddd')
                let copyData = JSON.parse(JSON.stringify(param));
                

                if (this.$timeType=='add'){
                  this.hoursTableData.push(copyData)
                }
                if (this.$timeType=='edit'){
                    this.$currTime&&Object.keys(param).forEach(key=>{
                      this.$currTime[key] = param[key]
                    })
                    this.$currTime = null
                }

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
        doOnSale (id) {
          api.course_on_sale({id})
          .then(data=>{
            this.getLocalList()
            this.$appmessage({
              type:'success',
              message:data.message||'上架成功'
            })
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
          api.course_calendar_config()
          .then(data=>{ 
            let {gradeMap,schoolMap,semesterMap,subjectMap,teacherTeamMap,typeMap,classHourTimeMap} = data.data;
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
            this.classHourTimeConfig = JSON.parse(JSON.stringify(classHourTimeMap))
          })
        },  
        handleSub () {
          let thumbnail = this.imgList[0]?this.imgList[0].url:''
          // // this.formData.thumbnail = thumbnail
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
                this.hoursTableData = []
                this.showEdit = true;
                // api.generate_course_sn()
                // .then(data=>{
                //   let {sn} = data.data
                //   this.$set(this.formData,'courser_sn',sn);
                //   this.showEdit = true;
                // })
                
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
    .el-select{
      width: 185px;
    }
    .el-input-number{
      width: 185px;
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
          // border-right: 1px solid #dddddd;
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
    .timeformer{
      .el-select{
        width: 100%;
      }
      .el-date-editor{
        width: 100%;
      }
    }
</style>
<!--
 * @Author: David
 * @Date: 2019-10-31 19:13:06
 * @LastEditTime: 2019-11-27 10:24:10
 * @LastEditors: Do not edit
 * @Description: 小区设置
 -->
 <!-- eslint-disable -->
<template>
  <div class="comment-set-wrap page-wrap">
      <div class="common-set  page-inner" v-if="!showEdit">  
          <div class="page-table ">


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
                                <p>名额</p>
                                <p>{{info.info.total_num}}</p>
                              </div>

                              <div class="leave">
                                <p>剩余名额</p>
                                <p>{{info.info.left_num}}</p>
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
import svgIcon from '@/components/SvgIcon'
import {apiList} from '@/utils/api'
import {mapState,mapMutations} from 'vuex'
export default {
    name:'notOnShelf',
    components:{editorCom,uploadImg,filterCom,lessonCard,svgIcon},
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
        teacherConfig:[]
      }
    },
    mounted () {
        this.getLocalList();
        this.getOptions();
    },
    computed :{
      ...mapState({
          pathFilter:state=>state.redirect['/course_setting/not_on_shelf']
        })
    },
    methods:{
        ...mapMutations({
          updatePathRedirect:'redirect/updatePathRedirect'
        }),
        getLocalList () {
          let param = Object.assign({online_state:2},this.dataFilters,{online_date:this.pathFilter.timeRange,...this.pathFilter});
          this.getList(param)
        },
        handleRemote (query) {
          api.teacher_search({query})
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
      justify-content: space-between;
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
        &:nth-child(2){
          padding:0 30px;
          border-left: 1px solid #dddddd;
          border-right: 1px solid #dddddd;
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
</style>
<!--
 * @Author: David
 * @Date: 2019-10-31 19:13:06
 * @LastEditTime: 2019-12-05 15:16:46
 * @LastEditors: Do not edit
 * @Description: 学生签到统计
 -->
 <!-- eslint-disable -->
<template>
  <div class="comment-set-wrap page-wrap">
      <div class="common-set  page-inner">
          <p class="set-header page-header">
              学生签到统计{{allTotal}}条
          </p>
          
          <div class="page-table">

              <div class="tab-wrapper">
                <TopTab
                v-model="activeName"
                :tabs="tabs"
                
                >

                </TopTab>
              </div>
              
              <div class="filter-wrap">
                <filterCom
                :filterOptions="filterOptions"
                @dosearch="handleDoSearch"
                type="keyValue"
                >
                  <template slot="anotherbtn">
                      <el-button type="success" @click="handleExport('/api'+apiList.student_sign_statistics)"  v-if="needSecret">
                        导出Excel
                      </el-button>
                  </template>
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
                label="学期"
                header-align="center"
                align="center"
                prop="semesterName"
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
                prop="courseSn"
                label="课程编号"
                header-align="center"
                align="center"
                >
                </el-table-column>

                <el-table-column
                prop="order_sn"
                label="订单编号"
                header-align="center"
                align="center"
                >
                  <template slot-scope="scope">
                    <span>{{scope.row.order_sn||'--'}}</span>
                  </template>
                </el-table-column>

                <el-table-column
                prop="upload_time"
                label="主讲老师"
                header-align="center"
                align="center"
                >

                      <template slot-scope="scope">
                        <span>{{scope.row.teachers|teacherFilter}}</span>
                      </template>

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
                prop="sign_time"
                label="签到日期"
                header-align="center"
                align="center"
                width="200px"
                >
                </el-table-column>


                <el-table-column
                prop="operation_time"
                label="操作日期"
                header-align="center"
                align="center"
                width="200px"
                >
                </el-table-column>


                <el-table-column
                prop="userName"
                label="姓名"
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
                label="签到状态"
                header-align="center"
                align="center"
                >

                <template slot-scope="scope">
                  
                    <span :class="[(scope.row.sign_type==3||scope.row.sign_type==4)?'red':scope.row.sign_type==5?'black':'green']">{{scope.row.signTypeName}}</span>
                  
                </template>

                </el-table-column>

                

                
                <el-table-column
                label="操作"
                header-align="center"
                align="center"
                min-width="100px"
                v-if="hasEditPermission"
                >

                  <template slot-scope="scope">
                      <el-button size="mini" type="primary" @click="handleEdit(scope.row,'edit')" :disabled="!canModifySign||(scope.row.sign_type==5)">
                        修改
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

     <!-- 学生签到 -->
      <el-dialog :visible.sync="showEdit" width="526px"  :close-on-click-modal="false" :title ="`修改学生签到`">

          <el-form :model="formData" label-width="100px" :rules="formRule" ref="formData" class="filter-wraps">
              
              <el-form-item label="订单编号：" v-if="formData.order_sn">
                <span>{{formData.order_sn}}</span>
              </el-form-item>
              
              <el-form-item label="签到状态：" prop="name" class="sign_status">
                    <el-radio-group v-model="formData.sign_type">
                      <el-radio v-for="(config,index) in signTypeConfig" :key="index" :label="config.id">{{config.value}}</el-radio>
                    </el-radio-group>
              </el-form-item>

          </el-form>

          <div class="subBtn">
            <el-button type="success" @click="handleSub">确定</el-button>
          </div>
      </el-dialog>
      <!-- 学生签到 -->
      
  </div>
</template>
<script>
import editorCom from '@/components/editor/editorCom.vue'
import uploadImg from '@/components/uploadImg'
import filterCom from '@/components/filterCom'
import Calendar from '@/components/Calendar'
import TopTab from '@/components/TopTab'
import pagination from '@/mixins/pagination'
import api from '@/utils/api'
import {apiList} from '@/utils/api'
export default {
    name:'stuAttStatistics',
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
        listApi:api.student_sign_statistics,
        tabs:[],
        activeName:-1,
        canModifySign:false,
        filterOptions:[
          {  label:'学期:',filed:'semester_id' , opt:'$like' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
          {  label:'教学组:',filed:'teacher_team_id' , opt:'$eq' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
          {  label:'主讲老师:',filed:'teacher_id' , opt:'$eq' , options:[] , defaultValue:'' , type:'select' , optionUrl:'',remoteUrl:apiList.teacher_search },
          {  label:'课程标题:',filed:'courseName' , opt:'$eq' , options:[] , defaultValue:'' , type:'input' , optionUrl:'' },
          {  label:'课程编号:',filed:'courseSn' , opt:'$eq' , options:[] , defaultValue:'' , type:'input' , optionUrl:'' },
          {  label:'签到状态:',filed:'sign_type' , opt:'$eq' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
          {  label:'校区:',filed:'school' , opt:'$eq' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
          {  label:'教室:',filed:'classRoomId' , opt:'$eq' , options:[] , defaultValue:'' , type:'input' , optionUrl:'' },
          {  label:'学生姓名:',filed:'userName' , opt:'$eq' , options:[] , defaultValue:'' , type:'input' , optionUrl:'' },
          {  label:'签到日期:',filed:'timeRange' , opt:'$eq' , options:[] , defaultValue:'' , type:'dateRange' , optionUrl:'' },
        ],
        teacherConfig:[],
        dialogType:'edit',//edit 修改  add 新增
        pageType:'table',//edit   table
        formData:{
          sign_time:'',
          sign_type:'',
          course_id:'',
          user_id:''
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
        apiList,
        schoolConfig:[],
        semesterConfig:[],
        teacherTeamConfig:[],
        signTypeConfig:[],
        allTotal:0,
      }
    },
    mounted () {
        this.getListLocal();
        this.getOptions();
    },
    watch:{
      activeName (news) {
        this.currPage = 1
        this.setDataFilters(Object.assign(this.dataFilters,{sign_type:news}))
        this.getListLocal();
      }
    },
    computed :{
     
    },
    filters:{
      teacherFilter (arr) {
          let str = '--'
          if (arr&&arr.length>0) {
            str = arr.map(item=>item.teacherName).join(',')
          }
          return str;
      }
    },
    methods:{
        handleDoSearch (filter) {
            this.setDataFilters(filter)
            this.getListLocal()
        },
        handleDelete (id) {
          
          api.teacher_delete({id})
          .then(data=>{
            this.showEdit = false;
            this.getListLocal()
            this.$appmessage({
              type:'success',
              message:data.message||'删除成功'
            })
          })
        },
        getListLocal () {
          this.getList()
          .then((data)=>{
            
            this.setPageMeta(data.data)
          })
        },
        setPageMeta(data) {
            let {allTotal,total,canModifySign} = data;
            //console.log(canModifySign);
            this.canModifySign = canModifySign == 1?true:false
            this.allTotal = allTotal
            this.tabs.forEach(item=>{
              let news = total[item.id]
              news&&(item.value=item.value.replace(/\(\d+\)$/,`(${news.num})`))
            })
        },
        getOptions () {
          api.student_sign_config()
          .then(data=>{ 
            let {schoolMap,semesterMap,signType,teacherTeamMap,signTypeMap} = data.data
            this.filterOptions[0].options = semesterMap
            this.filterOptions[1].options = teacherTeamMap
            this.filterOptions[4].options = signTypeMap
            this.filterOptions[5].options = schoolMap
            this.signTypeConfig = signTypeMap
            let tmpMap = JSON.parse(JSON.stringify(signTypeMap))
            this.tabs = tmpMap.map(item=>{item.value=item.value+'(0)';return item;})
            this.tabs.unshift({id:-1,value:'全部(0)'})
          })
        },  
        handleSub () {
          this.$refs.formData.validate(valid=>{
            if (valid) {
              api.student_sign_statistics_update(this.formData)
              .then(data=>{
                  this.$appmessage({
                    type:'success',
                    message:data.message||'修改成功'
                  })
                  this.getListLocal();
                  this.showEdit = false;
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
                
                this.showEdit = true;
                return
            }
            
            Object.keys(item).forEach(key=>{
              this.$set(this.formData,key,item[key])
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
    .tab-wrapper{
      margin-bottom:20px;
      width: 100%;
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
    .green{
      color:#18de42;
    }
    .yellow{
      color:#ff9c00;
    }
    .red{
      color:#ff4359;
    }
    .black{
      color:#999999;
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
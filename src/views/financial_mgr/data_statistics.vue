<!--
 * @Author: David
 * @Date: 2019-10-31 19:13:06
 * @LastEditTime: 2019-12-05 15:16:54
 * @LastEditors: Do not edit
 * @Description: 数据统计
 -->
 <!-- eslint-disable -->
<template>
  <div class="comment-set-wrap page-wrap">
      <div class="common-set  page-inner">
          <p class="set-header page-header">
              数据统计({{totalCount}}条)
          </p>
          
          <div class="page-table">
              
              <div class="filter-wrap">
                <filterCom
                :filterOptions="filterOptions"
                @dosearch="handleDoSearch"
                type="keyValue"
                >
                  <template slot="anotherbtn">
                      <el-button type="success" @click="handleExport('/api'+apiList.financial_statistic_list)"  v-if="needSecret">
                        导出Excel
                      </el-button>
                  </template>
                </filterCom>
              </div>

              <div class="data-preview">
                  <p>总预交金额： <span>{{totalInfo.total_income_money}}</span>  </p>
                  <p>应退金额： <span>{{totalInfo.total_refund_money}}</span>  </p>
                  <p>实退金额： <span>{{totalInfo.total_real_refund_money}}</span>  </p>
                  <p>差值： <span>{{totalInfo.total_gap_refund_money}}</span>  </p>
                  <p>课耗总收入：<span>{{totalInfo.total_consume_money}}</span></p>
                  <p>未完成课耗总收入：<span>{{totalInfo.total_un_consume_money}}</span></p>
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
                show-overflow-tooltip
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
                prop="courser_sn"
                label="课程编号"
                header-align="center"
                align="center"
                >
                </el-table-column>

                <el-table-column
                prop="name"
                label="课程标题"
                header-align="center"
                align="center"
                >
                </el-table-column>

                <el-table-column
                
                label="课程日期"
                header-align="center"
                align="center"
                >

                  <template slot-scope="scope">

                      <span>{{scope.row.class_start_date}}至{{scope.row.class_end_date}}</span>
                      
                    
                  </template>

                </el-table-column>

                <el-table-column
                label="主讲老师"
                header-align="center"
                align="center"
                >
                <template slot-scope="scope">

                      <span>{{scope.row.teachers[1]?(scope.row.teachers[1].map(item=>item.teacher_name).join(',')):'--'}}</span>
                      
                    
                  </template>
                </el-table-column>


                <el-table-column
                prop="typeName"
                label="课程类别"
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
                prop="selected_num"
                label="学员人数"
                header-align="center"
                align="center"
                >
                </el-table-column>

                <el-table-column
                prop="source_price"
                label="单价"
                header-align="center"
                align="center"
                >
                </el-table-column>

               

                <el-table-column
                prop="total_income_money"
                label="总预交费"
                header-align="center"
                align="center"
                >
                </el-table-column>

                <el-table-column
                prop="total_refund_money"
                label="应退金额"
                header-align="center"
                align="center"
                >
                </el-table-column>

                <el-table-column
                prop="total_real_refund_money"
                label="实退金额"
                header-align="center"
                align="center"
                >
                </el-table-column>


                <el-table-column
                prop="total_gap_refund_money"
                label="差值"
                header-align="center"
                align="center"
                >
                </el-table-column>

                <el-table-column
                prop="total_consume_money"
                label="课耗收入"
                header-align="center"
                align="center"
                >
                </el-table-column>


                <el-table-column
                prop="total_un_consume_money"
                label="未完成课耗收入"
                header-align="center"
                align="center"
                min-width="100px"
                >
                </el-table-column>

                

              </el-table>

              <div class="pagination">
                <el-pagination
                  @current-change="handleCurrentChange_proxy"
                  :current-page.sync="currPage"
                  :page-size="pageSize"
                  layout="prev, pager, next, jumper"
                  :total="totalCount">
                </el-pagination>
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
import TopTab from '@/components/TopTab'
import pagination from '@/mixins/pagination'
import api from '@/utils/api'
import {apiList} from '@/utils/api'
import {mapState,mapMutations} from 'vuex'
export default {
    name:'dataStatistics',
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
        listApi:api.financial_statistic_list,
        activeName:'act1',
        filterOptions:[
          {  label:'学期:',filed:'semester_id' , opt:'$like' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
          {  label:'教学组:',filed:'teacher_team_id' , opt:'$eq' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
          {  label:'主讲老师:',filed:'teacher_id' , opt:'$eq' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' ,remoteUrl:apiList.teacher_search},
          {  label:'课程标题:',filed:'course_name' , opt:'$eq' , options:[] , defaultValue:'' , type:'input' , optionUrl:'' },
          {  label:'课程时间段:',filed:'timeRanges' , opt:'$eq' , options:[] , defaultValue:'' , type:'dateRange' , optionUrl:'' },
         
        ],
        teacherConfig:[],
        dialogType:'edit',//edit 修改  add 新增
        pageType:'table',//edit   table
        formData:{
          
        },
        totalInfo:{

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
        semesterConfig:[],
        teacherTeamConfig:[],
        
      }
    },
    mounted () {
        this.getListLocal();
        this.$mounted = true
        this.getOptions();
    },
    activated() {
      if (this.$mounted) {
        this.$mounted = false
        return
      }
      this.getListLocal();
    },
    computed :{
      ...mapState({
          pathFilter:state=>state.redirect['/financial_mgr/data_statistics']
        })
    },
    methods:{
        ...mapMutations({
          updatePathRedirect:'redirect/updatePathRedirect'
        }),
        getListLocal () {
          let param = Object.assign({},this.dataFilters);
          if (Object.keys(this.pathFilter).length>0) {
            param = Object.assign(param,this.pathFilter)
            if (param.timeRange) {
              param.timeRanges = param.timeRange
              delete param.timeRange
            }
            this.updatePathRedirect({
              path:'/financial_mgr/data_statistics',
              data:{}
            })
          }
          this.getList(param).then(data=>{
            let {totalInfo} = data.data;
            this.$set(this,'totalInfo',totalInfo)
          })
        },
        handleCurrentChange_proxy (page) {
          this.handleCurrentChange(page)
          .then(data=>{
              let {totalInfo} = data.data;
              this.$set(this,'totalInfo',totalInfo)
          })
        },
        
        handleDoSearch (filter) {
            this.setDataFilters(filter)
            this.getListLocal()
        },
       
        getOptions () {
          api.financial_statistic_config()
          .then(data=>{ 
            let {semesterMap,teacherTeamMap} = data.data;
            this.filterOptions[0].options = semesterMap
            this.filterOptions[1].options = teacherTeamMap
          })
        },
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

    .data-preview{
      display: flex;
      margin-bottom:15px;
      p{
        margin-right:34px;
        font-size:16px;
        span{
          color:#fb3131;
          font-size:18px;
        }
      }
    }
</style>
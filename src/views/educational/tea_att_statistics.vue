<!--
 * @Author: David
 * @Date: 2019-10-31 19:13:06
 * @LastEditTime: 2019-12-03 19:02:57
 * @LastEditors: Do not edit
 * @Description: 老师签到统计
 -->
 <!-- eslint-disable -->
<template>
  <div class="comment-set-wrap page-wrap">
      <div class="common-set  page-inner">
          <p class="set-header page-header">
              老师签到统计({{allTotal}})条
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
                      <el-button type="success" @click="handleExport('/api'+apiList.teacher_sign_statistics_list)"  v-if="needSecret">
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
                prop="teacherName"
                label="主讲老师"
                header-align="center"
                align="center"
                >
                </el-table-column>

                <el-table-column
                prop="classHour"
                label="课时数"
                header-align="center"
                align="center"
                >
                </el-table-column>

                <el-table-column
                prop="studentNum"
                label="本次应到人数"
                header-align="center"
                align="center"
                >
                </el-table-column>


                <el-table-column
                label="备注"
                header-align="center"
                align="center"
                >
                  <template slot-scope="scope">
                     <span>{{scope.row.note||'--'}}</span>                     
                  </template>
                </el-table-column>


                <el-table-column
                prop="sign_time"
                label="签到日期"
                header-align="center"
                align="center"
                >
                </el-table-column>
                
                <el-table-column
                prop="operation_time"
                label="操作日期"
                header-align="center"
                align="center"
                >
                </el-table-column>

               

                <el-table-column
                prop="signTypeName"
                label="签到状态"
                header-align="center"
                align="center"
                >

                <template slot-scope="scope">
                  
                    <span :class="[scope.row.sign_type==1?'green':scope.row.sign_type==2?'yellow':'red']">{{scope.row.signTypeName}}</span>
                  
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

      return {
       
        listApi:api.teacher_sign_statistics_list,
        activeName:-1,
        filterOptions:[
          {  label:'学期:',filed:'semester_id' , opt:'$like' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
          {  label:'教学组:',filed:'teacher_team_id' , opt:'$eq' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
          {  label:'主讲老师:',filed:'teacher_id' , opt:'$eq' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' ,remoteUrl:apiList.teacher_search},
          {  label:'课程标题:',filed:'courseName' , opt:'$eq' , options:[] , defaultValue:'' , type:'input' , optionUrl:'' },
          {  label:'课程编号:',filed:'courseSn' , opt:'$eq' , options:[] , defaultValue:'' , type:'input' , optionUrl:'' },
          {  label:'签到日期:',filed:'timeRange' , opt:'$eq' , options:[] , defaultValue:'' , type:'dateRange' , optionUrl:'' },
        ],
        teacherConfig:[],
        apiList,
        signTypeConfig:[],
        allTotal:0,
        tabs:[]
      }
    },
    watch:{
      activeName (news) {
        this.currPage = 1
        this.setDataFilters(Object.assign(this.dataFilters,{sign_type:news}))
        this.getListLocal();
      }
    },
    mounted () {
        
        this.getOptions()
        .then(()=>{
          this.getListLocal()
        })

    },
    computed :{
     
    },
    methods:{
        getListLocal () {
          this.getList()
          .then((data)=>{
            this.setPageMeta(data.data)
          })
        },
        setPageMeta(data) {
            let {allTotal,total} = data;
            this.allTotal = allTotal
            this.tabs.forEach(item=>{
              let news = total[item.id]
              news&&(item.value=item.value.replace(/\(\d+\)$/,`(${news.num})`))
            })
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
          return new Promise((res,rej)=>{
            api.teacher_sign_statistics_config()
            .then(data=>{ 
              //console.log(data);
              let {teacherTeamMap,signTypeMap,semesterMap} = data.data
              this.filterOptions[0].options=semesterMap
              this.filterOptions[1].options=teacherTeamMap
              this.filterOptions[5].options=signTypeMap
              this.signTypeConfig = JSON.parse(JSON.stringify(signTypeMap))
              let tmpMap = JSON.parse(JSON.stringify(signTypeMap))
              this.tabs = tmpMap.map(item=>{item.value=item.value+'(0)';return item;})
              this.tabs.unshift({id:-1,value:'全部(0)'})
              res(data)
            })
            .catch((err)=>{
              rej(err)
            })
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
    .green{
      color:#18de42;
    }
    .yellow{
      color:#ff9c00;
    }
    .red{
      color:#ff4359;
    }
</style>
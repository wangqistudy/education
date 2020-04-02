<!--
 * @Author: David
 * @Date: 2019-10-31 19:13:06
 * @LastEditTime: 2019-12-04 09:45:21
 * @LastEditors: Do not edit
 * @Description: 小区设置
 -->
 <!-- eslint-disable -->
<template>
  <div class="comment-set-wrap page-wrap">
      <div class="common-set  page-inner">
          <p class="set-header page-header">
              总课程表
          </p>
          
          <div class="page-table">


              <div class="filter-wrap">
                <filterCom
                :filterOptions="filterOptions"
                @dosearch="handleDoSearch"
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
                  <span class="blue" @click="hanldeLinkTo(scope.row[value.prop])">{{scope.row[value.prop]?(scope.row[value.prop].course_name||'--'):'--'}}</span>
                </template>
              </el-table-column>
                
              </el-table>

              <div class="pagination">
                <el-pagination
                  @current-change="handleCurrentChange1"
                  :current-page.sync="currPage"
                  :page-size="pageSize"
                  layout="prev, pager, next, jumper"
                  :page-count="totalPage">
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
import pagination from '@/mixins/pagination'
import {getToken} from '@/utils/auth'
import api from '@/utils/api'
import {apiList} from '@/utils/api'
import moment from '@/utils/localMoment'
import {mapState,mapMutations} from 'vuex'
export default {
    name:'allCourse',
    components:{editorCom,uploadImg,filterCom},
    mixins:[pagination],
    data () {

      

      return {
        
        
        listApi:api.course_calendar_list,
        filterOptions:[
          {  label:'校区:',filed:'school_id' , opt:'$like' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
          {  label:'主讲老师:',filed:'teacher' , opt:'$eq' , options:[] , defaultValue:'' , type:'select' , remoteUrl:apiList.teacher_search },
          {  label:'年级:',filed:'grade_id' , opt:'$eq' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
          {  label:'科目:',filed:'subject_id' , opt:'$eq' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
          {  label:'课程日期:',filed:'timeRange' , opt:'$eq' , options:[] , defaultValue:'' , type:'dateRange' },
        ],
        
        apiList,
        tempTime:[],
        localData:{

        }
      }
    },
    mounted () {
        this.getLocalList()
        this.getOptions();
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
    filters:{
      chineseWord (str) {
       return ''
      }
    },
    methods:{
        ...mapMutations({
          updatePathRedirect:'redirect/updatePathRedirect'
        }),
        hanldeLinkTo (row) {
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
        handleDoSearch (filter) {
            this.currPage = 1
            this.setDataFilters(filter)
            this.getLocalList()
        },
        handleCurrentChange1 (page) {
          this.currPage = page
          this.getLocalList()
        },
        getLocalList () {
            this.setDataFilters(Object.assign({},this.dataFilters,{
                page_num:this.pageSize,
                page:this.currPage
            }))
            this.listApi(this.dataFilters)
            .then(data=>{
                let {pagination} = data.data.meta
                this.setPagination(pagination)
                this.$set(this,'localData',data.data.data)
            })
        },
        
        getOptions () {
          api.course_calendar_config()
          .then(data=>{ 
            console.log(data)
            let {schoolMap,gradeMap,subjectMap} = data.data;
            this.filterOptions[0].options = schoolMap
            this.filterOptions[3].options = subjectMap
            this.filterOptions[2].options = gradeMap
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
    .blue{
      color:#0566ce;
      cursor: pointer;
    }
</style>
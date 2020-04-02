<!--
 * @Author: David
 * @Date: 2019-11-05 16:35:51
 * @LastEditTime: 2019-11-25 16:14:49
 * @LastEditors: Do not edit
 * @Description: 课程卡片
 -->
<template>
  <div class="lesson-card-wrap">
      <div class="lesson-card-inner">
          <div class="left-part">
            <div class="lesson-info">

              <div class="lesson-img">
                <img :src="info.thumbnail||require('@/assets/lessoncard_demo.png')" alt="">
              </div>

              <div class="lesson-name">
                <p class="title">
                  <span class="firstPageIcon" v-if="info.is_show_index==1">首</span>
                  <span class="titleIcon">{{info.courser_sn}}</span>
                  <span class="lessonName">{{info.name}}</span>
                  <span class="tabs yellow" v-if="info.typeName">{{info.typeName}}</span>
                  <span class="tabs green" v-if="info.semesterName">{{info.semesterName}}</span>
                  <span class="tabs blue" v-if="info.gradeName">{{info.gradeName}}</span>
                  <span class="tabs pink" v-if="info.subjectName">{{info.subjectName}}</span>
                  <span class="tabs purple" v-if="info.class_hour">{{info.class_hour}}课时</span>
                </p>
                <p class="time">
                  <span>{{info.class_start_date}}至{{info.class_end_date}}</span><span @click="viewCalender" style="cursor:pointer;">点击查看日程安排</span>
                </p>
                <p class="teacher">
                  <span>教学组：{{info.teacherTeamName}}</span>
                  <span>主讲老师：{{getMainTeacher}}</span>
                </p>
                <p class="address">
                  <span>校区：{{info.schoolName}}</span>
                  <span>教室：{{info.classroom_id}}室</span>
                  <span>座位：{{info.seat_row_num}}排{{info.seat_column_num}}列</span>
                </p>
              </div>


            </div>

            <div class="mark">
              <p class="ellipsis">备注：{{info.note}}</p>
              <!-- <p class="ellipsis">详情：该课程过段时间需要下架该课程过段时间需要下架该课程过段时间需要下架该课程过段时间需要下架该课程过段时间需要下架下架该课程过段时间需要下架该课程过段时间需要下架下架该课程过段时间需要</p> -->
            </div>
          </div>
          <div class="right-part" :style="{width:rightWidth+'px'}">
              <div class="detail-info">
                <slot :info="info" name="detail"></slot>
              </div>
              <div class="button-list">
                <slot :info="info" name="button"></slot>
              </div>
          </div>
      </div>
      

      <!-- 修改面板 -->
      <el-dialog :visible.sync="showEdit" width="800px"   :close-on-click-modal="false" :title ="`日程安排`">
          <div class="table-wrapper">
              <el-table
              :data="tableData"
              header-row-class-name="headrow"
              header-cell-class-name="headrowcell"
              >

                  <el-table-column
                  label="序号"
                  header-align="center"
                  align="center"
                  prop="id"
                  >
                    
                  </el-table-column>

                  <el-table-column
                  label="日期"
                  header-align="center"
                  align="center"
                  prop="class_date"
                  >
                    
                  </el-table-column>

                  <el-table-column
                  label="时间"
                  header-align="center"
                  align="center"
                  width="200px"
                  >
                    <template slot-scope="scope">
                        <span>{{(scope.row.class_date+' '+scope.row.class_time_start)|filterSeconds}}至{{(scope.row.class_date+' '+scope.row.class_time_end)|filterSeconds}}</span>
                    </template>
                  </el-table-column>

                  <el-table-column
                  label="星期"
                  header-align="center"
                  align="center"
                  prop="weekName"
                  >
                    
                  </el-table-column>

                  <el-table-column
                  :label="`课时数(${getTotalCourse})`"
                  header-align="center"
                  align="center"
                  prop="hour_num"
                  >
                    
                  </el-table-column>

                  <el-table-column
                  label="主讲老师"
                  header-align="center"
                  align="center"
                  prop="teacherName"
                  >
                    
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
      </el-dialog>
      <!-- 修改面板 -->


  </div>
</template>
<script>
import pagination from '@/mixins/pagination'
import api from '@/utils/api'
import moment from '@/utils/localMoment'
export default {
  name:'lessonCard',
  mixins:[pagination],
  props:{
      info:{
        type:Object,
        default () {
          return {
            
          }
        }
      },
      rightWidth:{
        type:Number,
        default:300
      }
  },
  data () {
    return {
      showEdit:false,
      listApi:api.course_calendar,
      pageSize:10
    }
  },
  filters:{
    filterSeconds (str) {
      // //console.log(str)
      return moment(str).format('HH:mm')
    }
  },
  watch:{
    showEdit (news) {
      if (news) {
        this.setDataFilters({id:this.info.id})
        this.getList()
      }
    }
  },
  mounted() {
    
  },
  computed:{
    getMainTeacher () {
      if (this.info.teachers&&this.info.teachers[1]&&this.info.teachers[1].length>0){
        return this.info.teachers[1].map(item=>item.teacher_name).join(',');
      }
      return ''
    },
    getTotalCourse () {
      return this.info.class_hour
    } 
  },
  methods:{
    viewCalender () {
      this.showEdit = true;
    }
  }
}
</script>
<style lang="scss" scoped>
    .lesson-card-wrap{
      width: 100%;
      border-radius: 5px;
      .lesson-card-inner{
        width: 100%;
        padding:20px 25px 14px 15px;
        background-color:#fff;
        display: flex;
        justify-content: space-between;
        .left-part{
          width: 76%;
          .lesson-info{
            width: 100%;
            display: flex;
            .lesson-img{
              width:200px;
              height: 126px;
              margin-right:18px;
              img{
                width: 100%;
                height: 100%;
              }
            }
            .lesson-name{
              padding-top:4px;
              .title{
                display: flex;
                align-items: center;
                margin-bottom:15px;
                .tabs{
                  margin-right:8px;
                }
                .firstPageIcon{
                    font-size:14px;
                    color:#ff0000;
                    padding:5px 8px;
                    border-radius: 2px;
                    border:1px solid #ff0000;
                    margin-right:5px;
                }
                .titleIcon{
                  font-size:16px;
                  color:#333333;
                  font-weight: 500;
                  margin-right:10px;
                }
                .lessonName{
                  font-size:14px;
                  color:#333333;
                  margin-right:14px;
                }
                .tabs{
                  padding:0 12px;
                  color:#fff;
                  line-height: 26px;
                  border-radius: 5px;
                  &.yellow{
                    background-color:#ff9657;
                  }
                  &.green{
                    background-color:#13c3c2;
                  }
                  &.blue{
                    background-color:#5a9ef2;
                  }
                  &.pink{
                    background-color:#ff7c9b;
                  }
                  &.purple{
                    background-color:#ef74ee;
                  }
                }
              }
              .time{
                font-size:14px;
                margin-bottom:10px;
                span{
                  &:first-child{
                    margin-right: 10px
                  }
                  &:last-child{
                    color:#0566ce;
                  }
                }
              }
              .teacher{
                color:#666666;
                margin-bottom:12px;
                span:first-child{
                  margin-right:26px;
                }
              }

              .address{
                color:#666666;
                span{
                  margin-right:26px;
                  &:last-child{
                    margin-right:0;
                  }
                }
              }
            }
          }
          .mark{
            margin-top:15px;
            color:#999999;
            p{
              margin-bottom:12px;
              &:last-child{
                margin-bottom: 0;
              }
            }
          }
        }
        .right-part{
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .detail-info{
            height:100%;
            height:73px;
          }
          .button-list{
            width: 100%;
            text-align: right;
          }
        }
      }
    }
    .table-wrapper{
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
</style>
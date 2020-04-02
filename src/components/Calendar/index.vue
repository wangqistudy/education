<!--
 * @Author: David
 * @Date: 2019-10-21 16:27:56
 * @LastEditTime: 2019-12-04 16:08:45
 * @LastEditors: Do not edit
 * @Description: 日历插件
 -->
<template>
  <div class="calendar-wrap">
      <div class="calendar-inner">
        <div class="calendar">
            <!-- 日期选择部分 -->
            <div class="select-time">
              <i class="el-icon-arrow-left" @click="getPrevMonth"></i>
              <span>{{currDate|localTime}}</span>
              <i class="el-icon-arrow-right" @click="getNextMonth"></i>
              <span class="headers_right">
                <slot name="headers_right">
                
                </slot>
              </span>
            </div>

            <div class="time-table" id="calentar-time-table">
              <el-table
              :data="tableData"
              header-row-class-name="headrow"
              header-cell-class-name="headrowcell"
              cell-class-name="cellcalss"
              :highlight-current-row="false"
              v-loading="loadingData"
              >
                  <el-table-column
                  prop="Sun"
                  label="周日"
                  header-align="center"
                  align="center"
                  >
                    <template slot-scope="scope">
                        <div class="hasDataCell" v-if="scope.row.Sun.lessons">
                          <div class="hasDataCellInner">
                              <el-popover
                                  placement="top"
                                  width="508"
                                  trigger="hover">
                                  <el-table class="cellTable" :data="scope.row.Sun.lessons">
                                    <el-table-column width="120" property="class_date" label="时间">

                                      <template slot-scope="scope">
                                          <span>{{(scope.row.class_date+' '+scope.row.class_time_start)|filterSeconds}}</span>
                                          至
                                          <span>{{(scope.row.class_date+' '+scope.row.class_time_end)|filterSeconds}}</span>
                                      </template>

                                    </el-table-column>
                                    
                                    <el-table-column width="150" property="schoolName" label="地址"></el-table-column>
                                    <el-table-column width="150" property="course_name" label="课程名称"></el-table-column>
                                    <el-table-column width="60" property="classroom_id" label="教室"></el-table-column>
                                  </el-table>
                                  <div class="hasDataCellInner" slot="reference">
                                      <p class="cellInfo">{{(scope.row.Sun.lessons[0].class_date+' '+scope.row.Sun.lessons[0].class_time_start)|filterSeconds}}-{{(scope.row.Sun.lessons[0].class_date+' '+scope.row.Sun.lessons[0].class_time_end)|filterSeconds}}</p>
                                      <p class="cellInfo">共{{scope.row.Sun.lessons.length}}个课时</p>
                                  </div>
                                </el-popover>
                            </div>
                            <span class="date">
                                {{scope.row.Sun.dateDay}}
                            </span>
                        </div>
                        <span class="pureDay"  v-else>{{scope.row.Sun.dateDay}}</span>
                    </template>
                  </el-table-column>
                  
                  <el-table-column
                  prop="Mon"
                  label="周一"
                  header-align="center"
                  align="center"
                  >
                    <template slot-scope="scope">
                        <div class="hasDataCell" v-if="scope.row.Mon.lessons">
                            <div class="hasDataCellInner">
                                <el-popover
                                  placement="top"
                                  width="508"
                                  trigger="hover">
                                  <el-table class="cellTable" :data="scope.row.Mon.lessons">
                                    <el-table-column width="120" property="class_date" label="时间">

                                      <template slot-scope="scope">
                                          <span>{{(scope.row.class_date+' '+scope.row.class_time_start)|filterSeconds}}</span>
                                          至
                                          <span>{{(scope.row.class_date+' '+scope.row.class_time_end)|filterSeconds}}</span>
                                      </template>

                                    </el-table-column>
                                    <el-table-column width="150" property="schoolName" label="地址"></el-table-column>
                                    <el-table-column width="150" property="course_name" label="课程名称"></el-table-column>
                                    <el-table-column width="60" property="classroom_id" label="教室"></el-table-column>
                                  </el-table>
                                  <div class="hasDataCellInner" slot="reference">
                                      <p class="cellInfo">{{(scope.row.Mon.lessons[0].class_date+' '+scope.row.Mon.lessons[0].class_time_start)|filterSeconds}}-{{(scope.row.Mon.lessons[0].class_date+' '+scope.row.Mon.lessons[0].class_time_end)|filterSeconds}}</p>
                                      <p class="cellInfo">共{{scope.row.Mon.lessons.length}}个课时</p>
                                  </div>
                                </el-popover>
                            </div>
                            <span class="date">
                                {{scope.row.Mon.dateDay}}
                            </span>
                        </div>
                        <span class="pureDay"  v-else>{{scope.row.Mon.dateDay}}</span>
                    </template>
                  </el-table-column>

                  <el-table-column
                  prop="Tue"
                  label="周二"
                  header-align="center"
                  align="center"
                  >
                    <template slot-scope="scope">
                        <div class="hasDataCell" v-if="scope.row.Tue.lessons">
                            <div class="hasDataCellInner">
                                <el-popover
                                  placement="top"
                                  width="508"
                                  trigger="hover">
                                  <el-table class="cellTable" :data="scope.row.Tue.lessons">
                                    <el-table-column width="120" property="class_date" label="时间">

                                      <template slot-scope="scope">
                                          <span>{{(scope.row.class_date+' '+scope.row.class_time_start)|filterSeconds}}</span>
                                          至
                                          <span>{{(scope.row.class_date+' '+scope.row.class_time_end)|filterSeconds}}</span>
                                      </template>

                                    </el-table-column>
                                    
                                    <el-table-column width="150" property="schoolName" label="地址"></el-table-column>
                                    <el-table-column width="150" property="course_name" label="课程名称"></el-table-column>
                                    <el-table-column width="60" property="classroom_id" label="教室"></el-table-column>
                                  </el-table>
                                  <div class="hasDataCellInner" slot="reference">
                                      <p class="cellInfo">{{(scope.row.Tue.lessons[0].class_date+' '+scope.row.Tue.lessons[0].class_time_start)|filterSeconds}}-{{(scope.row.Tue.lessons[0].class_date+' '+scope.row.Tue.lessons[0].class_time_end)|filterSeconds}}</p>
                                      <p class="cellInfo">共{{scope.row.Tue.lessons.length}}个课时</p>
                                  </div>
                                </el-popover>
                            </div>
                            <span class="date">
                                {{scope.row.Tue.dateDay}}
                            </span>
                        </div>
                        <span class="pureDay"  v-else>{{scope.row.Tue.dateDay}}</span>
                    </template>
                  </el-table-column>

                  <el-table-column
                  prop="Wed"
                  label="周三"
                  header-align="center"
                  align="center"
                  >
                    <template slot-scope="scope">
                        <div class="hasDataCell" v-if="scope.row.Wed.lessons">
                            <div class="hasDataCellInner">
                                <el-popover
                                  placement="top"
                                  width="508"
                                  trigger="hover">
                                  <el-table class="cellTable" :data="scope.row.Wed.lessons">
                                    <el-table-column width="120" property="class_date" label="时间">

                                      <template slot-scope="scope">
                                          <span>{{(scope.row.class_date+' '+scope.row.class_time_start)|filterSeconds}}</span>
                                          至
                                          <span>{{(scope.row.class_date+' '+scope.row.class_time_end)|filterSeconds}}</span>
                                      </template>

                                    </el-table-column>
                                    
                                    <el-table-column width="150" property="schoolName" label="地址"></el-table-column>
                                    <el-table-column width="150" property="course_name" label="课程名称"></el-table-column>
                                    <el-table-column width="60" property="classroom_id" label="教室"></el-table-column>
                                  </el-table>
                                  <div class="hasDataCellInner" slot="reference">
                                      <p class="cellInfo">{{(scope.row.Wed.lessons[0].class_date+' '+scope.row.Wed.lessons[0].class_time_start)|filterSeconds}}-{{(scope.row.Wed.lessons[0].class_date+' '+scope.row.Wed.lessons[0].class_time_end)|filterSeconds}}</p>
                                      <p class="cellInfo">共{{scope.row.Wed.lessons.length}}个课时</p>
                                  </div>
                                </el-popover>
                            </div>
                            <span class="date">
                                {{scope.row.Wed.dateDay}}
                            </span>
                        </div>
                        <span class="pureDay"  v-else>{{scope.row.Wed.dateDay}}</span>
                    </template>
                  </el-table-column>

                  <el-table-column
                  prop="Thu"
                  label="周四"
                  header-align="center"
                  align="center"
                  >
                    <template slot-scope="scope">
                        <div class="hasDataCell" v-if="scope.row.Thu.lessons">
                            <div class="hasDataCellInner">
                              <el-popover
                                  placement="top"
                                  width="508"
                                  trigger="hover">
                                  <el-table class="cellTable" :data="scope.row.Thu.lessons">
                                    <el-table-column width="120" property="class_date" label="时间">

                                      <template slot-scope="scope">
                                          <span>{{(scope.row.class_date+' '+scope.row.class_time_start)|filterSeconds}}</span>
                                          至
                                          <span>{{(scope.row.class_date+' '+scope.row.class_time_end)|filterSeconds}}</span>
                                      </template>

                                    </el-table-column>
                                    
                                    <el-table-column width="150" property="schoolName" label="地址"></el-table-column>
                                    <el-table-column width="150" property="course_name" label="课程名称"></el-table-column>
                                    <el-table-column width="60" property="classroom_id" label="教室"></el-table-column>
                                    
                                  </el-table>
                                  <div class="hasDataCellInner" slot="reference">
                                      <p class="cellInfo">{{(scope.row.Thu.lessons[0].class_date+' '+scope.row.Thu.lessons[0].class_time_start)|filterSeconds}}-{{(scope.row.Thu.lessons[0].class_date+' '+scope.row.Thu.lessons[0].class_time_end)|filterSeconds}}</p>
                                      <p class="cellInfo">共{{scope.row.Thu.lessons.length}}个课时</p>
                                  </div>
                                </el-popover>
                            </div>
                            <span class="date">
                                {{scope.row.Thu.dateDay}}
                            </span>
                        </div>
                        <span class="pureDay"  v-else>{{scope.row.Thu.dateDay}}</span>
                    </template>
                  </el-table-column>

                  <el-table-column
                  prop="Fri"
                  label="周五"
                  header-align="center"
                  align="center"
                  >
                     <template slot-scope="scope">
                        <div class="hasDataCell" v-if="scope.row.Fri.lessons">
                            <div class="hasDataCellInner">
                                <el-popover
                                  placement="top"
                                  width="508"
                                  trigger="hover">
                                  <el-table class="cellTable" :data="scope.row.Fri.lessons">
                                    <el-table-column width="120" property="class_date" label="时间">

                                      <template slot-scope="scope">
                                          <span>{{(scope.row.class_date+' '+scope.row.class_time_start)|filterSeconds}}</span>
                                          至
                                          <span>{{(scope.row.class_date+' '+scope.row.class_time_end)|filterSeconds}}</span>
                                      </template>

                                    </el-table-column>
                                    
                                    <el-table-column width="120" property="schoolName" label="地址"></el-table-column>
                                    <el-table-column width="120" property="course_name" label="课程名称"></el-table-column>
                                    <el-table-column width="60" property="classroom_id" label="教室"></el-table-column>
                                    
                                  </el-table>
                                  <div class="hasDataCellInner" slot="reference">
                                      <p class="cellInfo">{{(scope.row.Fri.lessons[0].class_date+' '+scope.row.Fri.lessons[0].class_time_start)|filterSeconds}}-{{(scope.row.Fri.lessons[0].class_date+' '+scope.row.Fri.lessons[0].class_time_end)|filterSeconds}}</p>
                                      <p class="cellInfo">共{{scope.row.Fri.lessons.length}}个课时</p>
                                  </div>
                                </el-popover>
                            </div>
                            <span class="date">
                                {{scope.row.Fri.dateDay}}
                            </span>
                        </div>
                        <span class="pureDay"  v-else>{{scope.row.Fri.dateDay}}</span>
                    </template>
                  </el-table-column>

                  <el-table-column
                  prop="Sat"
                  label="周六"
                  header-align="center"
                  align="center"
                  >
                  
                     <template slot-scope="scope">
                        <div class="hasDataCell" v-if="scope.row.Sat.lessons">
                            
                            <el-popover
                            placement="top"
                            width="508"
                            trigger="hover">
                            <el-table class="cellTable" :data="scope.row.Sat.lessons">
                              <el-table-column width="120" property="class_date" label="时间">

                                      <template slot-scope="scope">
                                          <span>{{(scope.row.class_date+' '+scope.row.class_time_start)|filterSeconds}}</span>
                                          至
                                          <span>{{(scope.row.class_date+' '+scope.row.class_time_end)|filterSeconds}}</span>
                                      </template>

                                    </el-table-column>
                              
                              <el-table-column width="150" property="schoolName" label="地址"></el-table-column>
                              <el-table-column width="150" property="course_name" label="课程名称"></el-table-column>
                                    <el-table-column width="60" property="classroom_id" label="教室"></el-table-column>
                                    
                            </el-table>
                            <div class="hasDataCellInner" slot="reference">
                                <p class="cellInfo">{{(scope.row.Sat.lessons[0].class_date+' '+scope.row.Sat.lessons[0].class_time_start)|filterSeconds}}-{{(scope.row.Sat.lessons[0].class_date+' '+scope.row.Sat.lessons[0].class_time_end)|filterSeconds}}</p>
                                <p class="cellInfo">共{{scope.row.Sat.lessons.length}}个课时</p>
                            </div>
                          </el-popover>
                            <span class="date">
                                {{scope.row.Sat.dateDay}}
                            </span>
                        </div>
                        <span class="pureDay"  v-else>{{scope.row.Sat.dateDay}}</span>
                    </template>
                  </el-table-column>

              </el-table>
            </div>


        </div>
      </div>
  </div>
</template>
<script>
import moment from '@/utils/localMoment'
export default {
  name:'calendar',
  data () {
    return {
      currDate:'',
      loadingData:false,
      tableData:[
        
      ],
      monthDict : {
        '01':31,
        '02':28,
        '03':31,
        '04':30,
        '05':31,
        '06':30,
        '07':31,
        '08':31,
        '09':30,
        '10':31,
        '11':30,
        '12':31
      }
    }
  },
  mounted () {
    let str = moment().format('YYYY-MM');
    this.currDate = str;
  },
  filters :{
    localTime (str) {
      return moment(str).format('YYYY年MM月');
    },
    filterSeconds (str) {
      // //console.log(str)
      return moment(str).format('HH:mm')
    },
  },
  watch:{
    currDate (news) {
      this.loadingData = true;
      this.$emit('changedate',{news,cb:(data)=>{
        this.handleGetedData(data)
      },fcb:()=>{
        this.loadingData = false;
      }})
    }
    
  },
  methods: {
    // 获取前一个月
    getPrevMonth () {
        
        let str = moment(this.currDate).subtract(1,'months').format('YYYY-MM-DD HH:mm:ss')
        
        this.currDate = str;
        
    },

    // 处理数据
    handleGetedData (data) {
        this.getTableCell(this.currDate,data);
        this.loadingData = false;
    },


    // 获取后一个月
    getNextMonth () {
      let str = moment(this.currDate).subtract(-1,'months').format('YYYY-MM-DD HH:mm:ss')
      this.currDate = str;
    },


    // 获取cell元素
    getTableCell (date,data) {
        
        let mStr = moment(date).format('MM')
        let yStr = moment(date).format('YYYY')
        let monthDay = this.monthDict[mStr];
        let arr = []
        if (mStr==2){
          // 判断润年
          if (this.isLeapYear(yStr-0))
          {
            monthDay = 29
          }
        }
        let currIndex = 0;
        
        for (let i=1;i<=monthDay;i++){
        
          // 组装
          let res = yStr + '-' +mStr+'-'+(i>=10?i:`0${i}`) + ' 00:00:00'
          if (i==1){
            arr.push({
              Sun:{},
              Mon:{},
              Tue:{},
              Wed:{},
              Thu:{},
              Fri:{},
              Sat:{}
            })
          }else{
              let day = moment(res).format('d')
              if (day==0){
                arr.push({
                    Sun:{},
                    Mon:{},
                    Tue:{},
                    Wed:{},
                    Thu:{},
                    Fri:{},
                    Sat:{}
                })
                currIndex++;
              }
          }
         
          let dayIndex = moment(res).format('d')
          
          let filed = this.getDayFiled(dayIndex)
          if (data){
             data.forEach(item=>{
               let itemDay = moment(item.date).format('YYYY-MM-DD')
               let currDay = moment(res).format('YYYY-MM-DD')
               if (itemDay == currDay){
                 arr[currIndex][filed].lessons = item.lessons
               }
             })
          }
          
          arr[currIndex][filed]['dateDay'] = i +''
          
        }
        
        this.tableData = arr;
    },
    // 获取字段
    getDayFiled (index) {
      let dayDict = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
      return dayDict[index]
    },
    // 判断润年
    isLeapYear (Year) {
        if (((Year % 4)==0) && ((Year % 100)!=0) || ((Year % 400)==0)) {
          return true
        } else { 
          return false   
        }
    }
    
  },
}
</script>

<style lang="scss" scoped>
  .calendar-wrap{
    width: 100%;
    .calendar-inner{
      width: 100%;
      .calendar{
        width: 100%;
        .select-time{
          margin-bottom:20px;
          .headers_right{
            margin-left:15px;
          }
          span{
            font-size:24px;
            color:#333333;
            margin:0 16px;
          }
          i{
            font-size:24px;
            color:#a2a7a8;
            cursor:pointer;
            &:hover{
              color:#fff;
              background-color:#0566ce;
            }
          }
        }
      }
    }
  }

  .time-table{
    /deep/.headrowcell{
        line-height: 60px;
        font-size:18px;
        color:#666666;
    }
    /deep/.el-table__body-wrapper{
      border-right:1px solid #EBEEF5;
      /deep/.el-table__body tr:hover>td{
        background-color:transparent;
      }
      
      /deep/.el-table__body tr>td:hover{
        background-color:#EBEEF5;
      }
      
    }
    /deep/.cellcalss{
      height:70px;
      border-left:1px solid #EBEEF5;
      padding:0;
      /deep/.cell{
        padding:0;
      }
    }
  }
  .hasDataCell{
    width: 100%;
    height:70px;
    background-color:#f4f9ff;
    position: relative;
    .date{
      position: absolute;
      width: 25px;
      height: 25px;
      text-align: center;
      line-height: 25px;
      border-radius: 100px;
      background-color:#ff6c4a;
      color:#fff;
      font-size:12px;
      top:5px;
      left:5px;
    }
    .hasDataCellInner{
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      cursor: pointer;
      .cellInfo{
        color:#0566ce;
      }
    }
  }
  .pureDay{
    display: block;
    width: 100%;
    height: 70px;
    line-height: 70px;
  }
  .cellTable{
    width: 100%;
    /deep/table{
      width: 100% !important;
    }
  }
</style>

<style lang="scss">
  #calentar-time-table .el-table--enable-row-hover .el-table__body tr:hover > td{
      background-color: rgba(0, 0, 0, 0);
      &:hover{
          background-color:#EBEEF5;
      }
  } 
</style>
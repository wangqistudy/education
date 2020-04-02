<!--
 * @Author: David
 * @Date: 2019-10-22 14:32:46
 * @LastEditTime: 2019-11-19 16:21:02
 * @LastEditors: Do not edit
 * @Description: 选择座位页面
 -->
<template>
  <div class="seat-wrap">
      <div class="seat-content">
          <div class="seat-list">
             <div class="choose-seat">
                <!-- 讲台位置 -->
                <div class="platform">
                  <div class="dest-item plat">
                      讲台
                  </div>
                </div>

                <!-- 课桌列表 -->
                <div class="dest-list" v-if="chooseType==1">
                    <div class="dest-line" v-for="(line,index) in destList" :key="index">
                        <div class="dest-item" v-for="(dest,index2) in line" :key="index2" :title="getTitle(index,index2)" 
                        :class="[dest.is_choosed==1?'able':dest.is_choosed==0?'disable':'disable']"
                        >
                          <span v-if="(selectIndex[0]===index&&selectIndex[1]===index2)">
                              {{getTitle(index,index2)}}
                          </span>
                          <span v-else>
                            {{dest.is_choosed==0?'未选择':dest.is_choosed==1?dest.userName:'未知'}}
                          </span>
                            
                        </div>
                    </div>
                    
                </div>


                <div class="dest-list" v-else>
                    <div class="dest-line" v-for="(line,index) in destList" :key="index">
                        <div class="dest-item" v-for="(dest,index2) in line" :key="index2" :title="getTitle(index,index2)" 
                        :class="[dest.is_choosed==0?'able':dest.is_choosed==1?'disable':'disable',(selectIndex[0]===index&&selectIndex[1]===index2)?'act':'']"
                        @click="handleSelectSeat(dest,index,index2)"
                        >
                          <span v-if="(selectIndex[0]===index&&selectIndex[1]===index2)">
                              {{getTitle(index,index2)}}
                          </span>
                          <span v-else>
                            {{dest.is_choosed==0?'可选':dest.is_choosed==1?'不可选':'未知'}}
                          </span>
                            
                        </div>
                    </div>

                    <!-- <div class="more-btn-wrap">
                      <blueBtn
                      lable="确定"
                      @click="handleSelectClick"
                      >

                      </blueBtn>
                    </div> -->
                    
                </div>

            </div>
          </div>

      </div>
  </div>
</template>
<script>
import api from '@/utils/api'
import {apiList} from '@/utils/api'
export default {
  name:'waitPay',
  props:{
    info:{
      type:Object,
      default () {
        return {}
      }
    },
    chooseType:{
      type:Number,
      default () {
        return 1; //1  只看  2 选择
      }
    },
    seatApi:{
      type:String,
      default () {
        return  'course_seats'
      }
    }
  },
  data () {
    return {
      activeName:'chooseSeat',
      selectIndex:[],
      destList:[
       
      ]
    }
  },
  watch:{
    info (news) {
        this.getSeatList();
    }
  },
  mounted () {
    this.getSeatList()
  },
  methods: {
    handleClick () {

    },
    
    getSeatList () {
      let course_id = this.info.course_id||this.info.id
      api[this.seatApi]({course_id})
      .then(data=>{
          this.destList = data.data
      })
    },
    getTitle (row,col) {
        return (row+1)+' 排 '+(col+1)+' 列'
    },
    handleSelectSeat (dest,row,col) {
        if (dest.is_choosed!=0){
          return;
        }
        this.selectIndex = [row,col]
        this.$emit('choosedseat',dest.seat_no)
    }
  },
  
}
</script>
<style lang="scss" scoped>

  .seat-wrap{
    width: 100%; 
    .seat-content{
      width:100%;
      .seat-head{
        width:100%;
        // padding:30px 23px 24px 40px;
        // background-color:#fff;
        display:flex;
        align-items: center;
        .left-side{
          display: flex;
          
          .order-desc{
            margin-left:32px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding:5px 0;
            .desc-title{
              font-size:16px;
              color:#333333;
              font-weight:500;
            }
            .desc-mention{
              font-size:14px;
              color:#ff6c4a;
            }
          }
        }
        .right-side{
          display:flex;
          align-items: center;
          .price-label{
            font-size: 14px;
            color:#666666;
          }
          .price{
            display:flex;
            align-items: flex-end;
            color:#ff3b50;
            span:first-child{
              font-size: 16px;
            }
            span:last-child{
              font-size:23px;
            }
          }
        }
      }

      .seat-list{
        width:100%;
        margin-top:20px;
        padding:15px 20px 40px;
        background-color:#fff;
        .el-tabs{
          /deep/.el-tabs__nav-wrap{
            padding-left:20px;
          }
          /deep/.el-tabs__item{
            font-size:18px;
          }
        }
        .choose-seat{
          width:100%;
          // min-height: 442px;
        }
      }
    }
  }


  .dest-item{
    width: 120px;
    height:40px;
    font-size:16px;
    color:#0566ce;
    text-align: center;
    line-height: 40px;
    border:1px solid #0566ce;
    margin-left:30px;
    &.plat{
      border:1px solid #666;
      color: #666;
      margin:0 auto;
      margin-bottom:20px;
    }
  }

  .dest-line{
    overflow: hidden;
    margin-bottom:27px;
    display: flex;
    justify-content: center;
    .dest-item{
        &:first-child{
          margin-left:0px;
        }
        &.able{
          cursor: pointer;
          &.act{
            background-color:#0566ce;
            color:#fff;
          }
        }
        &.disable{
          background-color:#d2d2d2;
          border-color:#d2d2d2;
          color:#fff;
          cursor: not-allowed;
        }

    }
  }

   .more-btn-wrap{
      padding-top:20px;
      display: flex;
      justify-content: center;
    }

</style>
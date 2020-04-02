<!--
 * @Author: David
 * @Date: 2019-10-31 10:49:34
 * @LastEditTime: 2019-11-27 10:34:39
 * @LastEditors: Do not edit
 * @Description: 
 -->
<template>
  <div class="dashboard-editor-container">

    <div class="card-list">
        <div class="card-wrap">
            <dsCard
              icon="icon-yonghu1"
              link="/usr_mgr/index"
              :title="info.todayUserNum"
              desc="今日新增用户数"
              bg1="#edf2fe"
              bg2="#4c84ff"
            >
                
            </dsCard>
        </div>

        <div class="card-wrap">
            <dsCard
              icon="icon-kecheng4"
              link="/course_setting/on_shelves"
              :title="info.todayCourseNum"
              desc="今日新增课程数"
              bg1="#edf2fe"
              bg2="#ffaf29"
            >
                
            </dsCard>
        </div>

        <div class="card-wrap">
            <dsCard
              icon="icon-dd"
              link="/financial_mgr/order_mgr"
              :title="info.todayOrderNum"
              desc="今日新增订单数"
              bg1="#edf2fe"
              bg2="#13c3c2"
            >
                
            </dsCard>
        </div>

        <div class="card-wrap">
            <dsCard
              icon="icon-ZHicon-"
              link="/financial_mgr/order_mgr"
              :title="info.todayOrderMoney"
              desc="今日新增订单金额"
              bg1="#edf2fe"
              bg2="#ff687b"
            >
                
            </dsCard>
        </div>
        <div class="card-wrap">
            <dsCard
              icon="icon-yonghu1"
              link="/usr_mgr/index"
              :title="info.userTotalNum"
              desc="总用户数"
              bg1="#edf2fe"
              bg2="#4c84ff"
            >
                
            </dsCard>
        </div>

        <div class="card-wrap">
            <dsCard
              icon="icon-kecheng4"
              link="/course_setting/on_shelves"
              :title="info.courseTotalNum"
              desc="总课程数"
              bg1="#edf2fe"
              bg2="#ffaf29"
            >
                
            </dsCard>
        </div>

        <div class="card-wrap">
            <dsCard
              icon="icon-dd"
              link="/financial_mgr/order_mgr"
              :title="info.totalOrderNum"
              desc="总订单数"
              bg1="#edf2fe"
              bg2="#13c3c2"
            >
                
            </dsCard>
        </div>

        <div class="card-wrap">
            <dsCard
              icon="icon-ZHicon-"
              link="/financial_mgr/data_statistics"
              :title="info.totalOrderMoney"
              desc="总订单金额"
              bg1="#edf2fe"
              bg2="#ff687b"
            >
                
            </dsCard>
        </div>

    </div>
      
  </div>
</template>

<script>
import dsCard from './components/dsCard'
import api from '@/utils/api'
export default {
  name: 'DashboardAdmin',
  components: {
   dsCard
  },
  data() {
    return {
      info:{
        
      }
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      api.screen_index()
      .then(data=>{
          data = data.data;
          Object.keys(data).forEach(key=>{
            this.$set(this.info,key,data[key])
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
.card-list{
  width: 100%;
  overflow: hidden;
  .card-wrap{
    max-width: 386px;
    min-width:306px;
    width:23%;
    float: left;
    margin-right: 1.8%;
    margin-bottom:30px;
  }
}
</style>

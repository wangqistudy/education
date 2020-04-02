<!--
 * @Author: David
 * @Date: 2019-10-31 19:13:06
 * @LastEditTime: 2019-12-05 15:50:55
 * @LastEditors: Do not edit
 * @Description: 订单管理
 -->
 <!-- eslint-disable -->
<template>
  <div class="comment-set-wrap page-wrap">
    
      <div class="common-set  page-inner" v-if="!showEdit">
          <p class="set-header page-header">
              订单管理(共{{allTotal}}条)
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
                      <el-button type="success" @click="handleExport('/api'+apiList.order_list)"  v-if="needSecret">
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
                prop="created_at"
                label="创建时间"
                header-align="center"
                align="center"
                :key="Math.random()"
                
                >
                </el-table-column>
                
                <el-table-column
                label="订单编号"
                header-align="center"
                align="center"
                prop="order_sn"
                :key="Math.random()"
                
                >
                 
                </el-table-column>

                <el-table-column
                label="课程编号"
                header-align="center"
                align="center"
                prop="courserSn"
                :key="Math.random()"
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
                prop="final_price"
                label="座位"
                header-align="center"
                align="center"
                v-if="activeName==3"
                :key="Math.random()"
                >

                    <template slot-scope="scope">
                      <span v-if="scope.row.seatRow&&scope.row.seatColumn">第{{scope.row.seatRow}}排,第{{scope.row.seatColumn}}列</span>
                      <span v-else>--</span>
                  </template>

                </el-table-column>

                <el-table-column
                prop="final_price"
                label="付款金额"
                header-align="center"
                align="center"
                v-if="activeName==3||activeName==5"
                :key="Math.random()"
                >
                </el-table-column>

                <el-table-column
                prop="source_price"
                label="原价"
                header-align="center"
                align="center"
                v-if="activeName==3||activeName==5"
                :key="Math.random()"
                >
                </el-table-column>

                <el-table-column
                prop="refund_money"
                label="实退金额"
                header-align="center"
                align="center"
                v-if="activeName==5"
                :key="Math.random()"
                >
                </el-table-column>

                <el-table-column
                prop="theory_refund_money"
                label="应退金额"
                header-align="center"
                align="center"
                v-if="activeName==5"
                :key="Math.random()"
                >
                </el-table-column>

                <el-table-column
                prop="gapRefundMoney"
                label="差值"
                header-align="center"
                align="center"
                v-if="activeName==5"
                :key="Math.random()"
                >
                </el-table-column>

                <el-table-column
                prop="payTypeName"
                label="付款方式"
                header-align="center"
                align="center"
                v-if="activeName==3"
                :key="Math.random()"
                >

                    <template slot-scope="scope">
                        <span :class="[scope.row.pay_type==1?'blue':scope.row.pay_type==2?'green':scope.row.pay_type==3?'':'']"> {{scope.row.payTypeName}}</span>
                    </template>


                </el-table-column>

                <el-table-column
                prop="final_price"
                label="待付金额"
                header-align="center"
                align="center"
                v-if="activeName==1"
                :key="Math.random()"
                >
                </el-table-column>


                

                <el-table-column
                prop="userName"
                label="姓名"
                header-align="center"
                align="center"
                :key="Math.random()"
                >
                </el-table-column>

                <el-table-column
                prop="userMobile"
                label="手机号"
                header-align="center"
                align="center"
                :key="Math.random()"
                >
                </el-table-column>


                <el-table-column
                label="订单状态"
                header-align="center"
                align="center"
                :key="Math.random()"
                >
                  <template slot-scope="scope">
                      <span>{{getOrderStarusName(scope.row)}}</span>
                  </template>
                </el-table-column>


                 <el-table-column
                label="备注"
                header-align="center"
                align="center"
                v-if="activeName==3||activeName==5"
                :key="Math.random()"
                >
                  <template slot-scope="scope">
                    <span class="remark" v-if="scope.row.dealManagerName" @click="handleShowCrash(scope.row)">备注:经办人{{scope.row.dealManagerName||'--'}}</span>
                    <span v-else >{{'--'}}</span>
                  </template>
                </el-table-column>


                <el-table-column
                prop="refund_time"
                label="退款时间"
                header-align="center"
                align="center"
                v-if="activeName==5"
                :key="Math.random()"
                >
                </el-table-column>



                <el-table-column
                label="操作"
                header-align="center"
                align="center"
                min-width="100px"
                v-if="(activeName==1||activeName==3)&&hasEditPermission"
                :key="Math.random()"
                >

                  <template slot-scope="scope">
                      <el-button size="mini" type="primary" v-if="activeName==1"  @click="handlePay(scope.row)"> 
                        去支付
                      </el-button>

                      <el-button size="mini" type="primary" @click="handleRefund(scope.row)" v-if="activeName==3">
                        退款
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

      <div class="page-inner video-set" v-else>
          <p class="set-header page-header">
              订单付款
          </p>
          <div class="page-content">
            <div class="page-table">
                <el-form :model="formData" ref="formData" :rules="formRule" label-width="120px">
                  <div class="inline">
                      <el-form-item label="课程编号:">
                        <div class="item-inner">
                          <span>{{formData.courserSn}}</span> 
                        </div>
                          
                      </el-form-item>  

                       <el-form-item label="课程标题:">
                          <div class="item-inner">
                            <span>{{formData.courseName}}</span> 
                          </div>
                      </el-form-item>  
                  </div>

                  <div class="inline">
                      <el-form-item label="学生姓名:">
                        <div class="item-inner">
                          <span>{{formData.userName}}</span> 
                        </div>
                      </el-form-item>  

                       <el-form-item label="手机号:">
                          <div class="item-inner">
                            <span>{{formData.userMobile}}</span> 
                          </div>
                      </el-form-item>  
                  </div>

                  <div class="inline">
                      <el-form-item label="支付方式:" prop="pay_type">
                        <div class="item-inner">
                          <el-select v-model="formData.pay_type">
                            <el-option v-for="(types,index) in payTypeConfig" :key="index" :label="types.value" :value="types.id"> 
                              
                            </el-option>
                          </el-select>
                        </div>
                      </el-form-item>  

                       <!-- <el-form-item label="经办人姓名:">
                        <div class="item-inner">
                          <el-input></el-input>
                        </div>
                      </el-form-item>   -->
                      <el-form-item label="收据单号:" prop="receipt_no">
                        <div class="item-inner">
                          <el-input v-model="formData.receipt_no"></el-input>
                        </div>
                      </el-form-item>
                  </div>
                  

                  <el-form-item label="现金凭证：" prop="credentials">
                      <uploadImg
                        v-model="imgList"
                        desc=""
                        :actionUrl="`/api`+apiList.financial_upload"
                        :files="imgList"
                      >
                      </uploadImg>
                  </el-form-item>

                  <el-form-item label="选择座位：" prop="seat_no">
                        
                  </el-form-item>
                  <SeatList :info="formData" :chooseType="2" :seatApi="`financial_course_seats`"
                  @choosedseat="handleChooseSeat"
                  >

                  </SeatList>

                  


                  
                </el-form>
                <div class="subBtn-list">
                    <el-button type="success" @click="handleSub">
                      确定
                    </el-button>
                    <el-button type="info" @click="showEdit=false">
                      取消
                    </el-button>
                </div>
            </div>
          </div>
          
      </div>


       <!-- 查看备注 -->
      <el-dialog :visible.sync="showCrash" width="526px"  :close-on-click-modal="false" :title ="`查看备注`">

          <el-form :model="crashInfo" label-width="100px" class="filter-wraps">
              <el-form-item label="经办人：" prop="name">
                    <span>{{crashInfo.dealManagerName}}</span>
              </el-form-item>
              
              <el-form-item label="收据单号：" prop="name">
                   <span>{{crashInfo.receipt_no}}</span>
              </el-form-item>


              <el-form-item label="现金凭证：" prop="credentials">
                   <img :src="crashInfo.credentials" class="carsh_page" alt="" style="cursor:pointer" @click="handlePictureCardPreview(crashInfo)">
              </el-form-item>

          </el-form>
      </el-dialog>
      <!-- 查看备注 -->


      <!-- 退款 -->
      <el-dialog :visible.sync="showRefund" width="526px"  :close-on-click-modal="false" :title ="`退款`">

         

          <el-form :model="refundInfo" label-width="120px" :rules="refundRule" ref="refundInfo" class="filter-wraps">
              <div class="inline">
              
                <el-form-item label="原价退款金额：" style="margin-right:20px">
                    {{refundInfo.originRefundMoney}}元
                </el-form-item>

                <el-form-item label="优惠退款金额：">
                    {{refundInfo.discountRefundMoney}}元
                </el-form-item>

              </div>
              <el-form-item label="退款金额：" prop="refund_money">
                    <el-input v-model="refundInfo.refund_money" style="max-width:200px"></el-input> 元
              </el-form-item>
          </el-form>
          <p class="refundTips">退款请走线下流程，线上仅修改状态</p>
          <p class="refundDetials">
              是否确认为学员  <span> {{refundInfo.userName}}（{{refundInfo.userMobile}}） </span>办理退款，退款的同时将取消之前选择的座位号。
          </p>

          <div class="btnWrap" style="text-align:center;margin-top:15px;">
              <el-button type="success" @click="handleRefundSub">确认</el-button>
              <el-button type="info" @click="showRefund=false">取消</el-button>
          </div>
      </el-dialog>
      <!-- 退款 -->

      
      
  </div>
</template>
<script>
import editorCom from '@/components/editor/editorCom.vue'
import uploadImg from '@/components/uploadImg'
import filterCom from '@/components/filterCom'
import SeatList from '@/components/SeatList'
import Calendar from '@/components/Calendar'
import TopTab from '@/components/TopTab'
import pagination from '@/mixins/pagination'
import api from '@/utils/api'
import {apiList} from '@/utils/api'
import {mapState,mapMutations} from 'vuex'
export default {
    name:'orderMgr',
    components:{editorCom,uploadImg,filterCom,Calendar,TopTab,SeatList},
    mixins:[pagination],
    data () {

      let validateEmpty = (rule,value,cb)=>{
        if (!value) {
            return cb(new Error('请填写信息'))
          }
          cb()
      }

      let  validateSeatNo = (rule,value,cb)=>{
          if (!value) {
            return cb(new Error('选择座位'))
          }
          cb()
      }

      return {
        imgList:[],
        videoList:[],
        listApi:api.order_list,
        tabs:[],
        activeName:0,
        allTotal:0,
        showCrash:false,
        showRefund:false,
        filterOptions:[
          {  label:'姓名:',filed:'userName' , opt:'$like' , options:[] , defaultValue:'' , type:'input' , optionUrl:'' },
          {  label:'订单编号:',filed:'order_sn' , opt:'$like' , options:[] , defaultValue:'' , type:'input' , optionUrl:'' },
          {  label:'课程编号:',filed:'courseSn' , opt:'$eq' , options:[] , defaultValue:'' , type:'input' , optionUrl:'' },
          {  label:'课程标题:',filed:'courseName' , opt:'$eq' , options:[] , defaultValue:'' , type:'input' , optionUrl:'' },
          {  label:'手机号:',filed:'userMobile' , opt:'$eq' , options:[] , defaultValue:'' , type:'input' , optionUrl:'' },
          {  label:'创建时间段:',filed:'timeRange' , opt:'$eq' , options:[] , defaultValue:'' , type:'dateRange' , optionUrl:'' }
        ],
        teacherConfig:[],
        dialogType:'edit',//edit 修改  add 新增
        pageType:'table',//edit   table
        formData:{
          
        },
        formRule:{
          pay_type:[
            {validator:validateEmpty}
          ],
          receipt_no:[
            {validator:validateEmpty}
          ],
          credentials:[
            {validator:validateEmpty}
          ]
        },
        refundRule:{
          refund_money:[
            {validator:validateEmpty}
          ]
        },
        showEdit:false,
        apiList,
        payTypeConfig:[],
        subjectConfig:[],
        typeConfig:[],
        statusConfig:[],
        crashInfo:{
          
        },
        refundInfo:{
          
        }
      }
    },
    mounted () {
      
    },
    beforeRouteEnter (to,from,next){
      next(vm=>{
          if (!vm.activeName){
            vm.getOptions();
          }else{
            if (vm.$route.query.collect_user) {
              if (vm.activeName==3) {
                vm.getSearchList({user_id:vm.$route.query.collect_user})
                return
              }
              vm.activeName = 3
            }

            if (vm.pathFilter.timeRange) {
              if (vm.activeName==3) {
                let param = Object.assign({},vm.dataFilters,vm.pathFilter)
                vm.clearPathFilter()
                vm.getSearchList(param)
                return
              }
              vm.activeName = 3
            }
            
          }
          
      })
    },
    activated () {
      
    },
    computed :{
      ...mapState({
          pathFilter:state=>state.redirect['/financial_mgr/order_mgr']
        })
    },
    watch:{
      activeName (news) {
        this.currPage = 1
        this.setDataFilters(Object.assign(this.dataFilters,{status:news}))
        if (this.$route.query.collect_user) {
          this.getSearchList({user_id:this.$route.query.collect_user})
        }else if (this.pathFilter.timeRange){
          let param = Object.assign({},this.dataFilters,this.pathFilter)
          this.clearPathFilter()
          this.getSearchList(param);
        }else{
          this.getListLocal()
        }
      }
    },
    methods:{
      clearPathFilter () {
         this.updatePathRedirect({
              path:'/financial_mgr/order_mgr',
              data:{}
            })
      },
      ...mapMutations({
          updatePathRedirect:'redirect/updatePathRedirect'
        }),
        getSearchList (param) {
          if (param) {
            this.$nextTick(()=>{
              this.setDataFilters(Object.assign({},this.dataFilters,{...param,status:3}));
              this.getListLocal();
              this.$router.replace('/financial_mgr/order_mgr')
            })
            
          }
        },
        handleShowCrash (info) {
            this.crashInfo = {
              
            }
            Object.keys(info).forEach(key=>{
              this.$set(this.crashInfo,key,info[key])
            })
            this.showCrash = true;
        },
        handleChooseSeat (seat_no) {
            //console.log(seat_no)
            this.formData.seat_no = seat_no
        },
        handleRefund (info) {
          Object.keys(info).forEach(key=>{
            this.$set(this.refundInfo,key,info[key])
          })
          api.order_refund_info(Object.assign({},this.refundInfo,{id:info.id}))
          .then(data=>{
            Object.keys(data.data).forEach(key=>{
              this.$set(this.refundInfo,key,data.data[key])
            })
            this.showRefund = true;
          })
          
        },
        
        handleRefundSub () {
            this.$refs.refundInfo.validate(valid=>{
              if (valid) {
                api.financial_refund_order(Object.assign({},this.refundInfo,{order_id:this.refundInfo.id}))
                .then(data=>{
                    this.showRefund = false;
                    this.$appmessage({
                      type:'success',
                      message:data.message||'退款成功'
                    })
                    this.getListLocal();
                })
              }
            })
        },
        handlePay (info) {
            this.$set(this,'formData',{})
            Object.keys(info).forEach(key=>{
              if (key=='pay_type'){
                  if (!info[key]) {
                    let defaultSelID = this.getDefaultPayId(this.payTypeConfig)
                    this.$set(this.formData,key,defaultSelID)
                  }else{
                    this.$set(this.formData,key,info[key])    
                  }
              }else{
                this.$set(this.formData,key,info[key])
              }
              
            })
            this.imgList = []
            this.showEdit = true;
        },
        getOrderStarusName (row) {
          
          let str= '--'
          if (this.statusConfig.length>0) {
            let arr = this.statusConfig.filter(item=>item.id==row.status)
            str = arr[0]?arr[0].value:'--'
          }
          return str;
        },
        handleCurrentChange1 (page) {
          this.currPage = page;
          this.getListLocal();
        },
        getListLocal () {
          this.getList()
          .then((data)=>{
            this.setPageMeta(data.data)
            // this.setDataFilters(Object.assign({},this.dataFilters,{user_id:undefined,status:3}));
            if (this.dataFilters.user_id) {
              this.dataFilters.user_id = undefined
            }
          })
        },
        setPageMeta(data) {
            let {allTotal,total} = data;
            this.allTotal = allTotal
            this.tabs.forEach(item=>{
              let news = total[item.id]
              
              news>=0&&(item.value=item.value.replace(/\(\d+\)$/,`(${news})`))
            })
        },
        
        handleDoSearch (filter) {
            this.setDataFilters(Object.assign({},filter,{status:this.activeName}))
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
        getOptions () {
          api.order_list_config()
          .then(data=>{ 
            let  {payTypeMap,statusMap} = data.data
            this.payTypeConfig = payTypeMap
            this.statusConfig = statusMap
            let tmpMap = JSON.parse(JSON.stringify(statusMap))
            this.tabs = tmpMap.map(item=>{item.value=item.value+'(0)';return item;})
            if (this.$route.query.collect_user||this.pathFilter.timeRange) {
                this.activeName = 3
            }else{
                this.activeName = tmpMap[0].id
            }
          })
        },
        getDefaultPayId (payTypeMap,str='现金') {
            let id;
            payTypeMap.forEach(item=>{
              if (item.value==str) {
                id = item.id
              }
            })
            return id;
        } ,   
        handleSub () {
          let credentials = this.imgList[0]?this.imgList[0].url:''
          this.formData.credentials = credentials
          this.$refs.formData.validate(valid=>{
            if (valid) {
                let param = JSON.parse(JSON.stringify(this.formData))
                param.credentials = credentials;
                api.financial_hand_pay(param)
                .then(data=>{
                  this.showEdit = false;
                  this.getListLocal()
                  this.$appmessage({
                    type:'success',
                    message:data.message||'保存成功'
                  })
                })
            }
          })
        },
        handlePictureCardPreview(file) {
            this.openPreview({src:file.credentials})
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
            
            Object.keys(item).forEach(key=>{
              this.$set(this.formData,key,item[key])
              if (key=='thumbnail') {
                  if (item[key]){
                    this.imgList = [{url:item[key]}]
                  }else{
                    this.imgList = []
                  }
                  
              }
              if (key=='url') {
                 if (item[key]){
                    this.videoList = [{url:item[key]}]
                  }else{
                    this.videoList = []
                  }
              }
              if (key=='teacher_id') {
                this.teacherConfig = [{id:item[key],value:item['teacherName']}]
              }
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
    .item-inner{
      width:300px;
    }
    .carsh_page{
      max-width:100%;
      height: auto;
    }
    .refundTips{
      font-size: 16px;
      color:#666666;
      margin-bottom:18px;
      text-align: center;
    }
    .refundDetials{
      font-size:16px;
      color:#444444;
      line-height: 26px;
      span{
        color:#fb8e2d;
      }
    }
    .remark{
      color:#0566ce;
      cursor: pointer;
    }
    .blue{
      color:#0566ce;
    }
    .green{
      color:#1b7a27;
    }
</style>
<!--
 * @Author: David
 * @Date: 2019-11-01 14:50:38
 * @LastEditTime: 2019-11-26 16:38:58
 * @LastEditors: Do not edit
 * @Description: 筛选组件
 -->
<template>
  <div class="filter-form-wrap">
      <el-form :inline="true" :model="filterForm" ref="filterForm" size="mini">
          <el-form-item v-if="isShowPre" ref="firstPre">
            <slot name="prebtn">
              
            </slot>
          </el-form-item>
          <el-form-item v-for="(item,index) in filterOptions" :key="index" :prop="item.filed">
              <el-input v-if="item.type=='input'" v-model="filterForm[item.filed]" :placeholder="item.label.slice(0,-1)">
                  
              </el-input>

              <el-select v-if="item.type=='select'" :placeholder="'选择'+item.label.slice(0,-1)"  v-model="filterForm[item.filed]" filterable :remote="!!item.remoteUrl" :remote-method="(query)=>remoteMethod(item,query)">
                  <el-option v-for="(option,index) in item.options" :key="index" :label="option.value" :value="option.id">
                    
                  </el-option>
              </el-select>

              <el-date-picker
                v-if="item.type=='date'"
                v-model="filterForm[item.filed]"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>

             <el-date-picker
              v-if="item.type=='dateTime'"
              v-model="filterForm[item.filed]"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>

            <el-date-picker
              v-model="filterForm[item.filed]"
              v-if="item.type=='dateRange'||item.type=='dateTimeRange'"
              :type="item.type=='dateRange'?'daterange':'datetimerange'"
              :format="item.type=='dateRange'?'yyyy-MM-dd':'yyyy-MM-dd HH:mm'"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
              
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" class="search-btn" @click="doSearch">
              搜索
            </el-button>

            <el-button icon="el-icon-refresh" type="info" class="reset-btn" @click="doReset">
              重置
            </el-button>
            <slot name="anotherbtn">
              
            </slot>
          </el-form-item>
      </el-form>
  </div>
</template>
<script>
import {post} from '@/utils/fetch'
export default {
  name:'filterForm',
  props:{
    filterOptions:{
      type:Array,
      default () {
        // {  label:'',filed:'' , opt:'' , options:[] , defaultValue:'' , type:'input/select/date/dateTime/dateRange/dateTimeRange' , optionUrl:'' }
        return []  
      }
    },
    type:{
      type:String,
      default:'filterStr' //filterStr:filter字符串  keyValue:json
    }
  },
  data () {
    return {
      filterForm:{
        
      },
      isShowPre:true
    }
  },
  computed:{
    
  },
  mounted() {
    this.setLocalFormAndOptions()
    this.$nextTick(()=>{
      this.isShowPreMethod()
    })
  },
  watch:{
    filterOptions:{
      handler (news) {
       this.setLocalFormAndOptions()
      },
      deep:true
    }
  },
  methods:{
    setDefaultValue (filed,param) {
      this.$set(this.filterForm,filed,param)
    },
    isShowPreMethod () {
      
      try {
        this.$nextTick(()=>{
          if (this.$refs.firstPre.$slots.default) {
            this.isShowPre = true
            
          }else{
            this.isShowPre = false
          }
        })
      }catch(e) {
        
      }
      
    },
    getOptions (item,url) {
        post(url)
        .then(data=>{
            item.options = data.data
        })
    },
    setLocalFormAndOptions () {
        this.filterOptions.forEach(item=>{
          if (item.type=='select'&&item.optionUrl){
            this.getOptions(item,item.optionUrl)
          }
          this.$set(this.filterForm,item.filed,item.defaultValue)
        })
    },
    remoteMethod (item,query) {
      if (!item.remoteUrl) {
        return;
      } 
      post(item.remoteUrl,{query})
      .then(data=>{
          item.options = data.data
      })
    },
    doSearch () {
       let searchStr = this.generateSearchStr()
       this.$emit('dosearch',searchStr);
    },
    doReset () {
        this.$refs.filterForm.resetFields()
        let searchStr = this.generateSearchStr()
        this.$emit('dosearch',searchStr,'reset');
    },
    generateSearchStr () {
      if (this.type=='keyValue'){
        let filter = JSON.parse(JSON.stringify(this.filterForm))
        return filter;
      }
      let searchObj = {}
      this.filterOptions.forEach((item)=>{
          if (item.type=='dateRange'||item.type=='dateTimeRange') {
              if (this.filterForm[item.filed]&&this.filterForm[item.filed].length>0){
                this.filterForm[item.filed] = this.filterForm[item.filed].filter(item=>{return Boolean(item)})
              }
              if (this.filterForm[item.filed]&&this.filterForm[item.filed].length>0) {
                searchObj[item.filed] = {}
                searchObj[item.filed][item.opt] = this.filterForm[item.filed]
              }
          }
          else if (this.filterForm[item.filed]){
              searchObj[item.filed] = {}
              searchObj[item.filed][item.opt] = this.filterForm[item.filed]
          }
      })

      return JSON.stringify(searchObj);
    }
    
  }
}
</script>
<style lang="scss" scoped>
  
</style>

<style lang="scss">
  .ke-dialog{
    top:50% !important;
    left:50% !important;
    transform: translateX(-50%) translateY(-50%);
  }  
</style>
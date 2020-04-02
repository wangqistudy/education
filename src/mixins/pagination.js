/*
 * @Author: David
 * @Date: 2019-10-24 11:49:34
 * @LastEditTime: 2019-12-04 17:20:57
 * @LastEditors: Do not edit
 * @Description: 分页混合器
 */
/* eslint-disable */
import {getToken} from '@/utils/auth'
import {mapGetters} from 'vuex'
const qs = require('qs')
export default {
    data () {
      return {
        totalCount:0,
        pageSize:10,
        currPage:1,
        tableData:[],
        pageLoading:true,
        totalPage:1,
        dataFilters:{
          
        }
      }
    },
    computed: {
      ...mapGetters(['roles'])
    },
    methods: {
        getList (param = this.dataFilters) {
          this.pageLoading = true;
          return new Promise((res,rej)=>{
              param = Object.assign({},param)
              if (param.page === undefined){
                param.page = this.currPage;
              }
              if (param.page_num === undefined) {
                param.page_num = this.pageSize
              }
              this.listApi(param)
              .then(data=>{
                  if (data.code!==undefined){
                    this.tableData = data.data.data?data.data.data:[]
                    this.setPagination(data.data.meta.pagination)
                    this.pageLoading = false;
                  }
                  res(data)
              })
              .catch(err=>{
                this.pageLoading = false;
                rej(err);
              })
          })
         
        },
        setPagination (pagination) {
            if (!pagination) {
              return;
            }
            let {total,per_page,current_page,total_pages} = pagination
            this.totalCount =total-0;
            this.pageSize = per_page-0;
            this.currPage = current_page-0;
            this.totalPage = total_pages-0;
        },
        handleCurrentChange (page) {
            this.currPage = page;
            return this.getList()
        },
        setDataFilters (value) {
          this.$set(this,'dataFilters',value)
        },
        handleExport (url) {
          let token = getToken()
          let data = Object.assign({},this.dataFilters,{is_export:1})
          let config = {}
          config.responseType = 'blob'
          data.token = token
          data = qs.stringify(data)
          this.$http.post(url,data,config)
          .then(res=>{
            
            let {headers} = res;
            let fileName;
            if (headers.exportexcelname){
                fileName = decodeURI(headers.exportexcelname)
            }else{
              fileName = 'excel.xlsx'
            }
            
            this.download(res.data,fileName)
          })
          // this.getList(Object.assign({},this.dataFilters,{is_export:1}),'',{responseType:'blob'})
          // .then(data=>{
          //   this.download(data)
          // })
        },
        download (data,name) {
              if (!data) {
                  return
              }
              let url = window.URL.createObjectURL(new Blob([data],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}))
              let link = document.createElement('a')
              link.style.display = 'none'
              link.href = url
              let exportName = name||'excel.xlsx'
              link.setAttribute('download', exportName)
      
              document.body.appendChild(link)
              link.click()
        },
        proxy_handleDelete (id,fnKey,str) {
          this.$confirm(`即将${str||'删除该条记录'}, 是否继续?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
              this[fnKey]&&this[fnKey](id)
          }).catch(() => {
                   
          });
        }
    },
}
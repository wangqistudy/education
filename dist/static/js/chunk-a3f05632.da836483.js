(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-a3f05632"],{"1b80":function(e,t,a){"use strict";a("8e6e"),a("ac6a"),a("456d");var n=a("bd86"),i=a("5f87"),r=a("2f62");function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){Object(n["a"])(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}var s=a("4328");t["a"]={data:function(){return{totalCount:0,pageSize:10,currPage:1,tableData:[],pageLoading:!0,totalPage:1,dataFilters:{}}},computed:l({},Object(r["c"])(["roles"])),methods:{getList:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.dataFilters;return this.pageLoading=!0,new Promise((function(a,n){t=Object.assign({},t),void 0===t.page&&(t.page=e.currPage),void 0===t.page_num&&(t.page_num=e.pageSize),e.listApi(t).then((function(t){void 0!==t.code&&(e.tableData=t.data.data?t.data.data:[],e.setPagination(t.data.meta.pagination),e.pageLoading=!1),a(t)})).catch((function(t){e.pageLoading=!1,n(t)}))}))},setPagination:function(e){if(e){var t=e.total,a=e.per_page,n=e.current_page,i=e.total_pages;this.totalCount=t-0,this.pageSize=a-0,this.currPage=n-0,this.totalPage=i-0}},handleCurrentChange:function(e){return this.currPage=e,this.getList()},setDataFilters:function(e){this.$set(this,"dataFilters",e)},handleExport:function(e){var t=this,a=Object(i["a"])(),n=Object.assign({},this.dataFilters,{is_export:1}),r={responseType:"blob"};n.token=a,n=s.stringify(n),this.$http.post(e,n,r).then((function(e){var a,n=e.headers;a=n.exportexcelname?decodeURI(n.exportexcelname):"excel.xlsx",t.download(e.data,a)}))},download:function(e,t){if(e){var a=window.URL.createObjectURL(new Blob([e],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"})),n=document.createElement("a");n.style.display="none",n.href=a;var i=t||"excel.xlsx";n.setAttribute("download",i),document.body.appendChild(n),n.click()}},proxy_handleDelete:function(e,t,a){var n=this;this.$confirm("即将".concat(a||"删除该条记录",", 是否继续?"),"提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){n[t]&&n[t](e)})).catch((function(){}))}}}},c4b0:function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"comment-set-wrap page-wrap"},[a("div",{staticClass:"common-set  page-inner"},[e._m(0),e._v(" "),a("div",{staticClass:"page-table"},[a("div",{staticClass:"filter-wrap"},[a("filterCom",{attrs:{filterOptions:e.filterOptions,type:"keyValue"},on:{dosearch:e.handleDoSearch}},[a("template",{slot:"anotherbtn"},[a("el-button",{attrs:{type:"success",icon:"el-icon-plus"},on:{click:function(t){return e.handleEdit(null,"add")}}},[e._v("\n                      新增签到\n                    ")]),e._v(" "),a("el-button",{attrs:{type:"warning",icon:"el-icon-plus"},on:{click:function(t){return e.handleEdit(null,"edit")}}},[e._v("\n                      新增签退\n                    ")]),e._v(" "),e.needSecret?a("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.handleExport("/api"+e.apiList.search_list)}}},[e._v("\n                      导出Excel\n                    ")]):e._e()],1)],2)],1),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.pageLoading,expression:"pageLoading"}],attrs:{data:e.tableData,"header-row-class-name":"headrow","header-cell-class-name":"headrowcell"}},[a("el-table-column",{attrs:{prop:"id",label:"序号","header-align":"center",align:"center",width:"50px"}}),e._v(" "),a("el-table-column",{attrs:{label:"工号","header-align":"center",align:"center",prop:"job_num"}}),e._v(" "),a("el-table-column",{attrs:{prop:"sign_in",label:"签到时间","header-align":"center",align:"center"}}),e._v(" "),a("el-table-column",{attrs:{label:"签到IP地址","header-align":"center",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",{class:{red:1==t.row.sign_in_ip_illegal}},[e._v(e._s(t.row.sign_in_ip))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"sign_in_note",label:"签到备注","header-align":"center",align:"center"}}),e._v(" "),a("el-table-column",{attrs:{prop:"sign_out",label:"签退时间","header-align":"center",align:"center"}}),e._v(" "),a("el-table-column",{attrs:{label:"签退IP地址","header-align":"center",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",{class:{red:1==t.row.sign_out_ip_illegal}},[e._v(e._s(t.row.sign_out_ip))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"sign_out_note",label:"签退备注","header-align":"center",align:"center"}})],1),e._v(" "),a("div",{staticClass:"pagination"},[a("el-pagination",{attrs:{"current-page":e.currPage,"page-size":e.pageSize,layout:"prev, pager, next, jumper",total:e.totalCount},on:{"current-change":e.handleCurrentChange,"update:currentPage":function(t){e.currPage=t},"update:current-page":function(t){e.currPage=t}}})],1)],1)]),e._v(" "),a("el-dialog",{attrs:{visible:e.showEdit,width:"626px","close-on-click-modal":!1,title:"新增"+("edit"==e.dialogType?"签退":"签到")},on:{"update:visible":function(t){e.showEdit=t}}},[a("el-form",{ref:"formData",attrs:{model:e.formData,"label-width":"100px",rules:e.formRule}},[a("el-form-item",{attrs:{label:"备注：",prop:"note"}},[a("el-input",{attrs:{type:"textarea"},model:{value:e.formData.note,callback:function(t){e.$set(e.formData,"note",t)},expression:"formData.note"}})],1)],1),e._v(" "),a("div",{staticClass:"subBtn"},[a("el-button",{attrs:{type:"success"},on:{click:e.handleSub}},[e._v("确定")])],1)],1)],1)},i=[function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("p",{staticClass:"set-header page-header"},[e._v("\n            签到管理 "),a("span",[e._v("(注：非系统设置的IP地址签到时，IP显示红色)")])])}],r=a("cc96"),o=a("40cb"),l=a("60c5"),s=a("1b80"),c=a("7c15"),u={name:"attMgr",components:{editorCom:r["a"],uploadImg:o["a"],filterCom:l["a"]},mixins:[s["a"]],data:function(){var e=function(e,t,a){if(!t)return a(new Error("请填写地址"));a()},t=function(e,t,a){if(!t)return a(new Error("请上传图片"));a()},a=function(e,t,a){if(!t)return a(new Error("请填写联系方式"));a()},n=function(e,t,a){if(!t)return a(new Error("请填写校区名"));a()};return{imgList:[],listApi:c["b"].search_list,filterOptions:[{label:"工号:",filed:"job_num",opt:"$like",options:[],defaultValue:"",type:"input",optionUrl:""},{label:"签到时间段:",filed:"timeRange",opt:"$eq",options:[],defaultValue:"",type:"dateRange",optionUrl:""}],dialogType:"add",showInput:!1,formData:{note:""},inputData:{},inputRule:{},formRule:{address:[{validator:e}],mobile:[{validator:a}],name:[{validator:n}],thumbnail:[{validator:t}]},showEdit:!1,apiList:c["a"]}},mounted:function(){this.getList()},methods:{handleDelete:function(e){},handleDoSearch:function(e){this.setDataFilters(e),this.getList()},handleSub:function(){var e=this,t="add"==this.dialogType?1:2;c["b"].sign_admin_in({type:t,note:this.formData.note}).then((function(t){e.getList(),e.showEdit=!1}))},handlePictureCardPreview:function(e){this.openPreview({src:e.thumbnail})},handleEdit:function(e,t){this.dialogType=t,this.formData.note="",this.showEdit=!0}}},d=u,p=(a("ea81"),a("2877")),g=Object(p["a"])(d,n,i,!1,null,"30554cd8",null);t["default"]=g.exports},d961:function(e,t,a){},ea81:function(e,t,a){"use strict";var n=a("d961"),i=a.n(n);i.a}}]);
<!--
 * @Author: David
 * @Date: 2019-10-31 19:13:06
 * @LastEditTime: 2019-12-04 11:55:25
 * @LastEditors: Do not edit
 * @Description: 用户管理
 -->
 <!-- eslint-disable -->
<template>
  <div class="comment-set-wrap page-wrap">

    
      <div class="common-set  page-inner" v-if="!showEdit">
          <p class="set-header page-header">
              用户管理
          </p>
          
          <div class="page-table">
              
              <div class="filter-wrap">
                <filterCom
                :filterOptions="filterOptions"
                @dosearch="handleDoSearch"
                type="keyValue"
                ref="filterCom"
                >
                  
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
                label="姓名"
                header-align="center"
                align="center"
                prop="name"
                >
                 
                </el-table-column>

                <el-table-column
                label="手机号"
                header-align="center"
                align="center"
                prop="mobile"
                >
                    
                </el-table-column>
                

                <el-table-column
                prop="sexName"
                label="性别"
                header-align="center"
                align="center"
                >
                </el-table-column>

                <el-table-column
                prop="gradeName"
                label="年级"
                header-align="center"
                align="center"
                >
                </el-table-column>

                <el-table-column
                prop="school"
                label="学校"
                header-align="center"
                align="center"
                >
                </el-table-column>

                <el-table-column
                prop="collectTeacherNum"
                label="收藏名师数量"
                header-align="center"
                align="center"
                >

                    <template slot-scope="scope">
                        <span v-if="scope.row.collectTeacherNum>0" class="link">
                          <router-link :to="`/system_set/teacher_set?collect_user=${scope.row.id}`">{{scope.row.collectTeacherNum}}</router-link>
                        </span>
                        <span v-else>
                          {{scope.row.collectTeacherNum}}
                        </span>
                    </template>

                </el-table-column>


                <el-table-column
                prop="collectCourseNum"
                label="收藏课程数量"
                header-align="center"
                align="center"
                >

                    <template slot-scope="scope">
                        <span v-if="scope.row.collectCourseNum>0" class="link">
                          <router-link :to="`/course_setting/on_shelves?collect_user=${scope.row.id}`">{{scope.row.collectCourseNum}}</router-link>
                        </span>
                        <span v-else>
                          {{scope.row.collectCourseNum}}
                        </span>
                    </template>

                </el-table-column>

                <el-table-column
                prop="courseOrderNum"
                label="支付成功数量"
                header-align="center"
                align="center"
                >

                    <template slot-scope="scope">
                        <span v-if="scope.row.courseOrderNum>0" class="link">
                          <router-link :to="`/financial_mgr/order_mgr?collect_user=${scope.row.id}`">{{scope.row.courseOrderNum}}</router-link>
                        </span>
                        <span v-else>
                          {{scope.row.courseOrderNum}}
                        </span>
                    </template>

                </el-table-column>


                <el-table-column
                label="浏览信息"
                header-align="center"
                align="center"
                >
                  <template slot-scope="scope">
                      <span class="viewHistory" @click="handleViewHistory(scope.row)">浏览信息</span>
                  </template>
                </el-table-column>


                <el-table-column
                prop="created_at"
                label="注册时间"
                header-align="center"
                align="center"
                >
                </el-table-column>

                <el-table-column
                label="操作"
                header-align="center"
                align="center"
                min-width="140px"
                v-if="hasEditPermission"
                >

                  <template slot-scope="scope">
                      <el-button size="mini" type="primary" @click="handleEdit(scope.row,'edit')">
                        修改档案
                      </el-button>
                      <el-button type="default" @click="banStu(scope.row)" size="mini">
                          {{scope.row.is_banned==1?'启用':'禁用'}}
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
              修改档案
          </p>
          <div class="page-content">
            <div class="page-tables">
                <el-form :model="formData" ref="formData" :rules="formRule" label-width="120px">
                  <div class="info-list">
                    <div class="inline">
                        <el-form-item label="学生姓名:">
                          <div class="item-inner">
                            <span>{{formData.name}}</span> 
                          </div>
                            
                        </el-form-item>  

                        <el-form-item label="所属学校:">
                            <div class="item-inner">
                              <span>{{formData.school}}</span> 
                            </div>
                        </el-form-item>  
                    </div>

                    <div class="inline">
                        <el-form-item label="联系方式:">
                          <div class="item-inner">
                            <span>{{formData.mobile}}</span> 
                          </div>
                        </el-form-item>  

                        <el-form-item label="性别:">
                            <div class="item-inner">
                              <span>{{formData.sexName}}</span> 
                            </div>
                        </el-form-item>  
                    </div>
                    <div class="inline line">
                        <el-form-item label="是否新生:">
                          <div class="item-inner">
                            {{formData.isNew==1?'是':'否'}}
                          </div>
                        </el-form-item> 

                        <el-form-item label="年级:">
                          <div class="item-inner">
                            <span>{{formData.gradeName||'--'}}</span> 
                          </div>
                        </el-form-item> 
                    </div>
                  </div>
                  
                  

                  <div class="doc-list">
                      <div class="doc-item" v-for="(arc,index) in archive" :key="index">
                          <div class="item-header">
                            <p class="doc-left">
                                <span class="doc-label">课程{{index+1}}:</span>
                                <span class="doc-no">{{arc.courseSn}}</span>
                                <span class="doc-title">{{arc.courseName}}</span>
                                <span class="doc-teacher">主讲老师：{{arc.courseTeachers[1]?(arc.courseTeachers[1][0]?arc.courseTeachers[1][0].teacher_name:'--'):'--'}}</span>
                            </p>
                            <p class="doc-right">
                              {{arc.courseClassStartDate}}至{{arc.courseClassEndDate}}
                            </p>
                          </div>
                          <el-form-item label="备注:">
                            <editorCom v-model="arc.archive" 
                            :options="editOptions"
                            >
                              
                            </editorCom>
                          </el-form-item>
                      </div>

                  </div>
                  


                  
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


      <!-- 浏览信息 -->
      <el-dialog :visible.sync="showViewHistory" width="70%"  :close-on-click-modal="false" :title ="`浏览信息`">
          <div class="table-wrapper page-table">
              <el-table
              :data="viewTableData"
              header-row-class-name="headrow"
              header-cell-class-name="headrowcell"
              >
                <el-table-column
                prop="id"
                label="序号"
                header-align="center"
                align="center"  width="80px"
                >
                </el-table-column>

                <el-table-column
                prop="courseName"
                label="课程标题"
                header-align="center"
                align="center"
                >
                  <template slot-scope="scope">
                    <span>{{scope.row.courseName||'--'}}</span>  
                  </template>

                </el-table-column>

                <el-table-column
                prop="courseSn"
                label="课程编号"
                header-align="center"
                align="center"
                >
                  <template slot-scope="scope">
                    <span>{{scope.row.courseSn||'--'}}</span>  
                  </template>
                </el-table-column>

                <el-table-column
                prop="collectTeacherNum"
                label="搜索条件"
                header-align="center"
                align="center"
                >
                  <template slot-scope="scope">
                    <span>{{scope.row.conditions||'--'}}</span>  
                  </template>
                </el-table-column>

                <el-table-column
                label="停留时间"
                header-align="center"
                align="center"
                >
                  <template slot-scope="scope">
                    <span>{{scope.row.duration||'--'}}s</span>  
                  </template>
                </el-table-column>

                <el-table-column
                prop="updated_at"
                label="搜索时间"
                header-align="center"
                align="center"
                >
                </el-table-column>
              </el-table>

              <div class="pagination">
                <el-pagination
                  @current-change="handleCurrentChange1"
                  :current-page.sync="currPage1"
                  :page-size="pageSize1"
                  layout="prev, pager, next, jumper"
                  :total="totalCount1">
                </el-pagination>
              </div>
          </div>
      </el-dialog>
      <!-- 浏览信息 -->
      
  </div>
</template>
<script>
import editorCom from '@/components/editor/editorCom.vue'
import uploadImg from '@/components/uploadImg'
import filterCom from '@/components/filterCom'
import Calendar from '@/components/Calendar'
import TopTab from '@/components/TopTab'
import pagination from '@/mixins/pagination'
import {getToken} from '@/utils/auth'
import api from '@/utils/api'
import {apiList} from '@/utils/api'
import {mapState,mapMutations} from 'vuex'
export default {
    name:'dataStatistics',
    components:{editorCom,uploadImg,filterCom,Calendar,TopTab},
    mixins:[pagination],
    data () {

      let validateEmpty = (rule,value,cb)=>{
        if (!value) {
            return cb(new Error('请填写信息'))
          }
          cb()
      }

      let validateAddress = (rule,value,cb) => {
          if (!value) {
            return cb(new Error('请填写地址'))
          }
          cb()
      }
      let validateThumbnail = (rule,value,cb) => {
          if (!value) {
            return cb(new Error('请上传图片'))
          }
          cb()
      }


      let validateMobile = (rule,value,cb) => {
          if (!value) {
            return cb(new Error('请填写联系方式'))
          }
          cb()
      }

      let validateName = (rule,value,cb) => {
          
          if (!value) {
            return cb(new Error('请填写校区名'))
          }
          cb()
      }

      return {
        editOptions:{
            uploadJson:'/api'+apiList.archive_upload+'?token='+getToken()
        },
        imgList:[],
        videoList:[],
        listApi:api.user_list,
        activeName:'act1',
        filterOptions:[
          {  label:'姓名:',filed:'name' , opt:'$like' , options:[] , defaultValue:'' , type:'input' , optionUrl:'' },
          {  label:'手机号:',filed:'mobile' , opt:'$eq' , options:[] , defaultValue:'' , type:'input' , optionUrl:'' },
          {  label:'注册时间:',filed:'timeRange' , opt:'$eq' , options:[] , defaultValue:'' , type:'dateRange' , optionUrl:'' },
         
        ],
        teacherConfig:[],
        dialogType:'edit',//edit 修改  add 新增
        pageType:'table',//edit   table
        formData:{
          
        },
        formRule:{
          title:[
            {validator:validateEmpty}
          ],
          thumbnail:[
            {validator:validateEmpty}
          ],
          url:[
            {validator:validateEmpty}
          ],
          grade_id:[
            {validator:validateEmpty}
          ],
          subject_id:[
            {validator:validateEmpty}
          ],
          type_id:[
            {validator:validateEmpty}
          ],
          teacher_id:[
            {validator:validateEmpty}
          ],
          introduce:[
            {validator:validateEmpty}
          ]
        },
        showEdit:false,
        showViewHistory:false,
        apiList,
        archive:[],
        viewTableData:[],

        currPage1:1,
        pageSize1:10,
        totalCount1:1
        
      }
    },
    mounted () {
       
        this.showDocument(this.$route.query.user_id)
        this.getSearchList(this.$route.query.user)
        this.$mounted = true
    },
    activated () {
        if (this.$mounted) {
          this.$mounted = false
          return
        }
        this.showDocument(this.$route.query.user_id)
        this.getSearchList(this.$route.query.user)
    },
    computed :{
      ...mapState({
          pathFilter:state=>state.redirect['/usr_mgr/index']
        })
    },
    methods:{
        ...mapMutations({
          updatePathRedirect:'redirect/updatePathRedirect'
        }),
        showDocument (id) {
            if (id) {
              this.handleEdit({id})
              this.$router.replace('/usr_mgr/index')
            }
        },
        getSearchList (id) {
          if (id) {
            this.setDataFilters(Object.assign({},this.dataFilters,{user_id:id}));
            this.getList();
            this.$router.replace('/usr_mgr/index')
          }else if (Object.keys(this.pathFilter).length>0) {
            
            let param = Object.assign({},this.dataFilters,this.pathFilter);
            if (param.timeRange) {
              this.filterOptions[2].defaultValue = param.timeRange
            }
            this.updatePathRedirect({
              path:'/usr_mgr/index',
              data:{}
            })
            this.getList(param);
          }else{
             this.getList();
          }
        },
        handleViewHistory (row) {
          this.currPage1=1;
          this.totalCount1=1;
          this.$currUserId = row.id
          this.getUserViewList()
          .then(data=>{
            this.showViewHistory = true
          })
          
        },
        banStu (row) {
            let is_banned = row.is_banned==1?0:1;
            if (is_banned==1) {
                this.$confirm('即将禁用该用户, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                    api.disable_student({is_banned,id:row.id})
                    .then(data=>{
                        row.is_banned = is_banned;
                    })
                }).catch(() => {
                        
                });
            }else{
              api.disable_student({is_banned,id:row.id})
              .then(data=>{
                  row.is_banned = is_banned;
              })
            }
            
        },
        handleDoSearch (filter) {
            this.setDataFilters(filter)
            this.getList()
        },
        
        handleCurrentChange1 (page) {
          this.currPage1 = page
          this.getUserViewList()
        },

        getUserViewList () {
          return new Promise((res,rej)=>{
            api.search_log_list({user_id:this.$currUserId||'',page:this.currPage1,page_num:this.pageSize1})
            .then(data=>{
                this.viewTableData = data.data.data;
                let {pagination} = data.data.meta;
                let {total,per_page,current_page} = pagination
                this.totalCount1 = total-0
                this.pageSize1 = per_page-0
                this.currPage1 = current_page-0
                res(data);
            })
            .catch(err=>{
              rej(err)
            })
          })
            
        },
        
        handleSub () {
          let param = {}
          param.user_id = this.formData.id;
          param.archives = JSON.stringify(this.archive.map(item=>{return {courseId:item.courseId,archive:item.archive}}))
          api.archive_save(param)
          .then(data=>{
            this.showEdit = false;
            this.$appmessage({
              type:'success',
              message:data.message||'保存成功'
            })
          })
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
            
            api.user_archive({id:item.id})
            .then(data=>{
              //console.log(data);
              let {archive,userInfo} = data.data
              this.$set(this,'formData',userInfo)
              this.archive = archive
              this.showEdit = true;
            })
            
            
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
    padding:0 ;
    padding-top:20px;
    .el-form{
      .line{
        border-bottom:1px solid #dddddd;
      }
    }
    .doc-list{
      margin-top:20px;
      padding:0 32px;
      .doc-item{
        .item-header{
          margin-bottom:20px;
          display: flex;
          justify-content: space-between;
          .doc-left{
            .doc-label{
              width: 120px;
              padding-right:12px;
              display: inline-block;
              text-align: right;
            }
            .doc-no{
              font-size:16px;
              color:#333333;
              margin-right:15px;
            }
            .doc-title{
              color:#333;
              margin-right:74px;
            }
            .doc-teacher{
              color:#0566ce;
            }
            
          }
          .doc-right{
            font-size:16px;
            color:#333333;
          }
        }
      }
    }
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

    .data-preview{
      display: flex;
      margin-bottom:15px;
      p{
        margin-right:34px;
        font-size:16px;
        span{
          color:#fb3131;
          font-size:18px;
        }
      }
    }
    .item-inner{
      width:300px;
      
    }
    .viewHistory{
      color:#0566ce;
      cursor: pointer;
    }
    .info-list{
      padding: 0 32px;
    }
    .link{
      color:#0566ce;
    }
</style>
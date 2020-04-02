<!--
 * @Author: David
 * @Date: 2019-10-31 19:13:06
 * @LastEditTime: 2019-12-04 09:44:55
 * @LastEditors: Do not edit
 * @Description: 小区设置
 -->
<template>
  <div class="comment-set-wrap page-wrap">
      <div class="common-set  page-inner">
          <p class="set-header page-header">
              教师设置
          </p>
          
          <div class="page-table">


              <div class="filter-wrap">
                <filterCom
                :filterOptions="filterOptions"
                @dosearch="handleDoSearch"
                type="keyValue"
                >
                  <template slot="anotherbtn">
                      <el-button type="success" icon="el-icon-plus" @click="handleEdit(null,'add')" v-if="hasEditPermission">
                        新增
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
                prop="id"
                label="序号"
                header-align="center"
                align="center"  width="50px"
                >
                </el-table-column>

                <el-table-column
                label="图片"
                header-align="center"
                align="center"
                >
                  <template slot-scope="scope">
                      <div class="imgWrap img-item">
                          <img :src="scope.row.thumbnail" alt="">
                          <p class="img-opt">
                              <span @click="handlePictureCardPreview(scope.row)">
                                <i class="el-icon-zoom-in"></i>
                              </span>
                          </p>
                      </div>
                  </template>
                </el-table-column>

                <el-table-column
                label="姓名"
                header-align="center"
                align="center"
                prop="name"
                >
                 
                </el-table-column>
                <el-table-column
                prop="job_code"
                label="工号"
                header-align="center"
                align="center"
                >
                </el-table-column>

                <el-table-column
                prop="school"
                label="毕业院校"
                header-align="center"
                align="center"
                >
                </el-table-column>

                <el-table-column
                label="学历"
                header-align="center"
                align="center"
                prop="educationLevelName"
                >
                 
                </el-table-column>
                <el-table-column
                prop="subjectName"
                label="科目"
                header-align="center"
                align="center"
                >
                </el-table-column>

                <el-table-column
                prop="desc"
                label="教师简介"
                header-align="center"
                align="center"
                >
                    <template slot-scope="scope">
                        <span> {{scope.row.desc|chineseWord}} </span>
                    </template>
                </el-table-column>

                <el-table-column
                label="是否展示为名师"
                header-align="center"
                align="center"
                >
                  <template slot-scope="scope">
                        <span>{{scope.row.is_star==1?'是':'否'}}</span>
                    </template>
                </el-table-column>

                <el-table-column
                label="是否展示在首页"
                header-align="center"
                align="center"
                >
                  <template slot-scope="scope">
                        <span>{{scope.row.index_page_no==0?'否':`${scope.row.index_page_no}号位`}}</span>
                    </template>
                </el-table-column>


                <el-table-column
                prop="weight"
                label="排序权重"
                header-align="center"
                align="center"
                >
                </el-table-column>

                
                <el-table-column
                label="操作"
                header-align="center"
                align="center"
                min-width="120px"
                v-if="hasEditPermission"
                >

                  <template slot-scope="scope">
                      <el-button size="mini" type="primary" @click="handleEdit(scope.row,'edit')">
                        修改
                      </el-button>
                      <el-button size="mini" type="default" @click="proxy_handleDelete(scope.row.id,'handleDelete')">
                        删除
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

      <!-- 修改面板 -->
      <el-dialog :visible.sync="showEdit" width="837px" top="20px"  :close-on-click-modal="false" :title ="`${dialogType=='edit'?'修改':'新增'}信息`" @close="$refs.formData.resetFields()">

          <el-form :model="formData" label-width="130px" :rules="formRule" ref="formData">

              <el-form-item label="图片：" prop="thumbnail">
                  <uploadImg
                    v-model="imgList"
                    desc="上传图片推荐尺寸：212x212"
                    :actionUrl="`/api`+apiList.teacher_upload"
                    :files="imgList"

                  >
                  </uploadImg>
              </el-form-item>
              

              <div class="inline">
                    <el-form-item label="是否展示为名师：" prop="is_star" >
                        <el-radio-group v-model="formData.is_star">
                          <el-radio :label="0">否</el-radio>
                          <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="展示在首页：" prop="index_page_no" v-if="formData.is_star==1">
                        <el-radio-group v-model="formData.index_page_no">
                          <el-radio :label="0">否</el-radio>
                          <el-radio v-for="(item,index) in pageNoSel" :key="index" :label="item.value" :disabled="!item.enable">{{item.value}}号</el-radio>
                          <!-- <el-radio :label="2">2号</el-radio>
                          <el-radio :label="3">3号</el-radio>
                          <el-radio :label="4">4号</el-radio> -->
                        </el-radio-group>
                    </el-form-item>
                </div>

                <div class="inline">
                    <el-form-item label="姓名：" prop="name">
                        <el-input
                        v-model="formData.name"
                        >
                        
                        </el-input>
                    </el-form-item>
                    <el-form-item label="工号：" prop="job_code">
                        <el-input
                          v-model="formData.job_code"
                        >
                        
                        </el-input>
                    </el-form-item>
                </div>

                <div class="inline">
                    <el-form-item label="学历：" prop="education_level">
                        <el-select v-model="formData.education_level">
                             <el-option v-for="(subject,index) in educationLevelConfig" :key="index" :value="subject.id" :label="subject.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="毕业院校：" prop="school">
                        <el-input
                          v-model="formData.school"
                        >
                        
                        </el-input>
                    </el-form-item>
                </div>
                <div class="inline">
                    <el-form-item label="科目：" prop="subject_id">
                        <el-select v-model="formData.subject_id">
                            <el-option v-for="(subject,index) in subjectConfig" :key="index" :value="subject.id" :label="subject.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="排序权重：" prop="weight">
                        <el-input-number v-model="formData.weight" :controls="false">
                            
                        </el-input-number>
                    </el-form-item>
                  
                </div>

                <el-form-item label="教师简介：" prop="desc">
                    <editorCom
                    v-model="formData.desc"
                    :options="editOptions"
                    >
                      
                    </editorCom>
                    <p class="html5EditTips">(备注:上传图片参考宽度:930px)</p>
                </el-form-item>

          </el-form>

          <div class="subBtn">
            <el-button type="success" @click="handleSub">确定</el-button>
          </div>
      </el-dialog>
      <!-- 修改面板 -->
      
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
import {mapState,mapMutations} from 'vuex'
export default {
    name:'teacherSet',
    components:{editorCom,uploadImg,filterCom},
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
          // //console.log(rule,value);
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
            return cb(new Error('请填写信息'))
          }
          cb()
      }

      return {
        editOptions:{
            uploadJson:'/api'+apiList.teacher_upload+'?token='+getToken()
        },
        imgList:[],
        listApi:api.teacher_list,
        filterOptions:[
          {  label:'教师姓名:',filed:'name' , opt:'$like' , options:[] , defaultValue:'' , type:'select' , optionUrl:'',remoteUrl:apiList.teacher_search },
          {  label:'科目:',filed:'subject' , opt:'$eq' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
        ],
        dialogType:'edit',//edit 修改  add 新增
        formData:{
          is_star:0,
          weight:1
        },
        formRule:{
          address:[
            {validator:validateAddress}
          ],
          job_code:[
            {validator:validateEmpty}
          ],
          education_level:[
            {validator:validateEmpty}
          ],
          school:[
            {validator:validateEmpty}
          ],
          desc:[
            {validator:validateEmpty}
          ],
          subject_id:[
            {validator:validateEmpty}
          ],
          name:[
            {validator:validateName}
          ],
          thumbnail:[
            {validator:validateThumbnail}
          ]
        },
        showEdit:false,
        apiList,
        educationLevelConfig:[],
        subjectConfig:[],
        pageNoSel:[]
      }
    },
    mounted () {
        this.getList();
        this.getOptions();
        this.getSearchList(this.$route.query.collect_user)
    },
    activated () {
        this.getSearchList(this.$route.query.collect_user)
    },
    computed:{
      ...mapState({
        pathFilter:state=>state.redirect['/system_set/teacher_set']
      })
    },
    filters:{
      chineseWord (str) {
        if (!str) {
          return ""
        }
        let wrapDom = document.createElement('div')
        wrapDom.innerHTML = str;
        let text = wrapDom.innerText
        
        return text.slice(0,20);
      }
    },
    methods:{
       ...mapMutations({
          updatePathRedirect:'redirect/updatePathRedirect'
        }),
        getSearchList (id) {
          if (id) {
            let param = Object.assign({},this.dataFilters,{user_id:id});
            this.getList(param);
            this.$router.replace('/system_set/teacher_set')
          }
          if (Object.keys(this.pathFilter).length>0) {
            
            let param = Object.assign({},this.dataFilters,this.pathFilter);
            this.updatePathRedirect({
              path:'/system_set/teacher_set',
              data:{}
            })
            this.getList(param);
          }
        },
        handleDoSearch (filter) {
            this.setDataFilters(filter)
            this.getList()
        },
        handleDelete (id) {
          
          api.teacher_delete({id})
          .then(data=>{
            this.showEdit = false;
            this.getList()
            this.$appmessage({
              type:'success',
              message:data.message||'删除成功'
            })
          })
        },
        getOptions () {
          api.teacher_config()
          .then(data=>{ 
            let {educationLevelConfig,subjectConfig,pageNoMap} = data.data;
            this.educationLevelConfig = educationLevelConfig
            this.subjectConfig = subjectConfig
            this.filterOptions[1].options = subjectConfig

            let opt = []
            Object.keys(pageNoMap).forEach(key=>{
                
                opt.push({
                  value:pageNoMap[key].index_page_no-0,
                  enable:pageNoMap[key].teacher_id<=0||(this.formData.id==pageNoMap[key].teacher_id),
                  teacher_id:pageNoMap[key].teacher_id
                })
            })
            this.pageNoSel = opt;
          })
        },  
        handleSub () {
          let thumbnail = this.imgList[0]?this.imgList[0].url:''
          // this.formData.thumbnail = thumbnail
          this.$set(this.formData,'thumbnail',thumbnail)
          this.$refs.formData.validate(valid=>{
            if (valid) {
                let param = JSON.parse(JSON.stringify(this.formData))
                param.thumbnail = thumbnail;
                api.teacher_save(param)
                .then(data=>{
                  this.showEdit = false;
                  this.getList()
                  this.$appmessage({
                    type:'success',
                    message:data.message||'保存成功'
                  })
                })
            }
          })
        },
        handlePictureCardPreview(file) {
            this.openPreview({src:file.thumbnail})
        },
        handleEdit (item,type) {
            this.dialogType = type
            if (type=='add') {
                this.formData = {
                  is_star:0,
                  weight:1,
                  desc:''
                }
                this.imgList = []
                this.getOptions();
                this.showEdit = true;
                return
            }
            Object.keys(item).forEach(key=>{
              this.$set(this.formData,key,item[key])
              if (key=='thumbnail') {
                  this.imgList = [{url:item[key]}]
              }
              if (key=='subject_id') {
                  if (!this.subjectConfig.some(it=>it.id==item.subject_id)) {
                    this.$set(this.formData,key,'')
                  } 
              }
            })
            this.getOptions();
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
    .el-select{
      width:185px;
    }
    .el-input{
      width:185px;
    }
    .el-form-item{
      /deep/.el-input-number{
        width: 185px;
      }
    }
    
</style>
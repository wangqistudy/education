<!--
 * @Author: David
 * @Date: 2019-10-31 19:13:06
 * @LastEditTime: 2019-12-04 09:45:21
 * @LastEditors: Do not edit
 * @Description: 小区设置
 -->
 <!-- eslint-disable -->
<template>
  <div class="comment-set-wrap page-wrap">
      <div class="common-set  page-inner" v-if="!showEdit">
          <p class="set-header page-header">
              视频设置
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
                type="index"
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
                label="标题"
                header-align="center"
                align="center"
                prop="title"
                >
                 
                </el-table-column>

                <el-table-column
                label="授课老师"
                header-align="center"
                align="center"
                prop="teacherName"
                >
                 
                </el-table-column>
                <el-table-column
                prop="grade_id"
                label="年级"
                header-align="center"
                align="center"
                >
                  <template slot-scope="scope">
                      {{getGradeName(scope.row.grade_id)}}
                  </template>

                </el-table-column>

                <el-table-column
                prop="subjectName"
                label="科目"
                header-align="center"
                align="center"
                >
                  <template slot-scope="scope">
                      {{getSubjectName(scope.row.subject_id)}}
                  </template>
                </el-table-column>

                <el-table-column
                prop="type_id"
                label="类型"
                header-align="center"
                align="center"
                >
                  <template slot-scope="scope">
                      {{getTypetName(scope.row.type_id)}}
                  </template>
                </el-table-column>


                <el-table-column
                prop="watch_num"
                label="点播次数"
                header-align="center"
                align="center"
                >
                </el-table-column>


                <el-table-column
                label="视频"
                header-align="center"
                align="center"
                >
                  <template slot-scope="scope">
                      <video :src="scope.row.url" width="130px" height="70px" controls></video>
                  </template>
                </el-table-column>


                <el-table-column
                label="课程大纲"
                header-align="center"
                align="center"
                >
                  <template slot-scope="scope">
                        <span> {{scope.row.introduce|chineseWord}} </span>
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
                prop="upload_time"
                label="上传时间"
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

      <div class="page-inner video-set" v-else>
          <p class="set-header page-header">
              {{dialogType=='edit'?'修改':'新增'}}视频
          </p>
          
          <div class="page-table">
              <el-form :model="formData" ref="formData" :rules="formRule" label-width="100px">
                  <el-form-item label="视频标题:" prop="title">
                      <el-input v-model="formData.title">

                      </el-input>
                  </el-form-item>

                  <div class="inline">
                     <el-form-item label="上传图片:"  prop="thumbnail">
                        <uploadImg
                        v-model="imgList"
                        desc="上传图片推荐尺寸：378×180"
                        :actionUrl="`/api`+apiList.video_upload"
                        :files="imgList"
                        
                        >
                          
                        </uploadImg>
                    </el-form-item>

                    <el-form-item label="上传视频:" prop="url">
                        <uploadImg
                        v-model="videoList"
                        :actionUrl="`/api`+apiList.video_upload"
                        :files="videoList"
                        type="2"
                        accept=".mp4"
                        >
                          
                        </uploadImg>
                    </el-form-item>
                  </div>

                  <div class="inline">
                    <el-form-item label="年级:" prop="grade_id">
                        <el-select v-model="formData.grade_id">
                            <el-option v-for="(item,index) in gradeConfig" :key="index" :label="item.value" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="科目:" prop="subject_id">
                      <el-select v-model="formData.subject_id">
                          <el-option v-for="(item,index) in subjectConfig" :key="index" :label="item.value" :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>

                  <div class="inline">
                    <el-form-item label="类型:"  prop="type_id">
                        <el-select v-model="formData.type_id">
                            <el-option v-for="(item,index) in typeConfig" :key="index" :label="item.value" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="主讲老师:" prop="teacher_id">
                      <el-select v-model="formData.teacher_id" 
                       remote
                      :remote-method="getTeacherOptin"
                      filterable
                      >
                          <el-option v-for="(item,index) in teacherConfig" :key="index" :label="item.value" :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                    
                  </div>
                  <el-form-item label="排序权重：" prop="weight">
                      <el-input-number v-model="formData.weight" :controls="false">
                          
                      </el-input-number>
                  </el-form-item>

                  <el-form-item label="课程大纲" prop="introduce">
                      <editorCom
                      v-model="formData.introduce"
                      :options="editOptions"
                      >

                      </editorCom>
                  </el-form-item>
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
</template>
<script>
import editorCom from '@/components/editor/editorCom.vue'
import uploadImg from '@/components/uploadImg'
import filterCom from '@/components/filterCom'
import pagination from '@/mixins/pagination'
import {getToken} from '@/utils/auth'
import api from '@/utils/api'
import {apiList} from '@/utils/api'
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
            uploadJson:'/api'+apiList.video_upload+'?token='+getToken()
        },
        imgList:[],
        videoList:[],
        listApi:api.video_list,
        filterOptions:[
          {  label:'年级:',filed:'grade' , opt:'$like' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
          {  label:'科目:',filed:'subject' , opt:'$eq' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
          {  label:'类型:',filed:'type' , opt:'$eq' , options:[] , defaultValue:'' , type:'select' , optionUrl:'' },
          {  label:'标题:',filed:'title' , opt:'$eq' , options:[] , defaultValue:'' , type:'input' , optionUrl:'' },
          {  label:'主讲老师:',filed:'teacher' , opt:'$eq' , options:[] , defaultValue:'' , type:'select' , remoteUrl:apiList.teacher_search },
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
        apiList,
        gradeConfig:[],
        subjectConfig:[],
        typeConfig:[],
      }
    },
    mounted () {
        this.getList();
        this.getOptions();
    },
    computed :{
     
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
        getTeacherOptin (query) {
          api.teacher_search({query})
          .then(data=>{
            this.teacherConfig = data.data
          })
        },
        getGradeName (id) {
          let value;
          if (this.gradeConfig.some(item=>{  item.id==id&&(value=item.value);   return item.id==id})){
                return value;
          }
          return '--'
        },
        getSubjectName (id) {
          let value;
          if (this.subjectConfig.some(item=>{  item.id==id&&(value=item.value);   return item.id==id})){
                return value;
          }
          return '--'
        },
        getTypetName (id) {
          let value;
          if (this.typeConfig.some(item=>{  item.id==id&&(value=item.value);   return item.id==id})){
                return value;
          }
          return '--'
        },
        handleDoSearch (filter) {
            this.setDataFilters(filter)
            this.getList()
        },
        handleDelete (id) {
          
          api.video_delete({id})
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
          api.video_config()
          .then(data=>{ 
            let {gradeConfig,subjectConfig,typeConfig} = data.data;
            this.gradeConfig = gradeConfig
            this.subjectConfig = subjectConfig
            this.typeConfig = typeConfig
            this.filterOptions[0].options = gradeConfig
            this.filterOptions[1].options = subjectConfig
            this.filterOptions[2].options = typeConfig
          })
        },  
        handleSub () {
          let thumbnail = this.imgList[0]?this.imgList[0].url:''
          // this.formData.thumbnail = thumbnail
          this.$set(this.formData,'thumbnail',thumbnail)
          let url = this.videoList[0]?this.videoList[0].url:''
          this.$set(this.formData,'url',url)
          this.$refs.formData.validate(valid=>{
            if (valid) {
                let param = JSON.parse(JSON.stringify(this.formData))
                param.thumbnail = thumbnail;
                param.url = url;
                api.video_save(param)
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
</style>
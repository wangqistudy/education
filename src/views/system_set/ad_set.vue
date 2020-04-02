<!--
 * @Author: David
 * @Date: 2019-10-31 19:13:06
 * @LastEditTime: 2019-12-05 15:59:41
 * @LastEditors: Do not edit
 * @Description: 通用设置
 -->
<template>
  <div class="comment-set-wrap page-wrap">
      <div class="common-set  page-inner">
          <p class="set-header page-header">
              广告位设置
          </p>
          
          <div class="page-table">
              <el-table
              :data="tableData"
              header-row-class-name="headrow"
              header-cell-class-name="headrowcell"
              >
                <el-table-column
                prop="id"
                label="序号"
                header-align="center"
                align="center"  width="50px"
                >
                </el-table-column>

                <el-table-column
                label="类别"
                header-align="center"
                align="center"
                >
                  <template slot-scope="scope">
                    <span>{{scope.row.type|filterTypeName}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                prop="title"
                label="标题"
                header-align="center"
                align="center"
                >
                </el-table-column>
                <el-table-column
                label="图片"
                header-align="center"
                align="center"
                >
                  <template slot-scope="scope">
                      <div class="imgWrap img-item">
                          <img :src="scope.row.banner_url" alt="">
                          <p class="img-opt">
                              <span @click="handlePictureCardPreview(scope.row)">
                                <i class="el-icon-zoom-in"></i>
                              </span>
                          </p>
                      </div>
                  </template>
                </el-table-column>
                <el-table-column
                prop="dest_url"
                label="链接"
                header-align="center"
                align="center"
                >
                </el-table-column>
                <el-table-column
                label="操作"
                header-align="center"
                align="center"
                v-if="hasEditPermission"
                >

                  <template slot-scope="scope">
                      <el-button size="mini" type="primary" @click="handleEdit(scope.row)">
                        修改
                      </el-button>
                  </template>

                </el-table-column>
              </el-table>
          </div>
          
      </div>

      <!-- 修改面板 -->
      <el-dialog :visible.sync="showEdit" width="526px"  :close-on-click-modal="false" title ="修改信息">

          <el-form :model="formData" label-width="80px" :rules="formRule" ref="formData">
              <el-form-item label="标题：" prop="title">
                  <el-input
                  v-model="formData.title"
                  >

                  </el-input>
              </el-form-item>

              <el-form-item label="图片：" prop="banner_url">
                  <uploadImg
                    v-model="imgList"
                    desc="上传图片推荐尺寸：1920×220"
                    :actionUrl="`/api`+apiList.banner_upload"
                    :files="imgList"
                  >
                  </uploadImg>
              </el-form-item>

              <el-form-item label="链接" prop="dest_url" v-if="formData.type==1">
                  <el-input
                  v-model="formData.dest_url"
                  
                  
                  >
                    
                  </el-input>
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
import api from '@/utils/api'
import {apiList} from '@/utils/api'
export default {
    name:'adSet',
    components:{editorCom,uploadImg,filterCom},
    mixins:[pagination],
    data () {

      let validateTitle = (rule,value,cb) => {
          if (!value) {
            return cb(new Error('请填写标题'))
          }
          cb()
      }


      let validateBanner = (rule,value,cb) => {
          if (!value) {
            return cb(new Error('请上传图片'))
          }
          cb()
      }

      let validateDest = (rule,value,cb) => {
          if (this.formData.type!=1){
            return cb()
          }
          let  reg = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/
          
          if (!value) {
            return cb()
          }
          if (!reg.test(value)) {
            return cb(new Error('链接格式不正确'))
          }
          cb()
      }

      return {
        imgList:[],
        listApi:api.banner_list,
        formData:{
          title:'',
          banner_url:'',
          dest_url:'',
          id:'',
          created_at:'',
          updated_at:''
        },
        formRule:{
          title:[
            {validator:validateTitle}
          ],
          banner_url:[
            {validator:validateBanner}
          ],
          dest_url:[
            {validator:validateDest}
          ]
        },
        showEdit:false,
        apiList
      }
    },
    filters:{
      filterTypeName (type) {
        let dict = {'1':'首页banner图',
                  '2':'教师banner图',
                  '3':'新闻资讯',
                  '4':'关于我们'}
          return dict[type]
      }
    },
    mounted () {
        this.getList();
    },
    methods:{
        handleSub () {
          let banner_url = this.imgList[0]?this.imgList[0].url:''
          this.formData.banner_url = banner_url
          this.$refs.formData.validate(valid=>{
            if (valid) {
                let param = JSON.parse(JSON.stringify(this.formData))
                param.banner_url = banner_url;
                api.banner_save(param)
                .then(data=>{
                  this.showEdit = false;
                  this.getList()
                })
            }
          })
        },
        handlePictureCardPreview(file) {
            this.openPreview({src:file.banner_url})
        },
        handleEdit (item) {
            Object.keys(item).forEach(key=>{
              this.formData[key] = item[key]
              if (key=='banner_url') {
                  this.imgList = [{url:item[key]}]
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
    padding-top:13px;
    padding-bottom:13px;
    .page-inner{
      max-width:1200px;
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
</style>
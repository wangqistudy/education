<!--
 * @Author: David
 * @Date: 2019-10-31 19:13:06
 * @LastEditTime: 2019-12-04 16:09:30
 * @LastEditors: Do not edit
 * @Description: 小区设置
 -->
<template>
  <div class="comment-set-wrap page-wrap">
      <div class="common-set  page-inner">
          <p class="set-header page-header">
              角色设置
          </p>
          
          <div class="page-table">

              <div class="header-btn">
                <el-button icon="el-icon-plus" type="success" @click="handleEdit(null,'add')">新增</el-button>
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
                label="角色"
                header-align="center"
                align="center"
                prop="name"
                >
                 
                </el-table-column>

                <el-table-column
                label="是否为老师"
                header-align="center"
                align="center"
                prop="name"
                >
                  <template slot-scope="scope">
                      <span>
                        {{scope.row.is_teacher==1?'是':(scope.row.is_teacher===0?'否':'未设置')}}
                      </span>
                  </template>
                </el-table-column>
                <el-table-column
                prop="created_at"
                label="创建时间"
                header-align="center"
                align="center"
                >
                </el-table-column>

                <el-table-column
                label="操作"
                header-align="center"
                align="center"
                >

                  <template slot-scope="scope">
                      <el-button size="mini" type="primary" @click="handleEdit(scope.row,'edit')" :title="scope.row.is_super_admin==1?'超级管理员不可修改':''" :disabled="(scope.row.is_super_admin==1)">
                        修改
                      </el-button>
                      <el-button size="mini" type="default" @click="proxy_handleDelete(scope.row.id,'handleDelete')" :title="scope.row.is_super_admin==1?'超级管理员不可删除':''" :disabled="(scope.row.is_super_admin==1)">
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
      <el-dialog :visible.sync="showEdit" width="526px"  :close-on-click-modal="false" :title ="`${dialogType=='edit'?'修改':'新增'}信息`">

          <el-form :model="formData" label-width="100px" :rules="formRule" ref="formData">
              <div class="inline">
                <el-form-item label="角色名称：" prop="desc">
                    <el-input
                    v-model="formData.desc"
                    >

                    </el-input>
                </el-form-item>
                <el-form-item label="是否为老师：" prop="is_teacher">
                    <el-radio-group v-model="formData.is_teacher">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
              </div>
              

              <el-form-item label="选择权限：">
                  <el-tree
                    :data="roleConfig"
                    show-checkbox
                    accordion
                    node-key="id"
                    ref="tree"
                    highlight-current
                    @check="handleNodeClick"
                    :props="defaultProps">
                  </el-tree>

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
    name:'schoolSet',
    components:{editorCom,uploadImg,filterCom},
    mixins:[pagination],
    data () {

      let validateName = (rule,value,cb) => {
          
          if (!value) {
            return cb(new Error('请填信息'))
          }
          cb()
      }

      return {
        imgList:[],
        listApi:api.role_list,

        defaultProps:{
          children: 'children',
          label: 'desc'
        },
        dialogType:'edit',//edit 修改  add 新增
        formData:{
            id:'',
            desc:'',
            privilegeIds:[],
            is_teacher:''
        },
        formRule:{
          desc:[
            {validator:validateName}
          ]
        },
        showEdit:false,
        apiList,
        roleConfig:[]
      }
    },
    mounted () {
        this.getList();
        this.getConfig()
    },
    methods:{
        handleNodeClick (data,node,nodeVm) {
          let {checkedNodes,checkedKeys,halfCheckedNodes,halfCheckedKeys} = node
          if (data.desc=='查看') {
            if (checkedKeys.indexOf(data.id)<0) {
              data.parent_id&&this.$refs.tree.setChecked(data.parent_id,false,true);
            }
          }
        },
        handleDelete (id) {
          
          api.role_delete({id})
          .then(data=>{
            this.showEdit = false;
            this.getList()
          })
        },
        handleSub () {
          
          this.$refs.formData.validate(valid=>{
            if (valid) {
                let param = JSON.parse(JSON.stringify(this.formData))
                let nodes = this.$refs.tree.getCheckedNodes(false,true);
                let privilegeIds =  nodes.map(it=>it.id)
                privilegeIds = privilegeIds.join(',')
                param.privilegeIds = privilegeIds
                api.role_save(param)
                .then(data=>{
                  this.$appmessage({
                    type:'success',
                    message:data.message||'保存成功'
                  })
                  this.showEdit = false;
                  this.getList()
                })
            }
          })
        },
        getConfig () {
          api.role_config()
          .then(data=>{
            this.roleConfig = data.data;
          })
        },
        handlePictureCardPreview(file) {
            this.openPreview({src:file.thumbnail})
        },
        handleEdit (item,type) {
            this.dialogType = type
            if (type=='add') {
                
                this.formData = {
                  id:'',
                  desc:'',
                  privilegeIds:[],
                  is_teacher:''
                }
                this.showEdit = true;
                this.$nextTick(()=>{
                  this.$refs.tree.setCheckedNodes([]);
                })
                return
            }
            
            this.formData = {
              id:'',
              desc:'',
              privilegeIds:[],
              is_teacher:''
            }
            
            api.role_detail({id:item.id})
            .then(data=>{
              data = data.data;
              Object.keys(this.formData).forEach(key=>{
                this.$set(this.formData,key,data[key])
              })
              this.showEdit = true;
              this.$nextTick(()=>{
                let ids = this.getFilterIds(this.formData.privilegeIds);
                // //console.log(ids)
                this.$nextTick(()=>{
                  this.$refs.tree.setCheckedKeys(ids);
                })
              })  
            })
            
            
        },

        getFilterIds (ids) {
            let leafIds = []
            let step = (arr)=>{
              arr.forEach(item=>{
                if (item.children&&item.children.length>0) {
                  step(item.children)
                }else{
                  leafIds.push(item.id)
                }
              })
            }
            step(this.roleConfig);
            let finalIds = ids.filter(id=>{
              return leafIds.indexOf(id)>=0
            })
            return finalIds;
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
    .header-btn{
      margin-bottom:20px;
    }
    .inline{
      .el-form-item{
        display: inline-block;
      }
      .el-select{
        width: 185px;
      }
      .el-input-number{
        width: 185px;
      }
    }
</style>
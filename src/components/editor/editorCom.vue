<!--
 * @Author: David
 * @Date: 2019-11-01 09:28:03
 * @LastEditTime: 2019-11-14 16:13:42
 * @LastEditors: Do not edit
 * @Description: 富文本编辑器
 -->
<template>
  <div class="editor-wrap">
      <div class="editor-containt">
          <textarea name="content" :id="id" style="width:100%;height:300px;" ref="editor"></textarea>
      </div>
  </div>
</template>
<script>
import  'kindeditor/kindeditor-all.js'
import  'kindeditor/lang/zh-CN.js'
import  'kindeditor/themes/default/default.css'
import { getToken } from '../../utils/auth'

export default {
  name:'editorCom',
  model: {
    event: 'chantecontent'
  },
  props:{
    options:{
      type:Object,
      default () {
        return {
          
        }
      }
    }
  },
  mounted () {
    this.generateId();
    this.$nextTick(()=>{
      this.initEditor()
    })
  },
  activated () {
    this.$nextTick(()=>{
      this.initEditor()
    })
  },
  deactivated () {
    this.destoryEditor()
  },
  watch:{
    '$attrs.value':function (news) {
        
        if (this.$editor) {
          if (news === this.localValue){
            return;
          }
          this.$editor.html(news);
        }
        
        
    }
  },
  data () {
    return {
      id:'',
      localValue:''
    }
  },
  methods:{
    generateId () {
        let idStr = `appEditor_`+(new Date().getTime())+Math.ceil(Math.random()*10000);
        this.id = idStr;
    },
    destoryEditor () {
      if (this.$editor) {
        this.$editor.remove()
        this.$editor = null
      }
    },
    initEditor () {
        let that = this
        let token = getToken()
        let options = {
          uploadJson:'/api/v1/back/protocol/upload?token='+token,
          afterChange () {
            that.$edited = true
            let str = this.html()
            that.localValue = str;
            that.$emit('chantecontent',str)
          } 
        }
        options = Object.assign(options,this.options)
        if (!this.$editor) {
          this.$editor = KindEditor.create('#'+this.id,options)
          this.$editor.html(this.$attrs.value)
        }
    }
  }
}
</script>
<style lang="scss" scoped>
  .editor-wrap{
    width: 100%;
    .editor-containt{
      width:100%;
    }
  }
</style>
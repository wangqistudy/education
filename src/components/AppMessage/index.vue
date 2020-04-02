<!--
 * @Author: David
 * @Date: 2019-11-29 09:28:57
 * @LastEditTime: 2019-11-29 15:52:57
 * @LastEditors: Do not edit
 * @Description: 消息提醒
 -->
<template>
  <transition name="el-fade-in-linear">


    <div 
    v-if="visible"
    :class="[`app-message-${type}`,'app-message']"
    >
        <i :class="[type=='success'?'el-icon-success':type=='error'?`el-icon-circle-close`:type=='warning'?'el-icon-warning':'el-icon-info']">
          
        </i>

        <span class="message">
          {{message}}
        </span>

        <span class="el-icon-close close" @click="visible=false"></span>
      
    </div>
  </transition>
</template>
<script>
export default {
  name:'appMessage',
  data () {
    return {
      visible:false,
      closed:false,
      timeout:2000,
      message:'',
      type:'success'
    }
  },
  watch:{
    closed(newVal) {
        if (newVal) {
          this.visible = false;
        }
      }
  },
  mounted () {
    this.startTimer();
  },
  methods:{
    close() {
      this.closed = true;
      if (typeof this.onClose === 'function') {
        this.onClose(this);
      }
    },
    startTimer() {
        if (this.timeout > 0) {
          this.timer = setTimeout(() => {
            if (!this.closed) {
              this.close();
            }
          }, this.timeout);
        }
      },
      
  }
}
</script>
<style lang="scss" scoped>
  .app-message{
    width: 200px;
    padding:10px 10px;
    
    position: fixed;
    top:30%;
    left:50%;
    z-index: 9999;
    transform: translateX(-50%) translateY(-50%);
    border-radius:5px;
    border:1px solid #e1f3d8;
    display: flex;
    flex-direction: column;
    align-items: center;
    i{
      font-size:40px;
    }
    .message{
      margin-top:15px;
      font-size:14px;
      line-height: 18px;
      text-align: center;
    }
    &.app-message-success{
      color:#67c23a;
      border-color:#e1f3d8;
      background-color:#f0f9eb;
    }
    &.app-message-error{
      color:#F56C6C;
      background-color: #fef0f0;
      border-color: #fde2e2;
    }
    &.app-message-warning{
      color:#E6A23C;
      background-color: #fdf6ec;
      border-color: #faecd8;
    }
    &.app-message-info{
      color:#909399;
      background-color: #edf2fc;
      border-color:#ebeef5;
    }
    .close{
      position: absolute;
      top:10px;
      right:10px;
      cursor: pointer;
    }
  }
</style>
<!--
 * @Author: David
 * @Date: 2019-07-29 09:08:17
 * @LastEditTime: 2019-11-18 09:58:01
 * @LastEditors: Do not edit
 * @Description: 
 -->
<template>
    <div id="Login">
        <!--<img src="~static/img/login_bg.png" class="loginBg" alt="">-->
        <div class="main-content">
            <h1 class="login-welcome">你好! 欢迎回来</h1>
            <div class="content">
              
                <div class="login">
                    <div class="title">少儿编程管理后台</div>
                    <div class="login-form">
                        <p class="login-title">账号登录</p>
                        <el-form :model="ruleForm" :rules="rules" ref="ruleForm"
                                label-width="0px" class="demo-ruleForm">
                            <el-form-item prop="login"
                            
                            >
                                <el-input size="large"
                                          v-model="ruleForm.login"
                                          placeholder="用户名"
                                          prefix-icon="el-icon-edit-outline"
                                          >
                                </el-input>
                                
                            </el-form-item>
                            <el-form-item prop="password">
                                <el-input size="large"
                                          type="password"
                                          v-model="ruleForm.password"
                                          placeholder="密码"
                                          prefix-icon="el-icon-time"
                                          ></el-input>
                                
                            </el-form-item>
                            <el-form-item prop="code" class="codeFormItem">
                                  <el-input placeholder="请输入图片验证码" v-model="ruleForm.captcha" style="width:172px;"
                                  prefix-icon="el-icon-time"
                                  size="large"
                                  >
                                  </el-input>
                                  <div class="imgCode" @click="getCodeImg">
                                    <img :src="codeImg" alt="">
                                  </div>
                              </el-form-item>
                            <div class="form-footer">
                                <el-checkbox class="checkBtn" v-model="checked">记住密码</el-checkbox>
                            </div>
                            <div class="login-btn">
                                <el-button :loading="loginStatus.loading"
                                          size="large"
                                          type="primary"
                                          class="btn"
                                          @click="doLogin">{{loginStatus.title}}
                                </el-button>
                            </div>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
    
    
    import {mapState, mapActions,mapMutations} from "vuex"
    import {getKey,setKey,removeKey} from '@/utils/cookieStorage'
    import api from '@/utils/api'
    export default {
        data: function () {
            return {
                codeImg:'',
                ruleForm: {
                    login: "",
                    password: "",
                    captcha: ''
                },
                loginStatus: {
                    loading: false,
                    title: '登 录'
                },
                myCaptcha: {},
                checked: false,
                rules: {
                    login: [
                        {required: true, message: '请输入登录账号', trigger: 'blur'},
                        // {min: 5, message: '长度不得小于 5 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        // { pattern: /^[A-Z](?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]*$/, message: '密码以大写字母开头,且小写字母和数字混合,不得包含特殊字条', trigger: 'blur'},
                        {min: 6, max: 16, message: '密码必需是6-16位', trigger: 'blur'},
                    ],
                    captcha: [
                        {required: true, message: '请填写验证码', trigger: 'blur'},
                    ]
                },
            }
        },
        computed: {
            ...mapState({})
        },
        mounted() {
            let login = getKey('xinyidai_back_login')
            let password = getKey('xinyidai_back_password')
            if (login&&password) {
              this.checked = true;
              this.ruleForm.login = login
              this.ruleForm.password = password
            }

            this.getCodeImg();
        },
        methods: {
            ...mapActions({
                login:'user/LOGIN'
            }),

            getCodeImg (){
                api.captcha_get()
                .then(data=>{
                    this.codeImg = data.data.captcha;
                    this.captchaUUid = data.data.uuid;
                })
            },

            // 请求登录接口
            doLogin() {
                this.$refs.ruleForm.validate((valid)=>{
                  if (valid) {
                    let {login,password,captcha} = this.ruleForm
                    let uuid = this.captchaUUid
                    this.loginStatus.loading = true;
                    this.loginStatus.title = '正在登录....';
                    this.login({
                      param:{login,password,captcha,uuid},
                      cb:(data)=>{
                        //console.log(data);
                        if (this.checked){
                          setKey('xinyidai_back_login',login)
                          setKey('xinyidai_back_password',password)
                        }
                        if (this.$route.query.redirect){
                            this.$router.push(this.$route.query.redirect)    
                        }else{
                            this.$router.push('/dashboard')
                        }
                        
                        this.loginStatus.loading = false;
                        this.loginStatus.title = '登录';
                      },
                      fb:()=>{
                        this.loginStatus.loading = false;
                        this.loginStatus.title = '登录';
                        this.getCodeImg()
                      }
                    })
                  }
                })
            }
        }

    }
</script>

<style lang="scss" scoped>
    #Login {
        // background-color: $mainBg;
        position: relative;
        width: 100%;
        height: 100%;
        background: url("~@/assets/loginBg.jpg") no-repeat center center;
        background-size: cover;

        .codeFormItem{
            /deep/.el-form-item__content{
              display:flex;
              
            }
            .imgCode{
              width:118px;
              height:40px;
              display: inline-block;
              border-radius: 4px;
              border: 1px solid #DCDFE6;
              margin-left:10px;
              img{
                width:100%;
                height:100%;
              }
            }
          }

        .main-content{
          width: 600px;
          position: absolute;
          top:50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
          .login-welcome{
            font-size:72px;
            text-align: center;
            color:#fff;
            margin-bottom: 44px;
            font-weight: 400;
          }
        }
        .content {
            box-sizing: border-box;
            width: 434px;
            margin:0 auto;
            .login {
                height: 100%;
                width: 100%;
                box-sizing: border-box;
                .title {
                    font-size: 38px;
                    text-align: center;
                    margin: 30px 0;
                    color: #fff;
                }
                .login-form {
                    width: 100%;
                    padding: 40px 67px;
                    margin: 0 auto;
                    box-sizing: border-box;
                    background: #fff;
                    box-shadow: 0px 5px 17px 3px rgba(0, 0, 0, 0.5);
                    border-radius: 10px;
                    .login-title{
                      font-size:24px;
                      color:#13a4ed;
                      margin-bottom:20px;
                    }
                    .el-input__inner {
                        height: 48px;
                    }
                    .el-form-item__content {
                        position: relative;
                        .iconfonts {
                            position: absolute;
                            font-size: 22px;
                            left: 10px;
                            top: 12px;
                            z-index: 2;
                            color: #999;
                        }
                    }
                    .el-input {
                        input {
                            padding-left: 40px;
                        }
                    }
                    .form-footer {
                        overflow: hidden;
                        .checkBtn {
                            float: left;
                        }
                        a {
                            float: right;
                            font-size: 14px;
                            &:hover {
                                color: red;
                                text-decoration: underline;
                            }
                        }
                    }
                }
                .login-btn .btn {
                    width: 300px;
                    height: 48px;
                    margin-top: 30px;
                }
            }
        }
    }
</style>
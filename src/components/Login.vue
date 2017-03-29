<template>
  <transition name="fade">
    <div class="loginwrapper" id="loginwrapper">
      <div class="banner"></div> 
      <div class="login">
          <meta charset="utf-8">
          <div class="user">
            <i></i><input type="text" v-model="account" placeholder="请输入手机号/邮箱">
          </div>
          <div class="pass">
            <i></i><input type="password" v-model="password" placeholder="请输入密码">
          </div>
          <div class="forget">
            <span @click="forget">忘记密码?</span>
          </div>
          <button @click="login">登录</button>
      </div>
      <loading v-show="unsuc"></loading>
    </div>
</transition>
</template>
<script>
  import router from '../router';
  import Content from './Content';
  import Nopartner from './nopartner';
  import Agreement from './Agreement';
  import Md5 from 'md5';
  export default{
    data(){
      return {
        account:'',
        password:'',
        unsuc:false
      }
    },
    mounted(){
      var oLogin = document.getElementById('loginwrapper');
      let ht=document.documentElement.clientHeight || document.body.clientHeight;
      oLogin.style.height=ht+'px';
    },
    methods:{
      login(){
        if(!this.account){
         this.remind('请输入用户名')
        }else if(!this.password){
          this.remind('请输入密码')
        }else{
          let _this = this;
          this.unsuc=true;
          $.ajax({
            method:'post',
            url:_this.domain+'/agent/login',
            data:{
              username:_this.account,
              password:Md5(_this.password)
            },
            success:function(json){
              console.log(json)
              if(json.errno==0){
                _this.unsuc=false;
                // 登录成功
                localStorage.login=1;
                localStorage.auth=json.authcode;
                localStorage.name=json.realName;
                router.push({path:'/content',component:Content});
              }else if(json.errno==3){
                 _this.unsuc=false;
                _this.remind('手机号不存在');
              }else if(json.errno==4){
                 _this.unsuc=false;
                _this.remind('用户名或密码错误')
              }else if(json.errno==5){
                 _this.unsuc=false;
                _this.remind('用户被锁定')
              }else if(json.errno==6){
                 _this.unsuc=false;
                _this.remind('您还不是代理人，请前往官网申请')
              }else if(json.errno==7){
                // 还没有签订协议
                localStorage.setItem('_tempToken',json.tempToken)
                router.push({path:'/agreement',component:Agreement})
              }
            }
          })
        }
        
      },
      forget(){
        router.push('/forgetPwd')
      }
    }
    
  }

</script>
<style scoped>
  .loginwrapper{
    box-sizing:border-box;
    
  }
  .banner{
    width: 100%;
    height: 8rem;
    background: url(../assets/banner.png) no-repeat;
    background-size: 100%;
  }
  .login{
    width: 17rem;
    margin: 0 auto;
    padding:10px;
  }
  .login .user{
    position: relative; 
    margin-bottom:10px;
    height: 2rem;
    line-height: 2rem;
  }
  .login .user i{
    position: absolute;
    left: 0rem;
    top: .5rem;
    width: 1rem;
    height: 1.2rem;
    background: url(../assets/user.png) no-repeat;
    background-size: contain;
  }
  .login .pass{
    position: relative;
    margin-bottom:10px;
    height: 2rem;
    line-height: 2rem;
  }
  .login .pass i{
    position: absolute;
    left: 0;
    top: .5rem;
    width: 1rem;
    height: 1.5rem;
    background: url(../assets/password.png) no-repeat;
    background-size: contain;
  }
  .login input{
    border: none;
    display: inline-block;
    width: calc(100% - 40px);
    height: 2rem;
    background: #fff;
    font-size: .7rem;
    outline: none;
    text-indent: 1em;
    border-bottom: 1px solid #ccc;
    margin-left: 40px;
    border-radius: 0;
  }
  .forget{
    text-align: right;
    margin-bottom: 10px;
  }
  .forget span{
    color: #ccc;
  }
  input:-webkit-autofill {
     -webkit-box-shadow: 0 0 0px 1000px white inset;
  }
  button{
    width: 100%;
    height: 2rem;
    line-height: 2rem;
    font-size: .8rem;
    border: none;
    outline: none;
    background: #8ae088;
    color: #fff;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0
  }
</style>
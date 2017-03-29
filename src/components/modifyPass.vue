<template>
  <transition name="fade">
    <div class="modifyPass">
      <h3>修改密码</h3>
      <div class="modifyBox">
        <div class="oldPass">
          <input type="password" v-model="oldPass" placeholder="请输入原密码">
        </div>
        <div class="newPass">
          <input type="password" v-model="newPass" placeholder="请输入新密码">
        </div>
        <div class="confirmPass">
          <input type="password" v-model="confirmPass" placeholder="请确认新密码">
        </div>
      </div>
      <a href="javascript:;" class="submit" @click="submit">确认修改</a>
    </div> 
</transition>
</template>
<script>
  import Md5 from 'md5'
  import router from '../router.js'
  var auth;
  export default{
    data(){
      return{
        oldPass:'',
        newPass:'',
        confirmPass:''
      }
    },
    methods:{
      submit(){
        var _this= this;
        if(this.oldPass=='' || this.newPass=='' || this.confirmPass==''){
          _this.remind('请填写密码');
          return;
        }
        if(this.newPass!=this.confirmPass){
          _this.remind('两次填写的新密码不一致');
          return;
        }
        auth = localStorage.getItem('auth');
        $.ajax({
          type:'post',
          dataType:'json',
          url:_this.domain+'/agent/modifyPassword',
          data:{
            authcode:auth,
            oldPassword:Md5(_this.oldPass),
            newPassword:Md5(_this.newPass)
          },
          success:function(json){
            if(json.errno==0){
              router.push('/content/mine/1')
            }else if(json.errno==1){
              _this.remind('原密码错误');
            }
            
          }
        })
      }
     
    }
  }
</script>
<style scoped>
  .fade-enter-active {
    transition: opacity .3s
  }
  .fade-leave-active{
    transition: opacity 0s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0
  }
  .modifyPass{
    height: 100%;
    background: #f5f5f5;
  }
  h3{
    height: 2.5rem;
    line-height: 2.5rem;
    text-align: center;
    font-size: 18px;
    font-weight: normal;
    color: #494d52;
    border-bottom: 1px solid #ccc;
    margin-bottom: .75rem;
  }
  input{
    outline: none;
    border: none;
  }
  .modifyBox{
    border-radius: 5px 5px 0 0;
  }
  .modifyBox span{
    font-size: 16px;
    display: inline-block;
    width: 3.5rem;
    padding-left: 1rem;
    color: #494d52;
    border-right: 2px solid #666;
  }
  .modifyBox input{
    margin-top: .5rem;
    height: 2.2rem;
    width: calc(100% - 20px);
    line-height: 1.4rem;
    font-size: 14px;
    color: #494d52;
    padding-left: 20px;
  }
  .modifyBox .confirmspan{
    margin-left: -0.5rem;
    padding-right: 0.5rem;
    white-space: nowrap;
  }
  .submit{
    margin: .5rem;
    margin-top: 1.25rem;
    text-align: center;
    background-color: #8ae088;
    color: white;
    display: block;
    padding-top: 0.8rem;
    padding-bottom: 0.8rem;
    font-weight: bold;
    font-size: 16px;
  }
</style>


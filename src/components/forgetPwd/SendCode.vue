<template>
  <div>
    <div class="header" >
      <i @click="back"></i>
      <h3>密码找回</h3>
    </div>
    <div class="content">
      <div v-show="sendSMS">
        <div class="tit">我们已将短信验证码发送至手机{{mobile | telFilter}}</div>  
        <div class="telBox">
          <span class="tel">短信验证码</span>
          <input type="text" class="telInput" v-model="code">
          <button class="repost" :disabled="repost" @click="repostcode">重新发送({{time}})</button>
        </div>
        <button @click="next">下一步</button>
      </div>
      <!-- 绑定手机号的公众号列表 -->
      <div class="publiceList" v-show="pubBox">
          <div class="tit">该手机号共关联 {{pubItems.length}} 个机构／项目组账号</div>
          <ul class="publist">
              <li v-for="(pubItme,index) in pubItems" @click="pubclick(index)" class="pubItem">
                  <img :src="pubItme.avatar"><span>{{pubItme.realName}}</span>
              </li>
          </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import router from '../../router';
  export default{
    data(){
      return{
        mobile:'',
        code:'',
        time:60,
        repost:true,
        pubBox:false,
        pubItems:''
      }
    },
    computed:{
        sendSMS:function(){
          return !this.pubBox
        }
    },
    mounted(){
      var _this=this;
      this.mobile=localStorage.getItem('mobile');
      var clear=null;
      clear=setInterval(function(){
        _this.time--;
        if(_this.time<=0){
          _this.repost=false;
          clearInterval(clear);
        }
      },1000)
    },
    methods:{
      back(){
        router.go(-1)
      },
      // 重新发送验证码
      repostcode(){
        // 按钮不可以重复点击
        this.repost=true;
        var _this=this;
        // 取图片验证码
        var captcha=localStorage.getItem('captcha');
        // 取图片令牌
        var imageToken=localStorage.getItem('imageToken');
        $.ajax({
            type:'post',
            dataType:'json',
            url:_this.domain+'/agent/sendSMS',
            data:{
                captcha:captcha,
                mobile:_this.mobile,
                imageToken:imageToken
            },
            success:function(json){
                if(json.status=='suc'){
                  localStorage.setItem('tempAccessToken',json.tempAccessToken);
                    _this.time=60;
                    var clear=null;
                    clear=setInterval(function(){
                      _this.time--;
                      if(_this.time<=0){
                        _this.repost=false;
                        clearInterval(clear);
                      }
                    },1000);
                }else{
                  _this.remind('验证码发送失败，请重试');
                  _this.repost=false;
                }
                
            }
        })
      },
      // 校验个人或者机构验证码通过
      next(){
        var _this=this;
        // 手机号
        // 发送短信验证码时返回的tempAccessToken;
        var tempAccessToken=localStorage.getItem('tempAccessToken')
        if(_this.$route.params.type==1){
          // 个人
          $.ajax({
            type:'post',
            dataType:'json',
              url:_this.domain+'/agent/validateCode',
            data:{
                type:1,
                mobile:_this.mobile,
                tempAccessToken:tempAccessToken,
                verifyCode:_this.code,
            },
            success:function(json){
                if(json.errno==0){
                    localStorage.setItem('auth',json.data.authcode);
                    router.push('/forgetPwd/setNewPwd');
                }else if(json.errno==20126){
                  _this.remind('短信验证码错误');
                }else{
                  _this.remind('系统错误，请重试',function(){
                    location.reload(true);
                  })
                }
                
            }
          })
        }else{
          // 机构
          $.ajax({
            type:'post',
            dataType:'json',
              url:_this.domain+'/agent/validateCode',
            data:{
                type:2,
                mobile:_this.mobile,
                tempAccessToken:tempAccessToken,
                verifyCode:_this.code
            },
            success:function(json){
                if(json.errno==0){
                  _this.pubBox=true;
                  _this.pubItems=json.data;
                  // router.push('/forgetPwd/pubItems')
                }else if(json.errno==20126){
                  _this.remind('短信验证码错误')
                }else{
                  _this.remind('系统错误，请重试',function(){
                    location.reload(true);
                  })
                }
                
            }
          })
        }
      },
      pubclick(index){
        var _this=this;
        localStorage.setItem('auth',_this.pubItems[index].authcode);
        router.push('/forgetPwd/setNewPwd');
      }
    }
  }
</script>
<style scoped>
  .header{
    position: relative;
  }
  .header i{
    position: absolute;
    width: 1rem;
    height: 1rem;
    left: .5rem;
    top: .5rem;
    background: url(../../assets/left2.png) no-repeat;
    background-size: 100%;
  }
  h3{
    height: 2rem;
    line-height: 2rem;
    text-align: left;
    text-indent: 3em;
    background: #191919;
    color: #fff;
    font-size: 14px;
  }
  .content{
    background: #f0f0f0;
  }
  .content .tit{
    margin-left: .5rem;
    height: 3rem;
    line-height: 3rem;
    font-size: 14px;
  }
  .telBox{
    height: 2rem;
    line-height: 2rem;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    background: #fff;
  }
  .telBox .tel{
    padding:0 .5rem;
    border-right: 1px solid #999;
    font-size: 14px;
  }
  .telBox .telInput{
    border: none;
    height: .8rem;
    width: 8rem;
    outline: none;
    font-size: 14px;
  }
  .telBox .repost{
    display: inline-block;
    margin: 0;
    width: 4.8rem;
    height: 1rem;
    padding-left: .5rem;
    border: 0;
    background: transparent;
    border-left: 1px solid #999;
  }
  button{
    display: block;
    margin: 3rem auto 0;
    width: 17rem;
    height: 2rem;
    outline: none;
    background: #fff;
    border: 1px solid #ccc;
    font-size: 14px;
  }
  .publiceList .tit{
      height: 2.5rem;
      line-height: 2.5rem;
  }
  .publiceList .publist li{
      padding:.5rem;
      height: 1.5rem;
      border-bottom: 1px solid #ccc;
  }
  .publiceList .publist li img{
      width: 1.5rem;
      margin-left: .5rem;
      border-radius: 50%;
  }
  .publiceList .publist li span{
      margin-left: .5rem;
      height: 1.5rem;
      line-height: 1.5rem;
  }
  .pubItem{
    background: #fff;
  }
</style>


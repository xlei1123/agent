<template>
  <div>
    <div class="header" >
      <i @click="back"></i>
      <h3>密码找回</h3>
    </div>
    <div class="content">
      <div class="tit" v-if="$route.params.type==1">个人/师资用户密码找回</div>  
      <div class="tit" v-else-if="$route.params.type==2">公众号／项目组用户密码找回</div> 
      <div class="telBox">
        <span class="tel">手机号</span>
        <input type="text" class="telInput" v-model="tel">
      </div> 
      <button @click="next">下一步</button>
      <div class="imgbox" id="imgbox" v-show="imgbox">
          <div class="dialog">
              <div class="inputbox">
                  <input v-model="codeimg" class="codeimg"><img :src="srcCode" @click="changeImg">
              </div>
              <div class="cannot">
                  <span class="cancel" @click="cancel">取消</span>
                  <span class="confirm" @click="confirm">确定</span>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
  import router from '../../router';
  export default{
    data(){
      return{
        imgbox:false,
        tel:'',
        codeimg:'',
        srcCode:''
      }
    },
    methods:{
      back(){
        router.go(-1)
      },
      next(){
        // 首先判断手机号是否存在
        let _this = this;
        let option=_this.$route.params.type;
        $.ajax({
          method:'post',
          url:_this.domain+'/agent/validateMobile',
          data:{
            mobile:_this.tel,
            type:option
          },
          success:function(json){
            console.log(json)
            if(json.errno==0){
              _this.imgbox=true;
              // 手机号存在的情况下获取验证码
              $.ajax({
                method:'GET',
                url:_this.domain+'/agent/captcha',
                data:{
                  
                },
                success:function(json){
                    // 验证码获取成功
                    _this.srcCode=json.data;
                    localStorage.setItem('mobile',_this.tel);      //存手机号
                    localStorage.setItem('imageToken',json.imageToken)   //存图片令牌
                }
              })
            }else if(json.errno==1){
              // 手机号不存在
              _this.remind('手机号不存在');
            }
          }
        })
      },
      changeImg(){
        var _this=this;
        $.ajax({
          method:'GET',
          url:_this.domain+'/agent/captcha',
          data:{
            
          },
          success:function(json){
              // 验证码获取成功
              _this.srcCode=json.data;
              // localStorage.setItem('mobile',_this.tel);      // 手机号已经存过 此处无需再存手机号
              localStorage.setItem('imageToken',json.imageToken)   //存图片令牌
          }
        })
      },
      // 点击验证码的确定按钮 发送手机验证码；
      confirm(){
        let _this=this;
        var imageToken=localStorage.getItem('imageToken')
        $.ajax({
          method:'post',
          url:_this.domain+'/agent/sendSMS',
          data:{
            captcha:_this.codeimg,
            mobile:_this.tel,
            imageToken:imageToken
          },
          success:function(json){
            // console.log(json)
            if(json.status=="suc"){
              // 验证码获取成功
              localStorage.setItem('captcha',_this.codeimg);      //存图片验证码
              localStorage.setItem('tempAccessToken',json.tempAccessToken);      //存tempAccessToken
              _this.imgbox=false;
              if(_this.$route.params.type==1){
                router.push('/forgetPwd/sendCode/1');
              }else{
                router.push('/forgetPwd/sendCode/2');
              }
            }else if(json.errno==1){
              _this.remind('图片验证码错误');
            }else{
              _this.remind('短信验证码发送失败，请重试',function(){
              _this.imgbox=false;
              });
            }
          }
        })
      },
      cancel(){
        this.imgbox=false;
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
  .header h3{
    height: 2rem;
    line-height: 2rem;
    text-align: left;
    text-indent: 3em;
    background: #191919;
    color: #fff;
    font-size: 14px;
  }
  .tit{
    height: 3rem;
    line-height: 3rem;
    text-indent: 2em;
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
    width: 14rem;
    outline: none;
    font-size: 14px;
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
 .imgbox{
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background: rgba(0,0,0,.2);

  }
  .imgbox .dialog{
      position: absolute;
      top: 50%;
      left: 50%;
      width: 260px;
      height: 110px;
      margin-top:-55px;
      margin-left: -130px;
      background: #fff;
      border-radius: 10px;
  }
  .imgbox .dialog .inputbox{
      margin: 10px;
      border: 1px solid #ccc;
      height: 40px;
  }
  .imgbox .dialog img{
      margin-top: 5px;
      width: 80px;
      height: 30px;
      margin-right: 10px;
  }
  .imgbox .dialog .codeimg{
      display: inline-block;
      width: 140px;
      height: 40px;
      border: none;
      padding:0;
      outline: none;
      font-size: 14px;
      text-indent: 1em;
  }
  .imgbox .dialog .confirm{
      position: absolute;
      bottom: 10px;
      right: 10px;
      width: 115px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-top: 1px solid #ccc;
      background: #197EEE;
      color: #fff;
      font-size: 14px;
  }
  .imgbox .dialog .cancel{
      position: absolute;
      bottom: 10px;
      left: 10px;
      width: 115px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-top: 1px solid #ccc;
      background: #ccc;
      font-size: 14px;
  }
</style>


<template>
  <transition name="fade">
    <div>
      <div class="header" >
        <i @click="back"></i>
        <h3>添加银行卡</h3>
      </div>
      <div class="con">
        <p>请填写您的提现银行卡信息</p>
        
        <p>
          <span>持&nbsp;卡&nbsp;人:</span><input type="text" placeholder="持卡人姓名" v-model="bank.cardName" @blur="getCardName">
        </p>
        <p>
          <span>银行卡号:</span><input type="text" placeholder="银行卡号" v-model="bank.cardNo" @blur="getCardNo">
        </p>
        <p v-show="tip" class="tip">*卡号有误</p>
        <p @click="secBank">
          <span>开户银行:</span><span>{{bank.Name}}</span >
        </p>
        <p v-show="gongshang" @click="secCity">
          <span>开户城市:</span><span>{{bank.city}}</span>
        </p>
        <p v-show="gongshang" @click="secBranch">
          <span>开户支行:</span><span>{{bank.cardSubBranch}}</span>
        </p>
        <button @click="next" class="next" :disabled="notClick" :class="{noactive:notClick}">下一步</button>
      </div>
      <!-- 验证短信验证码 -->
      <transition name="telBox" mode="out-in">
        <div class="telBox" v-show="telBox">
          <div class="dialog">
            <div class="tit">验证手机号 <i @click="close"></i></div>
            <div class="telCon">
              <p>已发送验证码至您的联系手机{{$route.params.tel}}</p>
              <div>
                <input type="text" v-model="verifyCode"> <button :disabled="nobtn" @click="resend">重新获取还剩<br>（{{time}}秒）</button>
              </div>
            </div>
            <button @click="testCode" class="over">完成</button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>
<script>
  import router from '../../router';
  export default{
    data(){
      return {
        bank:{Name:'',cardName:'',cardNo:'',city:'',cardSubBranch:''},
        notClick:true,
        telBox:false,
        tempAccessToken:'',
        verifyCode:'',
        nobtn:true,
        time:60,
        gongshang:true,
        tip:false
      }
    },
    methods:{
      back(){
        router.go(-1)
      },
      secCity(){
        router.push('/public/secCity')
      },
      secBank(){
        router.push('/postal/secBank')
      },
      secBranch(){
        if(this.bank.Name&&this.bank.city){
          router.push('/postal/subBranch')
        }else{
          this.remind('请填写开户银行和开户城市')
        }
        
      },
      getCardName(){
        let _this=this;
        localStorage.setItem('cardName',_this.bank.cardName)
      },
      getCardNo(){
        let _this=this;
        $.ajax({
          method:'POST',
          url:_this.domain+'/agent/cardName',
          data:{
            cardNo:_this.bank.cardNo
          },
          success:function(json){
              localStorage.setItem('cardNo',_this.bank.cardNo);
              if(json.errno==1){
                localStorage.setItem('cardTip',true)
                _this.tip=true;
              }else if(json.errno==0){
                localStorage.removeItem('cardTip')
                _this.tip=false;
              }
              
          }

        })
        
      },
      next(){
        var authcode=localStorage.getItem('auth');
        var _this=this;        
          // 发送手机验证码
          $.ajax({
            method:'post',
            url:_this.domain+'/agent/sendSMS',
            data:{
              authcode:authcode
            },
            success:function(json){
              // console.log(json)
              if(json.status=="suc"){
                // 验证码获取成功
                _this.tempAccessToken=json.tempAccessToken;
                _this.telBox=true;
                _this.time=60;
                _this.verifyCode='';
                // 倒计时开始
                var clear=setInterval(function(){
                  _this.time--;
                  if(_this.time<=0){
                    _this.nobtn=false;
                    _this.time=0;
                    clearInterval(clear)
                  }
                },1000)
              }else{
                _this.remind('短信验证码发送失败，请重试');
                _this.nobtn=false;
              }
            },
            error:function(){
              _this.nobtn=false;
            }
          })
      },
      resend(){
        this.nobtn=true;
        var _this=this;
        var authcode=localStorage.getItem('auth');
        $.ajax({
          method:'POST',
          url:_this.domain+'/agent/sendSMS',
          data:{
            authcode:authcode
          },
          success:function(json){
            if(json.status=="suc"){
              // 验证码获取成功
              _this.time=60;
              _this.tempAccessToken=json.tempAccessToken;
              _this.telBox=true;
              // 倒计时开始
              var clear=setInterval(function(){
                _this.time--;
                if(_this.time<=0){
                  _this.nobtn=false;
                  _this.time=0;
                  clearInterval(clear)
                }
              },1000)
            }else{
              _this.remind('短信验证码发送失败，请重试');
              _this.nobtn=false;
            }
          },
          error:function(){
            _this.nobtn=false;
          }
        })
      },
      testCode(){            //校验绑卡信息
        var _this=this;
        var authcode=localStorage.getItem('auth');
        $.ajax({
          method:'POST',
          url:_this.domain+'/agent/saveCard',
          data:{
            authcode:authcode,
            tempAccessToken:_this.tempAccessToken,
            verifyCode:_this.verifyCode,
            cardNo:_this.bank.cardNo,
            realName:_this.bank.cardName,
            cardName:_this.bank.Name,
            cardCity:_this.bank.city,
            cardSubBranch:_this.bank.cardSubBranch
          },
          success:function(json){
            if(json.errno==0){
              _this.remind('银行卡添加成功',function(){
                localStorage.removeItem('cardNo');            //卡号
                localStorage.removeItem('cardName');          //姓名
                localStorage.removeItem('addBank');          //银行
                localStorage.removeItem('addbankcity');      //城市
                localStorage.removeItem('branch');           //支行
                router.push('/postal/postalcon'); 
              })
            }else if(json.errno==1){
              _this.remind('用户不存在');
            }else if(json.errno==2){
              _this.remind('该卡号已经存在');
            }else if(json.errno==3){
              _this.remind('银行卡卡号格式不正确',function(){
                _this.telBox=false;
              });
            }else if(json.errno==20126){
              _this.remind('短信验证码有误');
            }else if(json.errno==4){
              _this.remind('银行卡号与姓名不符',function(){
                _this.telBox=false;
              });
            }else{
              _this.remind('系统错误，请重试',function(){
                localStorage.removeItem('cardNo');
                localStorage.removeItem('cardName');
                localStorage.removeItem('addBank');
                localStorage.removeItem('addbankcity');
                localStorage.removeItem('branch');
                router.push('/postal/postalcon')
              })
            }
          }
        })
        
      },
      close(){
        this.telBox=false;
      }
    },
    watch:{
      bank:{
        handler(curVal,oldVal){
          if(curVal.Name=="中国工商银行"){
            this.gongshang=false;
            if(curVal.Name&&curVal.cardName&&curVal.cardNo){
              this.notClick=false;
            }else{
              this.notClick=true;
            }
          }else{
            if(curVal.Name&&curVal.cardName&&curVal.cardNo&&curVal.city&&curVal.cardSubBranch&&(!this.tip)){
              this.notClick=false;
            }else{
              this.notClick=true;
            };
          }
        },
        deep:true
      },
      tip:{
        handler(curVal,oldVal){
          if(curVal==false){
            this.notClick=false;
          }else{
            this.notClick=true;
          }
        }
      }
    },
    mounted(){
      if(localStorage.getItem('cardNo')){
        this.bank.cardNo=localStorage.getItem('cardNo')
      }
      if(localStorage.getItem('cardName')){
        this.bank.cardName=localStorage.getItem('cardName');
      }if(localStorage.getItem('cardTip')){
        this.tip=true;
      }
      this.bank.Name=localStorage.getItem('addBank');
      this.bank.city=localStorage.getItem('addbankcity');
      this.bank.cardSubBranch=localStorage.getItem('branch');
    }
  }

</script>
<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0
  }
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
  .con p{
    /*height: 2rem;*/
    line-height: 2rem;
    padding-left: .5rem;
    font-size: 16px;
    background: #fff;
    border-bottom: 1px solid #f0f0f0;
  }
  .con p.tip{
    color: red;
    font-size: 14px;
  }
  .con p:nth-child(1){
    background: #f0f0f0;
  }
  .con p span{
    font-size: 16px;
  }
  .con p span:nth-child(2){
    display: inline-block;
    min-width: 10rem;
    height: 2rem;
    vertical-align: bottom;
    margin-left: .5rem;
  }
  .con p input{
    border: none;
    outline: none;
    margin-left: .5rem;
    font-size: 14px;
    width: 14rem;
  }
  .con .next{
    display: block;
    margin: 1rem auto;
    width: 17rem;
    height: 2rem;
    border: none;
    background: #8ae088;
    font-size: 16px;
    color: #fff;
    outline: none;
  }
  .noactive{
    opacity: .5;
  }
  /*手机验证码*/
  .telBox-enter-active, .telBox-leave-active {
    transition: all .5s;
  }
  .telBox-enter, .telBox-leave-active {
    opacity: 0;
    transform: translateY(-100px);
  }
  .telBox{
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: rgba(0,0,0,.2);
  }
  .telBox .dialog{
      position: absolute;
      top: 50%;
      left: 50%;
      width: 17rem;
      height: 10rem;
      margin-top:-10rem;
      margin-left: -9rem;
      background: #fff;
      border-radius: 10px;
      padding: .5rem;
  }
  .telBox .tit{
    position: relative;
    height: 2.5rem;
    line-height: 2.5rem;
    font-size: .75rem;
    text-align: center;
  }
  .telBox .tit i{
    position: absolute;
    right: .5rem;
    top: .5rem;
    width: .9rem;
    height: .9rem;
    background: url(../../assets/close.png) no-repeat;
    background-size: 100%;
  }
  .telBox .telCon{
    margin-top: .75rem;
  }
  .telBox .telCon p{
    font-size: .75rem;
    color: #8d8d8d;
    margin-bottom: .5rem;
  }
  .telBox .telCon input{
    height: 2rem;
    width: 60%;
    font-size: .8rem;
  }
  .telBox .telCon button{
    float: right;
    height: 2rem;
    padding: .5rem 1rem;
    font-size: .6rem;
    outline: 0;
    border: none;
    color: #999;
  }
  .over{
    display: block;
    margin-top: 1.25rem;
    height: 2rem;
    width: 100%;
    text-align: center;
    border: none;
    outline: none;
    background: #8ae088;
    color: #fff;
    font-size: 16px;
  }
</style>
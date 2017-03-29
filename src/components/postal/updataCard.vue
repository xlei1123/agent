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
          <span>持&nbsp;卡&nbsp;人</span><span class="cardName">{{$route.params.cardName}}</span>
        </p>
        <p>
          <span>银行卡号</span><span>{{$route.params.cardNo}}</span>
        </p>
        <p @click="secBank">
          <span>开户银行</span><span>{{bank.Name}}</span>
        </p>
        <p v-show="gongshang" @click="secCity">
          <span>开户城市</span><span>{{bank.city}}</span>
        </p>
        <p v-show="gongshang" @click="secBranch">
          <span>开户支行</span><span>{{bank.cardSubBranch}}</span>
        </p>
        <button @click="next" class="next" :disabled="notClick" :class="{noactive:notClick}">提交</button>
      </div>
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
        gongshang:true
      }
    },
    methods:{
      back(){
        router.go(-1)
      },
      secBank(){
        router.push('/postal/secBank')
      },
      secCity(){
        router.push('/public/secCity')
      },
      secBranch(){
        if(this.bank.Name&&this.bank.city){
          router.push('/postal/subBranch')
        }else{
          this.remind('请填写开户银行和开户城市')
        } 
      },
      next(){
        var authcode=localStorage.getItem('auth');
        var cardCity=localStorage.getItem('addbankcity');
        var cardSubBranch=localStorage.getItem('branch');
        var cardToken=localStorage.getItem('cardToken');
        this.notClick=true;
        var _this=this;        
          // 更新银行卡
          $.ajax({
            method:'post',
            url:_this.domain+'/agent/updateCard',
            data:{
              cardToken:cardToken,
              cardName:_this.bank.Name,             
              cardCity:cardCity,
              cardSubBranch:cardSubBranch
            },
            success:function(json){
              if(json.errno==0){
                // 紧接着就提交提现申请
                var money=localStorage.getItem('cardMoney');
                $.ajax({
                  method:'POST',
                  url:_this.domain+'/agent/withdraw',
                  dataType:'json',
                  data:{
                    authcode:authcode,
                    money:money,
                    cardToken:cardToken
                  },
                  success:function(json){
                    _this.notClick=false;
                   if(json.errno==0){
                      // 提现成功
                      localStorage.setItem('sucBankName',_this.bank.cardName);
                      localStorage.setItem('sucBankCard',_this.bank.cardNo);
                      localStorage.setItem('sucMoney',money);
                      router.push('/postal/postalover/'+json.data);
                    }else if(json.errno==1){
                      _this.remind('余额不足')
                    }else if(json.errno==2){
                      _this.remind('该银行卡信息有误，提现失败，请修改银行信息')
                    }else if(json.errno==5){
                      _this.remind('银行卡状态错误')
                    }
                  }
                })
              }
            },
            error:function(){
              _this.notClick=false;
              _this.remind('银行卡信息更新失败',function(){
                localStorage.clear();
                location.reload(true);
             })

            }
          })
      },
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
    },
    mounted(){
      this.bank.Name=localStorage.getItem('addBank')
      this.bank.city=localStorage.getItem('addbankcity');
      this.bank.cardSubBranch=localStorage.getItem('branch');
      this.bank.cardName=this.$route.params.cardName
      this.bank.cardNo=this.$route.params.cardNo
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
  .con p:nth-child(1){
    background: #f0f0f0;
  }
  .con p span{
    font-size: 16px;
  }
  .con p input{
    border: none;
    outline: none;
    margin-left: .5rem;
    font-size: 14px;
    width: 14rem;
  }
  .con p span:nth-child(2){
    display: inline-block;
    min-width: 10rem;
    margin-left: .5rem;
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
    width: 70%;
  }
  .telBox .telCon button{
    float: right;
    height: 2rem;
    padding: .5rem;
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
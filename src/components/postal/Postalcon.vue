<template>
  <transition name="fade">
    <div class="bankbox">
      <div class="header" >
        <i @click="back"></i>
        <h3>提现</h3>
      </div>
      <div class="con">
        <p class="type" @click="morebank">
          <span>银行卡</span><span class="typebank">{{cardName}} ({{cardNo}})  {{realName}}</span>
          <i class="more"></i>
        </p>
        <div class="moneyBox">
          <span>提现金额</span>
          <p class="money">
            <span class="moneySymbol">￥</span>
            <input type="text" class="postalNum" placeholder="0" v-model="money">
          </p>
        </div>
        <p class="nowmoney">
          <span>当前账户余额{{nowmoney}}</span><button @click="allPostal">全部提现</button>
        </p>
      </div>
      <button @click="postal" class="postal">提交</button>

      <!-- 选择银行卡的悬浮层 -->
      <transition name="moreConBox" mode="out-in">
        <div class="morebank" v-show="bankL">
          <div class="moreCon">
            <h3 class="tit">选择提现银行卡 <i @click="close" class="close"></i> </h3>
            <ul class="banklistBox">
              <li v-for="(bank,index) in bankList" @click="secBank(index)">
                <img :src="bank.cardName | banklogo" class="bankLogo">
                <span>{{bank.cardName}}</span>
                <span>{{bank.cardNo}}</span>
              </li> 
            </ul>
            <p @click="addBank" class="addbankBox"><i class="addBank"></i>  添加银行卡提现</p>
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
        cardName:'****',
        cardNo:'****',
        fullCardNo:'',
        nowmoney:0,
        money:'',
        bankL:false,
        bankList:[],
        cardToken:'',
        tel:'',
        realName:'',
        lastValid:false
      }
    },
    mounted(){
      var authcode=localStorage.getItem('auth');
      var _this=this;
      $.ajax({
        method:'POST',
        url:_this.domain+'/agent/card',
        dataType:'json',
        data:{
          authcode:authcode
        },
        success:function(json){
          if(json.errno==0){
            _this.tel=json.data.mobile;
            if(json.data.cards.length==0){
              router.replace('/postal/addCard/'+json.data.mobile)
            }else{
              // 默认账户渲染
              _this.nowmoney=json.data.balance;
              for(let i=0;i<json.data.cards.length;i++){
                if(json.data.cards[i].lastValid){
                  _this.cardName=json.data.cards[i].cardName
                  _this.fullCardNo=json.data.cards[i].cardNo
                  _this.cardNo=json.data.cards[i].cardNo.substr(-4,4) 
                  _this.cardToken=json.data.cards[i].cardToken
                  _this.realName=json.data.cards[i].realName
                  _this.lastValid=true
                }
              }
              if(_this.lastValid==false){
                let n = json.data.cards.length-1;
                _this.cardName=json.data.cards[n].cardName
                _this.fullCardNo=json.data.cards[n].cardNo
                _this.cardNo=json.data.cards[n].cardNo.substr(-4,4) 
                _this.cardToken=json.data.cards[n].cardToken
                _this.realName=json.data.cards[n].realName;
              }
              // 银行卡列表
              _this.bankList=json.data.cards;
            }
           
          }
        }
      })
    },
    // 匹配银行卡图标
    filters: {
        banklogo: function (val) {
          if(new RegExp("北京银行").test(val)){
            return './static/banklogo/1.png'
          }else if(new RegExp("工商银行").test(val)){
            return './static/banklogo/2.png'
          }else if(new RegExp("光大银行").test(val)){
            return './static/banklogo/3.png'
          }else if(new RegExp("广东发展银行").test(val)){
            return './static/banklogo/4.png'
          }else if(new RegExp("广发银行").test(val)){
            return './static/banklogo/5.png'
          }else if(new RegExp("华厦银行").test(val)){
            return './static/banklogo/6.png'
          }else if(new RegExp("建设银行").test(val)){
            return './static/banklogo/7.png'
          }else if(new RegExp("交通银行").test(val)){
            return './static/banklogo/8.png'
          }else if(new RegExp("农业银行").test(val)){
            return './static/banklogo/9.png'
          }else if(new RegExp("浦东发展银行").test(val)){
            return './static/banklogo/10.png'
          }else if(new RegExp("上海银行").test(val)){
            return './static/banklogo/11.png'
          }else if(new RegExp("兴业银行").test(val)){
            return './static/banklogo/12.png'
          }else if(new RegExp("招商银行").test(val)){
            return './static/banklogo/13.png'
          }else if(new RegExp("浙商银行").test(val)){
            return './static/banklogo/14.png'
          }else if(new RegExp("民生银行").test(val)){
            return './static/banklogo/15.png'
          }else if(new RegExp("中国银行").test(val)){
            return './static/banklogo/16.png'
          }else if(new RegExp("邮政银行").test(val)){
            return './static/banklogo/17.png'
          }else if(new RegExp("中信银行").test(val)){
            return './static/banklogo/18.png'
          }
        }
    },
    methods:{
      back(){
        router.go(-1);
      },
      morebank(){
        this.bankL=true;
      },
      allPostal(){
        var authcode=localStorage.getItem('auth');
        var _this=this;
        $.ajax({
          method:'POST',
          url:_this.domain+'/agent/withdraw',
          dataType:'json',
          data:{
            authcode:authcode,
            money:_this.nowmoney,
            cardToken:_this.cardToken
          },
          success:function(json){
           if(json.errno==0){
              // 提现成功
              _this.money=_this.nowmoney;
              localStorage.setItem('sucBankName',_this.cardName);
              localStorage.setItem('sucBankCard',_this.cardNo);
              localStorage.setItem('sucMoney',_this.money);
              router.push('/postal/postalover/'+json.data);
            }else if(json.errno==1){
              _this.remind('余额不足')
            }else if(json.errno==2){
              _this.remind('该银行卡信息有误，提现失败，请修改银行信息',function(){
                localStorage.setItem('cardToken',_this.cardToken);
                localStorage.setItem('cardMoney',_this.money);
                router.push('/postal/updataCard/'+_this.realName+'/'+_this.fullCardNo)
              })
            }else if(json.errno==4){
              _this.remind('银行卡状态错误')
            }
          }
        })
      },
      postal(){
        var authcode=localStorage.getItem('auth');
        var _this=this;
        if(this.cardName=="****"){
          this.remind('请选择提现银行卡')
        }else if(this.money>this.nowmoney){
          this.remind('余额不足')
        }else{
          $.ajax({
            method:'POST',
            url:_this.domain+'/agent/withdraw',
            dataType:'json',
            data:{
              authcode:authcode,
              money:_this.money,
              cardToken:_this.cardToken
            },
            success:function(json){
             if(json.errno==0){
                // 提现成功
                localStorage.setItem('sucBankName',_this.cardName);
                localStorage.setItem('sucBankCard',_this.cardNo);
                localStorage.setItem('sucMoney',_this.money)
                router.push('/postal/postalover/'+json.data)
              }else if(json.errno==1){
                _this.remind('余额不足')
              }else if(json.errno==2){
                _this.remind('该银行卡信息有误，提现失败，请修改银行信息',function(){
                  localStorage.setItem('cardToken',_this.cardToken);
                  localStorage.setItem('cardMoney',_this.money);
                  localStorage.removeItem('addBank');
                  localStorage.removeItem('addbankcity');
                  localStorage.removeItem('branch');
                  router.push('/postal/updataCard/'+_this.realName+'/'+_this.fullCardNo)
                })
              }else if(json.errno==4){
                _this.remind('银行卡状态错误')
              }
            }
          })
        }
        
      },
      secBank(index){
        var dotIndex=this.bankList[index].cardName.indexOf('·');
        this.cardName=this.bankList[index].cardName.slice(0,dotIndex);
        this.fullCardNo=this.bankList[index].cardNo;
        this.cardNo=this.bankList[index].cardNo.substr(-4,4);
        this.cardToken=this.bankList[index].cardToken;
        this.realName=this.bankList[index].realName
        this.bankL=false;
      },
      addBank(){
        // 0表示添加银行卡 1表示修改或填写银行卡信息
        router.push('/postal/addCard/'+this.tel)
      },
      close(){
        this.bankL=false;
      }
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
  .bankbox{
    position: relative;
    height: 100%;
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
  .con{
    margin: .5rem auto;
    padding: 1rem;
    width: 15rem;
    background: #fff;
  }
  .con .type{
    margin-left: -1rem;
    margin-right: -1rem;
    height: 2rem;
    line-height: 2rem;
    padding:0 1rem;
    background: #fbfbfb;
  }
  .con .type .more{
    float: right;
    width: 20px;
    height: 20px;
    margin-top: .5rem;
    background: url(../../assets/arrow-right.png) no-repeat;
    background-size: cover;
  }
  .con .type .typebank{
    margin-left: 1rem;
    color: #50669b;
    
  }
  .con span{
    font-size: .75rem;
  }
  .moneyBox{
    margin-top: .75rem;
  }
  .money .postalNum{
    outline: none;
    border: none;
    margin-bottom: 1rem;
    line-height: 1rem;
    padding-top: .75rem;
    font-size: 20px;
  }
  .moneySymbol{
    float: left;
    font-size: 14px;
    margin-top: .9rem;
  }
  .nowmoney{
    padding-bottom: 1rem;
  }
  .nowmoney span{
    color: #8c8c8c;
    font-size: .6rem;
  }
  .nowmoney button{
    margin-left: .5rem;
    border: none;
    outline: none;
    color: #50669b;
    background: transparent;
  }
  .postal{
    display: block;
    margin: 1.25rem auto;
    width: 17rem;
    height: 2rem;
    border: none;
    outline: none;
    background: #8ae088;
    color: #fff;
    font-size: 16px;
  }
  .morebank{
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    background: rgba(0,0,0,0.4);
  }
  .moreConBox-enter-active, .moreConBox-leave-active {
    transition: all .5s;
  }
  .moreConBox-enter, .moreConBox-leave-active {
    opacity: 0;
    transform: translateY(-100px);
  }
  .moreCon{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 18rem;
    max-height: 11.5rem;
    margin-left: -9rem;
    margin-top: -4rem;
    text-align: center;
    background: #fff;
    border-radius: 8px;
  }
  .moreCon .banklistBox{
    width: 16rem;
    margin: 0 auto;
    max-height: 6.5rem;
    overflow-y: scroll;
  }
  .moreCon .tit{
    position: relative;
    height: 2.5rem;
    line-height: 2.5rem;
    font-size: .75rem;
  }
  .moreCon ul li{
    height: 2.5rem;
    line-height: 2.5rem;
    padding-left: .75rem;
    text-align: left;
    font-size: .75rem;
    border-bottom: 1px solid #f0f0f0;
  }
   .moreCon ul li img{
    margin-top: .8rem;
    width: 1rem;
   }
  .moreCon .addbankBox{
    position: relative;
    height: 2.5rem;
    line-height: 2.5rem;
    padding-left: 2rem;
    text-align: left;
    font-size: .75rem;
  }
  .moreCon .addBank{
    position: absolute;
    left: 0.75rem;
    top: .8rem;
    height: .9rem;
    width: .9rem;
    background: url(../../assets/add.png) no-repeat;
    background-size: 100%;
  }
  .moreCon .close{
    position: absolute;
    right: .5rem;
    top: .5rem;
    width: .9rem;
    height: .9rem;
    background: url(../../assets/close.png) no-repeat;
    background-size: 100%;
  }
</style>
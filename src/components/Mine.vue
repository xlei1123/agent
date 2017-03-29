<template>
  <transition name="fade">
    <div>
      <div class="self">
        <div class="user">
          <img :src="urlpng" class="head">
          <h2 class="name">{{name}}</h2>
          <p class="text">当前资产</p>
          <p class="money"><span>￥</span>{{balance}}<span></span></p>
        </div>
        <div class="bg2"></div>
        <p class="account">
          <a @click="detail">账户明细</a>
          <i></i>
        </p>
        <p @click="modifyPass" class="modify">修改密码<i></i></p>
        <p @click="postal" class="modify">提现<i></i></p>
        <div class="bg5"></div>
        <p @click="quit" class="quit">退出当前账户</p>
      </div>
    </div> 
  
</transition>
</template>
<script>
  var auth;
  import router from '../router.js'
  export default{
    data(){
      return{
        urlpng:'',
        name:'',
        balance:'',
        items:[],
        nodatail:false
      }
    },
    mounted(){
      if(!localStorage.login){
          router.push('/login');
        }
      var _this= this;
      auth = localStorage.getItem('auth');
      $.ajax({
        type:'post',
        dataType:'json',
        url:_this.domain+'/agent/account',
        data:{
          authcode:auth
        },
        success:function(json){
          if(json.errno==0){
            // console.log(json)
            _this.name = json.data.realName;
            _this.urlpng = json.data.avatar;
            _this.balance = json.data.balance;

          }
          
        }
      })
      if((!this.items) || (!this.items.length)){
        this.nodatail=true;
      }
    },
    methods:{
      quit(){
        localStorage.clear();
        location.reload(true);
      },
      detail(){
        router.push('/content/accountDetail')
      },
      modifyPass(){
        router.push('/modifyPass')
      },
      postal(){
        var authcode=localStorage.getItem('auth');
        var _this=this;
        // 先判断是否有正在提现的
        $.ajax({
          method:'POST',
          url:_this.domain+'/agent/withdrawing',
          dataType:'json',
          data:{
            authcode:authcode
          },
          success:function(json){
            if(json.errno==0){
              // 没有正在提现的获取银行卡
              $.ajax({
                method:'POST',
                url:_this.domain+'/agent/card',
                dataType:'json',
                data:{
                  authcode:authcode
                },
                success:function(json){
                  if(json.errno==0){
                    if(json.data.cards.length==0){
                      // 没有绑定过银行卡
                      router.push('/postal/addCard/'+json.data.mobile)
                    }else{
                      router.push('/postal/postalcon')
                    }
                  }
                }
              })
            }else{
              _this.remind('提现申请已经提交，两个工作日内处理，请耐心等候')
            }
          }
        })
        
      }
    }
  }
</script>
<style scoped>
  body{
    background: #f0f0f0;
  }
  .fade-enter-active {
    transition: opacity .1s
  }
  .fade-leave-active{
    transition: opacity 0s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0
  }
  .user{
    padding-top: 1.5rem;
    text-align: center;
    background: #e5c17d;
  }
  .user .head{
    margin: 0 auto;
    width: 3.5rem;
    height: 3.5rem;
    border: 2px solid #fff; 
    -moz-border-radius:50%;
    -webkit-border-radius:50%;
    border-radius: 50%;
  }
  .user .name{
    margin: .5rem 0 .75rem;
    font-size: 0.75rem;
    color: #372f2f;
  }
  .user .text{
    color: #a78f64;
    margin-bottom: .25rem;
  }
  .user .money{
    font-size: 1rem;
    font-weight: bold;
    color: #372f2f;
    padding-bottom: 1.5rem;
  }
  .user .money span{
    font-size: .5rem;
  }
  .bg2{
    height: .5rem;
    background: #f0f0f0;
  }
  .account{
    position: relative;
    height: 2.02rem;
    background: #fff;
  }
  .account a{
    display: block;
    height: 2.02rem;
    line-height: 2.02rem;
    font-size: .9rem;
    color: #372f2f;
    padding-left: 0.5rem;
  }
  .account i{
    position: absolute;
    right: 0;
    top: .6rem;
    height: 2rem;
    width: 1rem;
    background: url(../assets/arrow-right.png) no-repeat;
    background-size: 100%;
  }
  .bg3{
    height: .5rem;
    background: #f0f0f0;
  }
  .bg5{
    height: 1.25rem;
    background: #f0f0f0;
  }
  .modify{
    position: relative;
    height: 2.02rem;
    line-height: 2.02rem;
    padding-left: .5rem;
    font-size: .9rem;
    color: #372f2f;
    background: #fff;
    border-top: 1px solid #f0f0f0;
  }
  .modify i{
    position: absolute;
    right: 0;
    top: .6rem;
    height: 2rem;
    width: 1rem;
    background: url(../assets/arrow-right.png) no-repeat;
    background-size: 100%;
  }
  .quit{
    height: 2.02rem;
    line-height: 2.02rem;
    text-align: center;
    font-size: .9rem;
    color: #e16832;
    background: #fff;
  }

  /*账户详情*/
  .detail ul{
    background: #fff; 
  }
  .detail ul li{
    height: 3.5rem;
    margin:.5rem .5rem;
    border-bottom: 1px solid #ccc;
    padding:.75rem .5rem;
  }
  .detail ul li p{
    height: 1.75rem;
  }
  .detail ul li .tit span:nth-child(1){
    width: 10rem;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    float: left;
    font-size: .8rem;
    color: #252323;
  }
  .detail ul li .tit span:nth-child(2){
    float: right;
    color: #3ecd3b;
    font-size: .8rem;
  }
  .detail ul li .tit span.redc{
    color: #e33535;
  }
  .detail ul li .time span:nth-child(1){
    float: left;
    color: #b5b5b5;
    font-size: .6rem;
  }
  .detail ul li .time span:nth-child(2){
    float: right;
    color: #b5b5b5;
    font-size: .6rem;
  }
  .nodatail{
    padding-top: 10rem;
    text-align: center;
  }
  .nodatail span{
    font-size: .8rem;
    text-align: center;
  }
</style>


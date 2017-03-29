<template>
  <transition name="fade">
    <div>
      <loading v-show="unsuc"></loading>
        <div class="detail">
          <ul>
            <li v-for="item in items">
              <p class="tit"><span>{{item.title}}</span><span :class="{redc:item.money<0}">{{item.money}}</span></p>
              <p class="time"><span>{{item.createTime}}</span><span>{{item.status}}</span></p>
            </li>
          </ul>
          <div class="more" @click="getMore">{{moreText}}</div>
        </div>
        <div class="nodatail" v-show="nodatail">
          <span>暂无明细</span>
        </div>
    </div> 
  
</transition>
</template>
<script>
  // var auth = localStorage.auth;
  var auth;
  export default{
    data(){
      return{
        urlpng:'',
        name:'',
        balance:'',
        items:[],
        nodatail:false,
        unsuc:true,
        pageNumber:1,
        moreText:'点击加载更多'
      }
    },
    mounted(){
      var _this= this;
      auth = localStorage.getItem('auth');
      $.ajax({
        type:'post',
        dataType:'json',
        url:_this.domain+'/agent/account',
        data:{
          authcode:auth,
          pageNumber:_this.pageNumber,
          pageSize:20
        },
        success:function(json){
          if(json.errno==0){
            _this.unsuc=false;
            _this.items=json.data.details;
            if(_this.items.length<20){
              _this.moreText="已无更多数据"
            }
            if((!this.items) || (!this.items.length)){
              this.nodatail=true;
            }
          } 
        }
      })
     
    },
    methods:{
      getMore(){
        this.pageNumber++;
        this.moreText="加载中..."
        var _this= this;
        auth = localStorage.getItem('auth');
        $.ajax({
          type:'post',
          dataType:'json',
          url:_this.domain+'/agent/account',
          data:{
            authcode:auth,
            pageNumber:_this.pageNumber,
            pageSize:20
          },
          success:function(json){
            if(json.errno==0){
              _this.unsuc=false;
              _this.moreText="点击加载更多";
              if(json.data.details<20){
                _this.moreText="已无更多数据"
              }

              _this.items=_this.items.concat(json.data.details)
               if((!this.items) || (!this.items.length)){
                this.nodatail=true;
              }
            } 
          }
        })
      }
    }
  }
</script>
<style scoped>
  .fade-enter-active{
    transition: opacity .1s
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
    border: 5px solid #fff; 
    -moz-border-radius:50%;
    -webkit-border-radius:50%;
    border-radius: 50%;
  }
  .user .name{
    margin: .5rem 0 .75rem;
    font-size: 1rem;
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
    padding: .5rem;
    background: #fff;
  }
  .account a{
    display: block;
    font-size: 1rem;
    color: #372f2f;
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
  .bg5{
    height: 1.25rem;
    background: #f0f0f0;
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
    /*margin-bottom: 30px; */
  }
  .detail ul li{
    height: 2.5rem;
    margin:.5rem 0rem;
    padding-top: 1rem;
    border-bottom: 1px solid #eee;
    padding:0rem .5rem;
  }
  .detail ul li p{
    height: 1.25rem;
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
  .more{
    margin-bottom: 65px;
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    font-size: .6rem;
    color: #ccc;

  }
  .nodatail{
    padding-top: 10rem;
    text-align: center;
    height: 100%;
  }
  .nodatail span{
    font-size: .8rem;
    text-align: center;
  }
</style>


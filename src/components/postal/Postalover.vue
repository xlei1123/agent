<template>
  <transition name="fade">
    <div>
      <div class="header" >
        <i @click="back"></i>
        <h3>提现详情</h3>
      </div>
      <div class="overhead">
        <img src="../../../static/banklogo/Clock.png">
        <p class="overtext">提现申请已提交</p>
      </div>
      <div class="info">
        <p>
          <span>预计到账时间</span>
          <span>{{time}}</span>
        </p>
        <p>
          <span>储蓄卡</span>
          <span>{{cardName}} 尾号{{cardNo}}</span>
        </p>
        <p>
          <span>提现金额</span>
          <span>￥{{money}}</span>
        </p>
      </div>
      <button class="over" @click="over">完成</button>
    </div>
  </transition>
</template>
<script>
  import router from '../../router';
  export default{
    data(){
      return {
        cardName:'xxxx',
        cardNo:'xxx',
        time:'xxxx-xx-xx',
        money:'xxx'
      }
    },
    mounted(){
      var nowTime=new Date(this.$route.params.time.replace(/-/g,'/'));
      console.log()
      var nowTimeY=nowTime.getFullYear();
      var nowTimeM=nowTime.getMonth()+1;
      var nowTimeD=nowTime.getDate()+2;
      var sucTime=new Date(nowTimeY+'/'+nowTimeM+'/'+nowTimeD);
      var sucTimeY=sucTime.getFullYear();
      var sucTimeM=sucTime.getMonth()+1;
      var sucTimeD=sucTime.getDate(); 
      this.time=sucTimeY+'年'+sucTimeM+'月'+sucTimeD+'日';
      this.cardName=localStorage.getItem('sucBankName');
      this.cardNo=localStorage.getItem('sucBankCard').substr(-4,4);
      this.money=localStorage.getItem('sucMoney');
    },
    methods:{
      back(){
        router.go(-1)
      },
      next(){
        
      },
      over(){
        router.push('/content/mine/0')
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

  .overhead{
    padding: 1.25rem 0;
    text-align: center;
  }
  .overhead img{
    width: 4rem;
  }
  .overhead .overtext{
    font-size: .8rem;
    margin-top: 1rem;
  }
  .info{
    padding: 1.25rem 1.25rem .75rem;
    background: #fff;
  }
  .info p{
    height: 1.5rem;
  }
  .info p span{
    font-size: .8rem;
  }
  .info p span:nth-child(2){
    float: right;
  }
  .over{
    display: block;
    margin: .75rem auto;
    width: 17rem;
    height: 2rem;
    border: none;
    outline: none;
    background: #8ae088;
    color: #fff;
    font-size: 16px;
  }
</style>
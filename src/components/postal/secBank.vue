<template>
  <transition name="fade">
    <div class="bankBox">
      <div class="header" >
        <i @click="back"></i>
        <h3>选择银行</h3>
      </div>
      <ul>
        <li v-for="(bank,index) in bankList" @click="secBank(index)">{{bank}}</li>
      </ul>
    </div>
  </transition>
</template>
<script>
  import router from '../../router';
  export default{
    data(){
      return {
        bankList:['中国工商银行','中国建设银行','中国农业银行','招商银行','中国银行','交通银行','中国邮政储蓄银行','中国光大银行','中信银行','中国民生银行','广发银行','兴业银行','平安银行','上海浦东发展银行']
      }
    },
    methods:{
      back(){
        router.go(-1)
      },
      secBank(index){
        var _this = this;
        localStorage.setItem('addBank',_this.bankList[index]);
        router.go(-1);
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
  .bankBox{
    height: 100%;
    background: #fff;
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
  li{
    height: 2rem;
    line-height: 2rem;
    padding-left: .5rem;
    border-bottom: 1px solid #f0f0f0;
    font-size: .8rem;
  }
 
</style>
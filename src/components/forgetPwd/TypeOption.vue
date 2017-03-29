<template>
  <div>
    <div class="header" >
      <i @click="back"></i>
      <h3>账号类型选择</h3>
    </div>
    <div class="content">
          <div class="user" id="user" @click="toSendUser">个人／师资用户密码找回 <i></i></div>  
          <div class="publicer" id="publicer"@click="toSendPub">公众号／项目组用户密码找回 <i></i></div>  
    </div>
  </div>
</template>
<script>
  import router from '../../router';
  export default{
    methods:{
      back(){
        router.go(-1);
      },
      toSendUser:()=>{
        router.push('/forgetPwd/enterTel/1')
      },
      toSendPub:()=>{
        router.push('/forgetPwd/enterTel/2')
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
  .ui-content{
      padding: 0;
  }
  .user,.publicer{
      height: 2rem;
      line-height: 2rem;
      border-bottom: 1px solid #ccc;
      font-size: .6rem;
      position: relative;
      padding:0 .5rem;
      background: #fff;
      font-size: 14px;
  }
  .user i,.publicer i{
      position: absolute;
      right: .3rem;
      top: 50%;
      width: .5rem;
      height: 1.2rem;
      margin-top: -.6rem;
      background:url(../../assets/right.png) no-repeat;
      background-size: 100%;
  }
</style>


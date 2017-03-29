<template>
  <div class="footerBox">
    <ul class="footer">
      <li @click="active"><router-link to="/content/msg"><i></i>消息</router-link></li>
      <li><router-link to="/content/performance" :class="{active:peractive}"><i></i>绩效</router-link></li>
      <li @click="active"><router-link to="/content/mine/0" :class="{active:mine}"><i></i>我的</router-link></li>
    </ul>
  </div>
</template>
<script>
  import router from '../router.js'
  export default{
    data(){
      return{
        peractive:true,
        mine:false
      }
    },
    methods:{
      active:function() {
        this.peractive=false;
        this.mine=false;
      }
    },
    mounted(){
      if(this.$route.params.back==1){
        this.mine=true
      }
      if(this.$router.currentRoute.path.indexOf('mine')>=0){
        this.peractive=false;      
      }
    }
  }
</script>
<style scoped>
  .footer{
    position: fixed;
    bottom: 0;
    left: 50%;
    margin-left:-9.375rem;
    width:18.75rem;
    height:60px;
    background: #191919;
  }
  .footer li{ 
    float: left;
    height:60px;
    width: 6.25rem;
    line-height:60px;
    text-align:center;
  }
  .footer li a{
    position: relative;
    padding-top: 10px;
    display: block;
  }
  .footer li i{
    position: absolute;
    left: 50%;
    width: .9rem;
    height: .9rem;
    margin-left: -0.45rem;
    top: 12px;
   
  }
  .router-link-active{
    color: #fcda95;
  }
  ul li:nth-child(1) i{
    background: url(../assets/msg.png) no-repeat;
    background-size: 100%;
  }
  ul li:nth-child(1) .router-link-active i{
    background: url(../assets/msgactive.png) no-repeat;
    background-size: 100%;
  }
  ul li:nth-child(2) i{
    background: url(../assets/per.png) no-repeat;
    background-size: 100%;
  }
  ul li:nth-child(2) .router-link-active i{
    background: url(../assets/peractive.png) no-repeat;
    background-size: 100%;
  }
  ul li:nth-child(3) i{
    background: url(../assets/mine.png) no-repeat;
    background-size: 100%;
  }
  ul li:nth-child(3) .router-link-active i{
    background: url(../assets/mineactive.png) no-repeat;
    background-size: 100%;
  }
  ul li .active i{
    background: url(../assets/peractive.png) no-repeat;
    background-size: 100%;
  }
  ul li .active{
    color: #fcda95;
  }

</style>


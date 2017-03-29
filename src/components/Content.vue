<template>
  <div class="conviewBox">
    <keep-alive><router-view id="conview" class="conview" mode="out-in"></router-view></keep-alive>
    <foot></foot>
  </div>
</template>
<script>
  import Foot from './foot';
  import router from '../router';
  import Login from './Login';
  import Performance from './Performance';
  export default{
    data(){
      return{
        conheight:{
          minHeight:''
        }
      }
    },
    components: {
      Foot
    },
    mounted(){
    }
  }
</script>
<style scoped>
  .conviewBox{
    height: 100%;
  }
  .conview{
    padding-bottom: 60px;
    background: #f0f0f0;
    height: 100%;
  }

  
</style>


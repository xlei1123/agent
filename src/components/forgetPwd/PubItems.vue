<template>
  <div>
    <div class="header" >
      <i @click="back"></i>
      <h3>密码找回</h3>
    </div>
    <div class="content">

      <!-- 绑定手机号的公众号列表 -->
      <div class="publiceList">
          <div class="tit">该手机号共关联 {{pubItems.length}} 个机构／项目组账号</div>
          <ul class="publist">
              <li v-for="(pubItme,index) in pubItems" @click="pubclick(index)">
                  <img src=""><span>{{pubItme.realName}}</span>
              </li>
          </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import router from '../../router';
  import { mapGetters, mapActions } from 'vuex'
  export default{
    data(){
      return{
        mobile:''
      }
    },
    computed: mapGetters({
      products: 'allProducts'
    }),
    methods:{
      back(){
        router.go(-1)
      },
      pubclick(index){
        localStorage.setItem('auth',_this.pubItems[index].authcode);
        router.push('/forgetPwd/setNewPwd');
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
  
  .publiceList .tit{
      height: 2.5rem;
      line-height: 2.5rem;
      padding-left: 1rem;
  }
  .publiceList .publist li{
      margin: 0 .5rem;
      padding:.5rem;
      height: 1.5rem;
      border-bottom: 1px solid #ccc;
  }
  .publiceList .publist li img{
      width: 1.5rem;
      margin-left: .5rem;
      border-radius: 50%;
  }
  .publiceList .publist li span{
      margin-left: .5rem;
      height: 1.5rem;
      line-height: 1.5rem;
  }
</style>


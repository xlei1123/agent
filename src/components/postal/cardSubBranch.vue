<template>
  <transition name="fade">
    <div class="branchBox">
      <div class="header" >
        <i @click="back"></i>
        <h3>填写支行</h3>
      </div>
      <div class="con">
        <p class="search"><input v-model="secBranch"></p>
        <ul>
          <li v-for="(branch,index) in branchs" @click="secSub(index)">{{branch}}</li>
        </ul>
      </div>
    </div>
  </transition>
</template>
<script>
  import router from '../../router';
  export default{
    data(){
      return {
        branchs:[],
        secBranch:'',
        allBranch:''
      }
    },
    methods:{
      back(){
        router.go(-1)
      },
      secSub(index){
        localStorage.setItem('branch',this.branchs[index]);
        router.go(-1);
      }
    },
    mounted(){
      var areaName= localStorage.getItem('addbankcity');
      var bank = localStorage.getItem('addBank');
      var _this = this;
      $.ajax({
        method:'POST',
        url:'http://192.168.50.110:8081/urming_pkuie/system/getSubBranch',
        data:{
          areaName:areaName,
          bank:bank
        },
        success:function (json) {
          let data =  JSON.parse(json);
          _this.branchs=data.subBranch;
          _this.allBranch=data.subBranch
        }
      })
    },
    watch:{
      secBranch:function(val){
        if(val){
          this.branchs=[];
          this.allBranch.forEach((value,index)=>{
            if(value.indexOf(val)>=0){
             this.branchs.push(value)
            }
          })
        }else{
          this.branchs=this.allBranch
        }
        
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
  .branchBox{
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
  .con .search input{
    display: block;
    margin: .5rem auto;
    width: 90%;
    height: 1.5rem;
    border-radius: 5px;
    outline: none;
    background: url(../../../static/img/search.png) .5rem .3rem no-repeat;
    background-size: 1.2rem 1.2rem;
    text-indent: 2rem;
    border: 1px solid #ccc;
  }
  .con li{
    height: 2rem;
    padding-left: .5rem;
    line-height: 2rem;
    font-size: .7rem;
    border-bottom: 1px solid #f0f0f0;
  }
</style>
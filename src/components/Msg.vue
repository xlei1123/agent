<template>
  <transition name="fade">
  <div>
    <ul class="msglist" v-if="showdetail" ref="msglist">
      <li v-for="(item,index) in items" class="item">
        <div v-if="item.type===1">
          <h3>回款合同确认通知</h3>
          <p><span>合同编号:</span> <span>{{item.contractNo}}</span></p>
          <p><span>客户名称:</span> <span>{{item.customerName}}</span></p>
          <p><span>回款金额:</span> <span>{{item.money}}</span></p>
          <p><span>回款时间:</span> <span>{{item.receiveTime}}</span></p>
        </div>
        <div v-if="item.type===2">
          <h3>回款合同修改通知</h3>
          <p><span>合同编号:</span> <span>{{item.contractNo}}</span></p>
          <p><span>客户名称:</span> <span>{{item.customerName}}</span></p>
          <p><span>回款金额:</span> <span>{{item.money}}</span></p>
          <p><span>回款时间:</span> <span>{{item.receiveTime}}</span></p>
        </div>
        <div v-if="item.type===3">
          <h3>分成发放通知</h3>
          <p><span>分成入账:</span> <span>{{item.salary}}</span></p>
          <p><span>分成时间:</span> <span>{{item.createTime}}</span></p>
          <p><span>月回款单:</span> <span>{{item.count}}</span></p>
          <p><span>月回款额:</span> <span>{{item.sum}}</span></p>
          <p><span>绩效等级:</span> <span>{{item.level}}</span></p>
        </div>
      </li>
    </ul>
    <div class="detail" v-else>
      <div class="back" @click="back"><i></i>详情</div>
      <div class="con">
        <div v-if="value.type===1">
          <h3>回款合同确认通知</h3>
          <p>合同编号:{{value.contractNo}}</p>
          <p>客户名称:{{value.customerName}}</p>
          <p>回款金额:{{value.money}}</p>
          <p>回款时间:{{value.receiveTime}}</p>
        </div>
        <div v-if="value.type===2">
          <h3>回款合同修改通知</h3>
          <p>合同编号:{{value.contractNo}}</p>
          <p>客户名称:{{value.customerName}}</p>
          <p>回款金额:{{value.money}}</p>
          <p>回款时间:{{value.receiveTime}}</p>
        </div>
        <div v-if="value.type===3">
          <h3>分成发放通知</h3>
          <p>分成入账:{{value.salary}}</p>
          <p>分成时间:{{value.createTime}}</p>
          <p>月回款单:{{value.count}}</p>
          <p>月回款额:{{value.sum}}</p>
          <p>绩效等级:{{value.level}}</p>
        </div>
      </div> 
    </div>
    <div class="nomsg" v-show="nomsg">
      <span>暂无消息</span>
    </div>
  </div>
</transition>
</template>
<script>

  export default{
    data(){
      return{
        showdetail:true,
        items:[],
        nomsg:false
      }
    },
    methods:{
      detail(index){
        this.showdetail=false;
        this.value=this.items[index];
      },
      back(){
        this.showdetail=true;
      }
    },
    // mounted(){
    //   var authcode = localStorage.auth;
    //   var _this=this;
    //   $.ajax({
    //     method:'post',
    //     url:_this.domain+'/agent/notice',
    //     data:{
    //       authcode:authcode
    //     },
    //     success:function(json){
    //       // console.log(json)
    //       if(json.errno==0){
    //         _this.items=json.data;
    //         // console.log(_this.items)
    //         if(_this.items.length==0){
    //           _this.nomsg=true;
    //           _this.$refs.msglist.style.display="none"
    //         }
    //       }
          
    //     }
    //   })
    // },
    activated(){
      var authcode = localStorage.auth;
      var _this=this;
      $.ajax({
        method:'post',
        url:_this.domain+'/agent/notice',
        data:{
          authcode:authcode
        },
        success:function(json){
          // console.log(json)
          if(json.errno==0){
            _this.items=json.data;
            // console.log(_this.items)
            if(_this.items.length==0){
              _this.nomsg=true;
              _this.$refs.msglist.style.display="none"
            }
          }
          
        }
      })
    }
  }
</script>
<style scoped>
  .fade-enter-active{
    transition: opacity .3s
  }
  .fade-leave-active{
    transition: opacity 0s
  }
  .fade-enter, .fade-leave-to{
    opacity: 0
  }
  .msglist{
    padding-top: 10px;
  }
  .item{
    padding: 1.25rem;
    padding-top: .5rem;
    background: #fff;
    margin-bottom: 10px;
  }
  .item h3{
    height: 2rem;
    line-height: 2rem;
    font-size: .8rem;
    color: #524d4d;
  }
  .item .enter{
    margin-top: .3rem;
    float: right;
    font-size: .6rem;
    color: blue;
  }
  .item p{
    height: 1.3rem;
    line-height: 1.3rem;
    color: #787878;
  }
  .item p span{
    font-size: .8rem;
    color: #524d4d;
  }
  .detail{
    position: relative;
    margin-top: .5rem;
    padding:0 .5rem;
  }
  .detail .back{
    position: relative;
    height: 2rem;
    line-height: 2rem;
    border-bottom: 1px solid #ccc;
    text-align: center;
    background: #fff;
    font-size: .8rem;
  }
  .detail .back i{
    position: absolute;
    left: .8rem;
    top: 50%;
    width: .7rem;
    height: 1.4rem;
    margin-top: -.7rem;
    background: url(../assets/left.png) no-repeat;
    background-size: 100%;
  }
  .detail .con{
    padding: 1.25rem;
    background: #fff;
    text-align: left;
  }
  .detail .con h3{
    font-size: .8rem;
    color: #524d4d;
    height: 1.5rem;
    line-height: 1.5rem;
  }
  .detail .con p{
    font-size: .8rem;
    color: #524d4d;
    height: 1.3rem;
    line-height: 1.3rem;
  }
  .nomsg{
    padding-top: 10rem;
    background: #f0f0f0;
  }
  .nomsg span{
    position: absolute;
    left: 50%;
    top: 50%;
    width: 10rem;
    height: 3rem;
    margin-left: -5rem;
    margin-top: -2rem;
    text-align: center;
    font-size: .7rem;

  }
</style>
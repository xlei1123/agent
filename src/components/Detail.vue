<template>
  <div>
    <div class="detailshow">
      <p>合同编号：{{detail.contractNo}}</p>
      <p>合同名称：{{detail.customerName}}</p>
      <p>回款金额：{{detail.money}}</p>
      <p>回款时间：{{detail.receiveTime}}</p>
      <p class="comment">备注：{{detail.remark}}</p>
    </div>
  </div>

</template>
<script>
  export default{
    data(){
      return {
        detail:{}
      }
    },
    created(){
      this.detail.contractNo=localStorage.contractNo;
      this.detail.customerName=localStorage.name;
      this.detail.money=localStorage.money;
      this.detail.remark=localStorage.remark;
      this.detail.receiveTime=localStorage.receiveTime;
      
    }
  }
</script>
<style scoped>
  .detailshow{
    margin: 0 .5rem .5rem;
    padding: 1.25rem;
    background: #fff;
  }
  .back{
    position: relative;
    height: 3rem;
    line-height: 3rem;
    border-bottom: 1px solid #ccc;
    text-align: center;
    background: #fff;
    font-size: .8rem;
  }
  .back i{
    position: absolute;
    left: .8rem;
    top: 50%;
    width: .7rem;
    height: 1.4rem;
    margin-top: -.7rem;
    background: url(../assets/left.png) no-repeat;
    background-size: 100%;
  }
  .detailshow p{
    font-size: .8rem;
    line-height: 1.3rem;
    height: 1.3rem;
    color: #524d4d;
  }
  .detailshow .comment{
    margin-top: 1rem;
    height: auto;
  }
</style>
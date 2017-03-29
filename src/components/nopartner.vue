<template>
  <transition name="fade">
  <div class="nocon" ref="nocon">
    <span>暂无代理人相关信息</span>
  </div>
</transition>
</template>
<script>
  export default{
    mounted(){
    	let bh = document.body.scrollHeight;
    	this.$refs.nocon.style.height = (bh-60)+'px';
    }
  }
</script>
<style scoped>

  	.nocon{
	  	display: -webkit-box;
	  	-webkit-box-pack:center;
	  	-webkit-box-align:center;
	  	background: #f0f0f0;
  	}
  	.nocon span{
  		color: #c3c3c3;
  		font-size: .7rem;
  	}
  	.fade-enter-active, .fade-leave-active {
    	transition: opacity .3s
  	}
  	.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    	opacity: 0
  	}
</style>
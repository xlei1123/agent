// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// import store from './store.js'
// http://agentapi.euming.com   正式环境
// http://192.168.50.110:8081/AgentAPI  测试环境
// http://192.168.50.123:8085  本地环境
Vue.prototype.domain = 'http://agentapi.euming.com';

Vue.prototype.remind = function(str,fn){
	$('<div class="ku_tip">'+str+'</div>').css({
      "position": "fixed",
      "left": "50%",
      "bottom": "100px",
      "-webkit-transform":"translate(-50%,-50%)",
      "padding": ".75rem",
      "background": "rgba(99,99,99,0.8)",
      "color": "#fff",
      "fontSize": ".65rem",
      "borderRadius": "10px",
      "zIndex": 999,
      "maxWidth":"40rem"
    }).appendTo($('body'))
    setTimeout(function(){

      $('body').find('.ku_tip').remove();
      fn && fn();
    },2000);
}
import Loading from './components/loading';
Vue.use(Loading);
Vue.filter('telFilter',function(val){
  return val.substring(0,3)+"****"+val.substring(8,11); 
})

/* eslint-disable no-new */
// created by xianglei 2017
new Vue({
  el: '#app',
  router:router,
  // store,
  // render: h => h(App)
  template: '<App/>',
  components: { App }
})

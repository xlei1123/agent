import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/Login'
import Agreement from './components/Agreement'
import Content from './components/Content'
import Mine from './components/Mine'
import Performance from './components/Performance'
import Msg from './components/Msg'
import Detail from './components/Detail'
import Nopartner from './components/nopartner'
import Rule from './components/rule'
import AccountDetail from './components/AccountDetails'
import ModifyPass from './components/modifyPass'
// 忘记密码
import ForgetPwd from './components/forgetPwd/ForgetPwd'
import TypeOption from './components/forgetPwd/TypeOption'
import EnterTel from './components/forgetPwd/EnterTel'
import SendCode from './components/forgetPwd/SendCode'
import SetNewPwd from './components/forgetPwd/SetNewPwd'

// import PubItems from './components/forgetPwd/PubItems'
// 提现
import Postal from './components/postal/PostalBox'
import Postalcon from './components/postal/Postalcon'
import AddCard from './components/postal/AddCard'
import Postalover from './components/postal/Postalover'
import secCity from './components/public/secCity'
import secBank from './components/postal/secBank'
import cardSubBranch from './components/postal/cardSubBranch'
import updataCard from './components/postal/updataCard'
Vue.use(VueRouter);
const routes = [
    {path:'/login',component:Login},
    {path:'/agreement',component:Agreement},
    {path:'/rule',component:Rule},
    {path:'/modifypass',component:ModifyPass},
    {
      path:'/forgetPwd',component:ForgetPwd,
      children:[
        {path:'typeOption',component:TypeOption},
        {path:'enterTel/:type',component:EnterTel},
        {path:'sendCode/:type',component:SendCode},
        {path:'setNewPwd',component:SetNewPwd},
        {path:'',component:TypeOption}
      ]
    },
    {
      path:'/postal',component:Postal,
      children:[
        {path:'postalcon',component:Postalcon},
        {path:'addCard/:tel',component:AddCard},   
        {path:'postalover/:time',component:Postalover},
        {path:'secBank',component:secBank},
        {path:'subBranch',component:cardSubBranch},
        {path:'updataCard/:cardName/:cardNo',component:updataCard}
      ]
    },
    {
      path:'/content',component:Content,
      children:[
        {path:'msg',component:Msg},
        {path:'performance',component:Performance},
        {path:'performanceDetail',component:Detail},
        {path:'mine/:back',component:Mine},
        {path:'nopartner',component:Nopartner},
        {path:'accountDetail',component:AccountDetail},
        {path:'',redirect:'/content/performance'}
      ]
    },
    {path:'/public/secCity',component:secCity}
]
const router = new VueRouter({
  routes
});
if(!localStorage.getItem('login')){
 router.replace({path:'/login',component:Login})
}else{
  router.push('/content/performance')
}
export default router

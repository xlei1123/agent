<template>
  <transition name="fade">
  <div>
    <!-- 当月以及各月预览 -->
    <div v-show="showdata" class="showdata">
      <!-- 当月分成明细 -->
      <div class="now">
        <p class="clearfix">
          <span class="left top">{{targetIndex+1}}月代理分成明细</span>
          <span class="right top">出账时间 {{currentMon+1}}月1日</span>
        </p>
        <!-- 文字信息 -->
        <div class="info clearfix">
          <p><span>目标</span> <span>￥{{targetSum}}</span></p>
          <p><span class="sum">￥{{sum}}</span><br><span>回款</span></p>
        </div>
        <!-- 饼图 -->
        <div class="imginfo" id="imginfo"></div>
        <div class="other"></div>
        <!-- 饼图中分成 -->
        <div class="nowmoney"><span class="tit">分成：</span><span class="money">{{salary}}</span></div>
        <i class="moremonthes" @click="timeshow">更多月份</i>
      </div>
      <div class="performance clearfix">
        <p class="left rate">
          <span class="num black">{{rate}}</span><span class="num">-{{topRate}}</span><router-link to="/rule"class="rule"></router-link><br><span class="text">分成比例</span>
        </p>
        <p class="right other">
          <span class="num black">{{computedother}}</span><br><span class="text">达标差额</span>
        </p>
      </div>
      <!-- 时间表 -->
      <div v-show="timeBox" class="timeBox" @click="timehidden">
        <div class="time">
          <p class="tit">
            <span class="year">{{year}}</span>
            <span class="already"><i></i>已发放</span>
            <span class="await"><i></i>待发放</span>
          </p>
          <ul class="month_box clearfix">

            <li v-for="(value,index) in monthes" @click="getMonth(index)" :class="{active:index==targetIndex}">
              <!-- 0-待结算；1-待发放；2-已发放 -->
              <div v-if="value.status==1" class="await">{{index+1}}</div>
              <div v-else-if="value.status==2" class="already">{{index+1}}</div>
              <div v-else>{{index+1}}</div>
            </li>
            <i class="left" @click.stop="leftY"></i>
            <i class="right" @click.stop="rightY"></i>
          </ul>
        </div>
      </div>
      
      <div class="contract_list">
        <h3>合同明细</h3>
        <ul>
          <li v-for="(item,index) in items" class="contract" @click="show(index)">
              <p>合同编号：{{item.contractNo}}</p>
              <p>合同名称：{{item.customerName}}</p>
              <p>回款金额：{{item.money}}</p>
              <p>回款时间：{{item.receiveTime}}</p>
              <i class="detail"></i>
          </li>
        </ul>
        <div v-show="nodata" class="nodata">暂无数据</div>
      </div>
    </div>
    <loading v-show="unsuc"></loading>
  </div>
</transition>
</template>
<script>

  import router from '../router.js'
  let date = new Date();
  var month = date.getMonth();
  let year = date.getFullYear();
  var auth;
  // 画图
  import echarts from 'echarts';
  var myChart;
  var option;

  function _ajax(_this,year,month){
    $.ajax({
        type:'post',
        dataType:'json',
        async:false,
        url:_this.domain+'/agent/earningsDetail',
        data:{
          authcode:auth,
          year:year
        },
        success:function(json){
          // console.log(json)
          if(json.errno==0){
            _this.unsuc=false;
            if (json.data.length>0) {
              _this.year=year;
              _this.monthes=json.data;
            }else{
              _this.remind('没有该年度的数据')
            }
            if(_this.sum==0){
              _this.nodata=true;
            }
          }
          
        }
    })
  }

  var placeHolderStyle = {
    normal : {
        color: 'rgba(0,0,0,0)',
        label: {show:false},
        labelLine: {show:false}
    },
    emphasis : {
        color: 'rgba(0,0,0,0)'
    }
  };
  export default{
    data(){
      return {
        year:year,
        name:'',
        sum:0,
        targetSum:0,
        salary:0,
        items:[],
        showdata:true,
        detail:'',
        nodata:false,
        targetIndex:month,
        other:0,
        timeBox:false,
        rate:0,
        topRate:0,
        currentMon:1,
        monthes:[],
        unsuc:true
      } 
    },
    computed:{
        computedother:function(){
          return this.targetSum=='待定'?'待定':this.other
      }
    },
    mounted(){
       if(!localStorage.login){
          router.replace('/login');
        }
      let bd = document.getElementById('conview');
      let ht=document.documentElement.clientHeight || document.body.clientHeight;
      bd.style.minHeight=ht+'px';
      var _this= this; 
      auth=localStorage.getItem('auth');
      var name = localStorage.getItem('name');
      this.name=name;
     
      myChart = echarts.init(document.getElementById('imginfo'));
      option = {
        legend: {
            left:0,
            top:0,
            show:false,
            data:['已完成','剩余']
        },
        series: [
            {
                name:'访问来源',
                type:'pie',
                radius: ['80%', '89%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: false,
                        textStyle: {
                            fontSize: '30'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:[
                    {
                        value:_this.sum, 
                        name:'已完成'
                    },
                    {
                        value:_this.other,
                        name:'剩余',
                        itemStyle : placeHolderStyle
                    }
                ]
            }
        ],
        color:['#ffd37a','#fff']
      };
      // 绘制图表
      myChart.setOption(option);
       // _ajax(_this,year,month);
      _ajax(_this,year);
      this.getMonth(month);
    },
    methods:{
      show(index){
        let detail = this.items[index];
        localStorage.setItem('name',detail.customerName);
        localStorage.setItem('money',detail.money);
        localStorage.setItem('contractNo',detail.contractNo);
        localStorage.setItem('receiveTime',detail.receiveTime);
        router.push('/content/performanceDetail');
      },
      timeshow(){
        this.timeBox=true;
      },
      // monthes(){},
      getMonth(index){
        var _this= this;
        this.timeBox=false;
        this.currentMon=index+1;
        if(this.monthes[index]){
          this.items=this.monthes[index].contracts;
          if(!this.items){
            this.nodata=true;
          }else{
            this.nodata=false;
          }
          this.sum = this.monthes[index].sum==undefined?'0':this.monthes[index].sum;
          this.salary = this.monthes[index].salary==undefined?'0':this.monthes[index].salary;
          this.targetSum = this.monthes[index].targetSum==undefined?'待定':this.monthes[index].targetSum;
          this.other = this.targetSum -this.sum<0?0:(this.targetSum -this.sum);
          this.rate=this.monthes[index].rate;
          this.topRate=this.monthes[index].topRate;
          this.targetIndex = index;
          if(isNaN(this.other)){
            this.other=1;
          }
        }else{
          this.items=[];
          this.nodata=true;
        }
        if(this.sum==0){
          this.nodata=true;
        }
        option.series[0].data=[{value:_this.sum, name:'已完成'},{value:_this.other, name:'剩余',itemStyle : placeHolderStyle}];
        myChart.setOption(option,true);
      },
      timehidden(){
        this.timeBox=false;
      },
      leftY(){
        let _this = this;
        var ty = this.year;
        ty--;
        _ajax(_this,ty);
        if(isNaN(this.other)){
            this.other=1;
          }
        if(this.sum==0){
          this.nodata=true;
        }
        
      },
      rightY(){
        let _this = this;
        var ty = this.year;
        ty++;
        _ajax(_this,ty);
        if(isNaN(this.other)){
            this.other=1;
        }
        if(this.sum==0){
          this.nodata=true;
        }
      }
    }
  }
</script>
<style scoped>
  .fade-enter-active{
    transition: opacity 0.3s;
  }
  .fade-leave-active{
    transition: opacity 0s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0
  }
  .showdata{
    padding-bottom: 2.5rem;
    
  }
  .now{
    position: relative;
    height: 13rem;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    z-index: 1;
    background: #fff;

  }
  .left{
    float: left;
  }
  .right{
    float: right;
  }
  .top{
    margin:1rem;
    color: #828282;
    font-size: .6rem;
  }
  .now .info{
    text-align: center;
    position: relative;
    margin-top: 2.2rem;
  }
  .now .other{
    position: absolute;
    left: 50%;
    top: 0;
    width: 10rem;
    height: 10rem;
    background: url(../assets/performance1.1.png) no-repeat center;
    background-size: 86%;
    z-index: 2;
    margin-left: -5rem;
    margin-top: 1.5rem;
  }
  .now .info p{
    margin-bottom: .5rem;
  }
  .now .info p span{
    font-size: .75rem;
    color: #372f2f;
  }
  .now .info p .sum{
    font-size: 1rem;
    font-weight: bold;
    color: #100e0e;
  }
  .now .imginfo{
    position: absolute;
    left: 50%;
    top: 0rem;
    height: 10rem;
    width: 10rem;
    z-index: 3;
    margin-left: -5rem;
    margin-top: 1.5rem;
  }
  .now .nowmoney{
    text-align: center;
    position: absolute;
    width: 10rem;
    height: 2rem;
    left: 50%;
    top: 50%;
    z-index: 99;
    margin-top: 4.5rem;
    margin-left: -5rem;
  }
  .now .nowmoney .tit{
    font-size: .6rem;
  }
  .now .nowmoney .money{
    font-size: 1rem;
    color: #daae5c;
  }
  .now .nowmoney .money i{
    font-size: .6rem;
    font-style: normal;
  }
  .now .con{
    height: 3rem;
    text-align: center;
  }
  .now .total{
    height: 2rem;
  }
  .now .moremonthes{
    position: absolute;
    right: .75rem;
    bottom: .75rem;
    font-style: normal;
    padding: .25rem;
    background: #e2bb73;
    border-radius: 5px;
    color: #fff;
  }
  .performance{
    border-top: 1px solid #f0f0f0;
    padding:.75rem 0;
    background: #fff;
  }
  .performance .rate{
    padding-left: 2rem;
    text-align: center;
  }
  .performance .other{
    padding-right: 2rem;
    text-align: center;
  }
  .performance .num{
    font-size: .75rem;
    
  }
  .performance .rule{
    position: relative;
    z-index: 999;
    display: inline-block;
    margin-left: .5rem;
    width: 1rem;
    height: 1rem;
    background: url(../assets/rule2.png) no-repeat;
    background-size: 100%;
  }
  .performance span{
    color: #828282;
  }
  .performance .black{
    color: black;
  }
  .performance .text{
    margin-top: .25rem;
    font-size: .6rem;
  }
  .timeBox{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding-bottom: 60px;
    background: rgba(0,0,0,.4);
    z-index: 999;
  }
  .time{
    position: absolute;
    top: 50%;
    width: 14.75rem;
    margin: .5rem 1.25rem 0;
    height: 7rem;
    background: url(../assets/datebg.png) no-repeat;
    background-size: 100%;
    padding: 0 0 0 1.25rem;
  }
  .time .tit{
    height: 1rem;
    padding-top: .75rem;
    font-size: .65rem;
  }
  .time .left{
    position: absolute;
    left: -1rem;
    top: 50%;
    width: .5rem;
    height: 1rem;
    margin-top: .5rem;
    background: url(../assets/left.png) no-repeat;
    background-size: 100%;
  }
  .time .right{
    position: absolute;
    right: -1rem;
    top: 50%;
    width: .5rem;
    height: 1rem;
    margin-top: .5rem;
    background: url(../assets/right.png) no-repeat;
    background-size: 100%;
  }
  .time .tit .year{
    font-size: .9rem;
    color: #372f2f;
    margin-right: 6rem;
  }
  .time .tit span{
    font-size: .5rem;
    white-space: nowrap;
  }
  .time .tit span i{
    display: inline-block;
    margin-right: .2rem;
    width: .3rem;
    height: .3rem;
    border-radius: 50%;
    background: #8ae088;
  }
  .time .tit .await i{
    background: #ffcf4d;
  }
  .time .month_box li div{
    font-size: .9rem;
    border-radius: 50%;
    text-align: center;
  }
  .time .month_box li div.already{
    background: #8ae088;
    
  }
  .time .month_box li div.await{
    background: #ffcf4d;
  }
  .time .month_box .active div{
    width: 1.2rem;
    height: 1.2rem;
    border: 2px solid #70d8ff;
  }
  .time .month_box li{
    float: left;
    text-align: center;
    margin-right: 1.15rem;
    margin-top: 1.15rem;
    width: 1.25rem;
    height: 1.25rem;
    line-height: 1.25rem;
  }
  .contract_list{
    margin-top: .75rem;
  }
  .contract_list .nodata{
    padding-left: 1rem;
  }
  .contract_list h3{
    font-size: .9rem;
    color: #372f2f;
    margin-bottom: .5rem;
    padding-left: 1rem;
  }
  .contract_list .detailBox{
    display: block;
  }
  .contract{
    position: relative;
    width: 100%;
    margin:.5rem auto 0;
    padding: .5rem;
    padding-left: 1rem;
    box-sizing:border-box;
    margin-bottom: 10px;
    background: #fff;
  }

  .contract p{
    font-size: .7rem;
    height: 1.2rem;
    line-height: 1.2rem;
  }
  .contract .detail{
    width: .9rem;
    height: 1.8rem;
    position: absolute;
    right: 0;
    top: 2.5rem;
    background: url(../assets/arrow-right.png) no-repeat;
    background-size: 100%;
  }


 

</style>
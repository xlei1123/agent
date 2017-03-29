<template>
  <div class="rule">
    <table>
      <thead>
        <th colspan="4">销售伙伴提成比例 （个人）</th>
      </head>
      <tr>
        <th>级别</th>
        <th>到款下限</th>
        <th>到款上线</th>
        <th>提成比例</th>
      </tr>
      <tr>
        <td>p1</td>
        <td>1000</td>
        <td>48000</td>
        <td>16%</td>
      </tr>
      <tr>
        <td>p2</td>
        <td>48000</td>
        <td>80000</td>
        <td>18%</td>
      </tr>
      <tr>
        <td>p3</td>
        <td>80001</td>
        <td>160000</td>
        <td>20%</td>
      </tr>
      <tr>
        <td>p4</td>
        <td>160001</td>
        <td>320000</td>
        <td>24%%</td>
      </tr>
      <tr>
        <td>p5</td>
        <td>320001</td>
        <td>620000</td>
        <td>28%%</td>
      </tr>
      <tr>
        <td>p6</td>
        <td>620001</td>
        <td><span></span></td>
        <td>35%</td>
      </tr>
    </table>

    <h3 class="partner">渠道伙伴项目佣金制度：</h3>
     <table>
      <thead>
        <th colspan="4">渠道销售伙伴提成比例 （机构）</th>
      </head>
      <tr>
        <th>级别</th>
        <th>到款下限</th>
        <th>到款上线</th>
        <th>提成比例</th>
      </tr>
      <tr>
        <td>p5</td>
        <td>320001</td>
        <td>620000</td>
        <td>28%</td>
      </tr>
      <tr>
        <td>p6</td>
        <td>620001</td>
        <td>1000000</td>
        <td>35%</td>
      </tr>
      <tr>
        <td>p7</td>
        <td>1000001</td>
        <td>1500000</td>
        <td>39%</td>
      </tr>
      <tr>
        <td>p8</td>
        <td>1500001</td>
        <td>2000000</td>
        <td>42%</td>
      </tr>
      <tr>
        <td>p9</td>
        <td>2000001</td>
        <td>3000000</td>
        <td>48%</td>
      </tr>
      <tr>
        <td>p10</td>
        <td>3000001</td>
        <td>5000000</td>
        <td>52%</td>
      </tr>
      <tr>
        <td>p11</td>
        <td>5000001</td>
        <td><span></span></td>
        <td>55%</td>
      </tr>
    </table>
  </div>
</template>
<script>
  
  export default{
    methods:{
      
    },
    mounted(){
    }
  }
</script>
<style scoped>
  .rule{
    padding: 10px;
  }
  .partner{
    font-size: .9rem;
    margin-bottom: 10px;
  }
  table{
    width: 100%;
    text-align: center;
    margin-bottom: 30px;
  }
  table th{
    font-size: .8rem;
  }
  table td{
    font-size: .6rem;
  }
</style>


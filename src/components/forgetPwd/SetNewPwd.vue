<template>
  <div>
    <div class="header" >
      <i @click="back"></i>
      <h3>重置密码</h3>
    </div>
    <div class="content">
      <div class="telBox">
        <span class="tel">新密码</span>
        <input type="text" class="telInput" v-model="pwd" placeholder="请输入新密码 6～20位数字、字母或组合">
      </div>
      <button @click="next">提交</button>
    </div>
  </div>
</template>
<script>
  import router from '../../router';
  import Md5 from 'md5';
  export default{
    data(){
      return{
        mobile:'',
        pwd:'',
        pubItems:''
      }
    },
    mounted(){
      var _this=this;
      this.mobile=localStorage.getItem('mobile');
    },
    methods:{
      // 提交新密码
      next(){
        var _this=this;
        var auth=localStorage.getItem('auth');
        if(this.pwd.length<6 || this.pwd.length>20){
          // 不符合要求长度
          this.remind('请输入新密码 6～20位数字、字母或组合');
        }else{
          $.ajax({
            type:'post',
            dataType:'json',
            url:_this.domain+'/agent/resetPassword',
            data:{
                authcode:auth,
                password:Md5(_this.pwd)
            },
            success:function(json){
                console.log(json)
                // 密码重置成功
                if(json.errno==0){
                    _this.remind('密码重置成功',function(){
                        router.push('/login');
                    })
                   // 密码格式错误
                }else if(json.errno==1){
                    _this.remind('密码格式错误')
                    // 授权无效；
                }else if(json.errno==20001){
                    _this.remind('授权无效')
                }else{
                    _this.remind('请重试',function(){
                      router.push('/forgetPwd')
                    })
                }
                
            }
        })
        }
        
      },
      back(){
        router.go(-1);
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
  .telBox{
    height: 2rem;
    line-height: 2rem;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    background: #fff;
  }
  .telBox .tel{
    padding:0 .5rem;
    border-right: 1px solid #999;
    font-size: 14px;
  }
  .telBox .telInput{
    border: none;
    height: .8rem;
    width: 15rem;
    outline: none;
    font-size: 14px;
  }
  button{
    display: block;
    margin: 3rem auto 0;
    width: 17rem;
    height: 2rem;
    outline: none;
    background: #fff;
    border: 1px solid #ccc;
    font-size: 14px;
  }
</style>


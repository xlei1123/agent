<template>
    <div class="loader-inner ball-pulse box">
      <div></div>
      <div></div>
      <div></div>
    </div>
</template>
<script>

</script>
<style scoped>
.box{
  position: fixed;
  top: 50%;
  left: 50%;
  margin-left: -30px;
}
.ball-pulse > div:nth-child(1) {
  -webkit-animation: scale 0.75s 0.12s infinite cubic-bezier(.2, .68, .18, 1.08);
  animation: scale 0.75s 0.12s infinite cubic-bezier(.2, .68, .18, 1.08);
}
.ball-pulse > div:nth-child(2) {
    -webkit-animation: scale 0.75s 0.24s infinite cubic-bezier(.2, .68, .18, 1.08);
    animation: scale 0.75s 0.24s infinite cubic-bezier(.2, .68, .18, 1.08);
}
.ball-pulse > div:nth-child(3) {
  -webkit-animation: scale 0.75s 0.36s infinite cubic-bezier(.2, .68, .18, 1.08);
  animation: scale 0.75s 0.36s infinite cubic-bezier(.2, .68, .18, 1.08);
}
.ball-pulse > div {
    background-color: #999;
    width: 15px;
    height: 15px;
    border-radius: 100%;
    margin: 2px;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    display: inline-block;
}
@keyframes scale{
  30% {
    -webkit-transform: scale(0.3);
    transform: scale(0.3);
  }
  100% {
      -webkit-transform: scale(1);
      transform: scale(1);
  }
}

</style>
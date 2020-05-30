<template>
  <div id="x-shade-loading-1">
    <div class="object"></div>
    <div class="object"></div>
    <div class="object"></div>
    <div class="object"></div>
    <div class="object"></div>
    <div class="object"></div>
    <div class="object"></div>
    <div class="object"></div>
    <div class="object"></div>
  </div>
</template>
<style lang='scss' scoped>
@import "@/css/common.scss";
#x-shade-loading-1 {
  position: absolute;
  left: 50%;
  bottom: 0;
  height: 50px;
  width: 300px;
  margin-left: -150px;
  .object {
    width: 18px;
    height: 18px;
    background-color: $color-primary;
    float: left;
    margin-top: 15px;
    margin-right: 15px;
    -moz-border-radius: 50% 50% 50% 50%;
    -webkit-border-radius: 50% 50% 50% 50%;
    border-radius: 50% 50% 50% 50%;
    -webkit-animation: object 1s infinite;
    animation: object 1s infinite;
  }
  .object:last-child {
    margin-right: 0px;
  }
  .object:nth-child(9) {
    -webkit-animation-delay: 0.9s;
    animation-delay: 0.9s;
  }
  .object:nth-child(8) {
    -webkit-animation-delay: 0.8s;
    animation-delay: 0.8s;
  }
  .object:nth-child(7) {
    -webkit-animation-delay: 0.7s;
    animation-delay: 0.7s;
  }
  .object:nth-child(6) {
    -webkit-animation-delay: 0.6s;
    animation-delay: 0.6s;
  }
  .object:nth-child(5) {
    -webkit-animation-delay: 0.5s;
    animation-delay: 0.5s;
  }
  .object:nth-child(4) {
    -webkit-animation-delay: 0.4s;
    animation-delay: 0.4s;
  }
  .object:nth-child(3) {
    -webkit-animation-delay: 0.3s;
    animation-delay: 0.3s;
  }
  .object:nth-child(2) {
    -webkit-animation-delay: 0.2s;
    animation-delay: 0.2s;
  }
  @-webkit-keyframes object {
    50% {
      -ms-transform: translate(0, -50px);
      -webkit-transform: translate(0, -50px);
      transform: translate(0, -50px);
    }
  }
  @keyframes object {
    50% {
      -ms-transform: translate(0, -50px);
      -webkit-transform: translate(0, -50px);
      transform: translate(0, -50px);
    }
  }
}
</style>

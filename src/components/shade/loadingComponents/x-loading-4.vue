<template>
  <div id="loading-center-absolute">
    <div class="object" id="object_one"></div>
    <div class="object" id="object_two"></div>
    <div class="object" id="object_three"></div>
    <div class="object" id="object_four"></div>
    <div class="object" id="object_five"></div>
  </div>
</template>
<style lang='scss' scoped>
@import "@/css/common.scss";
#loading-center-absolute {
  position: absolute;
  left: 48%;
  top: 86%;
  height: 20px;
  width: 100px;
  margin-top: -10px;
  margin-left: -50px;
}
.object {
  width: 20px;
  height: 20px;
  background-color: $color-primary;
  -moz-border-radius: 50% 50% 50% 50%;
  -webkit-border-radius: 50% 50% 50% 50%;
  border-radius: 50% 50% 50% 50%;
  margin-right: 20px;
  margin-bottom: 20px;
  position: absolute;
}

#object_one {
  -webkit-animation: object 2s linear infinite;
  animation: object 2s linear infinite;
}
#object_two {
  -webkit-animation: object 2s linear infinite -0.4s;
  animation: object 2s linear infinite -0.4s;
}
#object_three {
  -webkit-animation: object 2s linear infinite -0.8s;
  animation: object 2s linear infinite -0.8s;
}
#object_four {
  -webkit-animation: object 2s linear infinite -1.2s;
  animation: object 2s linear infinite -1.2s;
}
#object_five {
  -webkit-animation: object 2s linear infinite -1.6s;
  animation: object 2s linear infinite -1.6s;
}

@-webkit-keyframes object {
  0% {
    left: 100px;
    top: 0;
  }
  80% {
    left: 0;
    top: 0;
  }
  85% {
    left: 0;
    top: -20px;
    width: 20px;
    height: 20px;
  }
  90% {
    width: 40px;
    height: 15px;
  }
  95% {
    left: 100px;
    top: -20px;
    width: 20px;
    height: 20px;
  }
  100% {
    left: 100px;
    top: 0;
  }
}
@keyframes object {
  0% {
    left: 100px;
    top: 0;
  }
  80% {
    left: 0;
    top: 0;
  }
  85% {
    left: 0;
    top: -20px;
    width: 20px;
    height: 20px;
  }
  90% {
    width: 40px;
    height: 15px;
  }
  95% {
    left: 100px;
    top: -20px;
    width: 20px;
    height: 20px;
  }
  100% {
    left: 100px;
    top: 0;
  }
}
</style>

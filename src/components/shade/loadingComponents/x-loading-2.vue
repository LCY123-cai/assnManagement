<template>
  <div id="loading-center-absolute">
    <div class="object" id="object_one"></div>
    <div class="object" id="object_two"></div>
    <div class="object" id="object_three"></div>
    <div class="object" id="object_four"></div>
  </div>
</template>
<style lang='scss' scoped>
@import "@/css/common.scss";
#loading-center-absolute {
  position: absolute;
  left: 50%;
  top: 80%;
  height: 100px;
  width: 100px;
  margin-top: -50px;
  margin-left: -50px;
}
.object {
  width: 25px;
  height: 25px;
  background-color: $color-primary;
  margin-right: 50px;
  float: left;
  margin-bottom: 50px;
}
.object:nth-child(2n + 0) {
  margin-right: 0px;
}

#object_one {
  -webkit-animation: object_one 2s infinite;
  animation: object_one 2s infinite;
}
#object_two {
  -webkit-animation: object_two 2s infinite;
  animation: object_two 2s infinite;
}
#object_three {
  -webkit-animation: object_three 2s infinite;
  animation: object_three 2s infinite;
}
#object_four {
  -webkit-animation: object_four 2s infinite;
  animation: object_four 2s infinite;
}

@-webkit-keyframes object_one {
  25% {
    -webkit-transform: translate(75px, 0) rotate(-90deg) scale(0.5);
  }
  50% {
    -webkit-transform: translate(75px, 75px) rotate(-180deg);
  }
  75% {
    -webkit-transform: translate(0, 75px) rotate(-270deg) scale(0.5);
  }
  100% {
    -webkit-transform: rotate(-360deg);
  }
}

@keyframes object_one {
  25% {
    transform: translate(75px, 0) rotate(-90deg) scale(0.5);
    -webkit-transform: translate(75px, 0) rotate(-90deg) scale(0.5);
  }
  50% {
    transform: translate(75px, 75px) rotate(-180deg);
    -webkit-transform: translate(75px, 75px) rotate(-180deg);
  }
  75% {
    transform: translate(0, 75px) rotate(-270deg) scale(0.5);
    -webkit-transform: translate(0, 75px) rotate(-270deg) scale(0.5);
  }
  100% {
    transform: rotate(-360deg);
    -webkit-transform: rotate(-360deg);
  }
}

@-webkit-keyframes object_two {
  25% {
    -webkit-transform: translate(0, 75px) rotate(-90deg) scale(0.5);
  }
  50% {
    -webkit-transform: translate(-75px, 75px) rotate(-180deg);
  }
  75% {
    -webkit-transform: translate(-75px, 0) rotate(-270deg) scale(0.5);
  }
  100% {
    -webkit-transform: rotate(-360deg);
  }
}

@keyframes object_two {
  25% {
    transform: translate(0, 75px) rotate(-90deg) scale(0.5);
    -webkit-transform: translate(0, 75px) rotate(-90deg) scale(0.5);
  }
  50% {
    transform: translate(-75px, 75px) rotate(-180deg);
    -webkit-transform: translate(-75px, 75px) rotate(-180deg);
  }
  75% {
    transform: translate(-75px, 0) rotate(-270deg) scale(0.5);
    -webkit-transform: translate(-75px, 0) rotate(-270deg) scale(0.5);
  }
  100% {
    transform: rotate(-360deg);
    -webkit-transform: rotate(-360deg);
  }
}

@-webkit-keyframes object_three {
  25% {
    -webkit-transform: translate(0, -75px) rotate(-90deg) scale(0.5);
  }
  50% {
    -webkit-transform: translate(75px, -75px) rotate(-180deg);
  }
  75% {
    -webkit-transform: translate(75px, 0) rotate(-270deg) scale(0.5);
  }
  100% {
    -webkit-transform: rotate(-360deg);
  }
}

@keyframes object_three {
  25% {
    transform: translate(0, -75px) rotate(-90deg) scale(0.5);
    -webkit-transform: translate(0, -75px) rotate(-90deg) scale(0.5);
  }
  50% {
    transform: translate(75px, -75px) rotate(-180deg);
    -webkit-transform: translate(75px, -75px) rotate(-180deg);
  }
  75% {
    transform: translate(75px, 0) rotate(-270deg) scale(0.5);
    -webkit-transform: translate(75px, 0) rotate(-270deg) scale(0.5);
  }
  100% {
    transform: rotate(-360deg);
    -webkit-transform: rotate(-360deg);
  }
}

@-webkit-keyframes object_four {
  25% {
    -webkit-transform: translate(-75px, 0) rotate(-90deg) scale(0.5);
  }
  50% {
    -webkit-transform: translate(-75px, -75px) rotate(-180deg);
  }
  75% {
    -webkit-transform: translate(0, -75px) rotate(-270deg) scale(0.5);
  }
  100% {
    -webkit-transform: rotate(-360deg);
  }
}

@keyframes object_four {
  25% {
    transform: translate(-75px, 0) rotate(-90deg) scale(0.5);
    -webkit-transform: translate(-75px, 0) rotate(-90deg) scale(0.5);
  }
  50% {
    transform: translate(-75px, -75px) rotate(-180deg);
    -webkit-transform: translate(-75px, -75px) rotate(-180deg);
  }
  75% {
    transform: translate(0, -75px) rotate(-270deg) scale(0.5);
    -webkit-transform: translate(0, -75px) rotate(-270deg) scale(0.5);
  }
  100% {
    transform: rotate(-360deg);
    -webkit-transform: rotate(-360deg);
  }
}
</style>

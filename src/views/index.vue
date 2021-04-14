<template>
  <div class="app-container home">
   <div class="title">
     <h1 data-text="欢迎登陆海外健康管理平台">欢迎登陆海外健康管理平台</h1>
<!--     <div>欢迎登陆海外健康管理平台</div>-->
   </div>

  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      // 版本号
      version: "3.4.0",
    };
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    },
  },
};
</script>

<style scoped lang="scss">
.title{
  text-align: center;
  width: 100%;
  position: absolute;
  top: calc(30% - 40px);
  letter-spacing: 15px;
  font-family: "楷体";
  font-weight: 600;
}
body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #fff;
  background: linear-gradient(to right, #24243e, #141E30, #0f0c29); }

h1 {
  text-transform: Uppercase;
  margin-bottom: .5em;
  font-family: 'Rubik', sans-serif;
  font-size: 5rem;
  color: #E4E5E6; }

h1 {
  position: relative;
  background: linear-gradient(to right, rgba(0,106,210), rgba(0,119,234), rgba(30,140,249));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; }

h1:before,
h1:after {
  content: attr(data-text);
  width: 100%;
  position: absolute;
  top: 0;
  left: 0; }

h1:before {
  z-index: -1;
  text-shadow: -0.001em -0.001em 1px rgba(68,180,150,.15)}

h1:after {
  z-index: -2;
  text-shadow: 10px 10px 10px rgba(0,100,210,.5), 20px 20px 20px rgba(0,119,223,.4), 30px 30px 30px rgba(30,140,249,.1);
  mix-blend-mode: multiply; }

h2 {
  margin-top: -1.15em;
  font-family: 'Pirata One', cursive;
  font-size: 3rem;
  color: #F7971E;
  text-align: center;}

h2 spam {
  font-size: .5em;
}
</style>


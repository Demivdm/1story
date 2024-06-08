<template>
  <section class="nav">
    <a href="/">
      <h1>1Story</h1>
    </a>
  </section>
</template>
<style scoped lang="scss">
@import "/scss/vars/_breakpoints.scss";

$component: "nav";
.#{$component} {
  margin: 0;
  top: 60px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  @include sm{
  transform: translate(-50%, -100%);
      
     
    }
  h1{
    @include sm{
      font-size: 30px;
      margin: 0;
     
    }
    }
  
}
</style>

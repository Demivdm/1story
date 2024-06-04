<template>
  
        <a href="/">
        <h1>1Story</h1>
        </a>

   
</template>
<style lang="scss" scoped>
 @import "/scss/vars/_breakpoints.scss";

h1{
  margin: 0;
  top: 50px;
  position: absolute;
 left: 50%;
 transform: translate(-50%, -50%);
 z-index: 1;
 @include sm{
        font-size: 30px;
 }

}
</style>
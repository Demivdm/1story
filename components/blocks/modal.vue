<template>
    <div class="modal" @click.self="close">
      <div class="modal-content">
        <main>
          <slot ></slot>
        </main>
      </div>
    </div>
  </template>
  
  <script setup>
// defineProps(){
//     props: ['close']

// }

  </script>
  
  <style lang="scss" scoped>
  /* .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    min-width: 300px;
  }
  .modal-header,
  .modal-footer {
    margin-bottom: 10px;
  } */
  @import "/scss/mixins/_index.scss";
  @import "/scss/vars/_breakpoints.scss";
  @import "/scss/vars/_colors.scss";

 .modal{

// height: 60vh;
width:90vw;
border-radius: 24px;
position: relative;
top: 25vh;
left: 50%;
transform: translate(-50%,-50%);
margin: 0 5rem 0 0rem;
padding: 0;

@include primary-gradient;
@include sm{
  width: 100vw;
  top: 15rem;
  // margin: 1rem;
}
.modal-content{
  padding: 3rem;
min-height: min-content;
@include sm{
      padding:1rem;
    }
 


}

}
  </style>
  
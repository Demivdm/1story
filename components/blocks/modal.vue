<template>
    <div class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <header class="modal-header">
          <slot name="header"></slot>
        </header>
        <main class="modal-body">
          <slot name="body"></slot>
        </main>
        <footer class="modal-footer">
          <slot name="footer"></slot>
        </footer>
      </div>
    </div>
  </template>
  
  <script setup>
defineProps(){
    props: ['close']

}

  </script>
  
  <style scoped>
  .modal-overlay {
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
  }
  </style>
  
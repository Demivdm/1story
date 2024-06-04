<template>
  <div class="modal">
    <div class="modal__modal-content">
      <main>
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
@import "/scss/mixins/_index.scss";
@import "/scss/vars/_breakpoints.scss";
@import "/scss/vars/_colors.scss";
$component: "modal";

.#{$component} {
  width: 90vw;
  border-radius: 24px;
  position: relative;
  top: 25vh;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0 5rem 0 0rem;
  padding: 0;

  @include primary-gradient;
  @include sm {
    width: 100vw;
    top: 15rem;
  }
  &__modal-content {
    padding: 3rem;
    min-height: min-content;
    @include sm {
      padding: 1rem;
    }
  }
}
</style>

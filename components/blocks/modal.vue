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
  max-width: 1296px;
  border-radius: 24px;
  position: relative;
  top: 25vh;
  left: 50%;
  max-height: 904px;
  transform: translate(-50%, -50%);
  padding: 0;

  @include primary-gradient;
  @include sm {
    width: 100vw;
    top: 15rem;
  }
  &__modal-content {
    padding:72px;
    min-height: min-content;
    @include sm {
      padding: 1rem;
    }
  }
}
</style>

<template>
  <BlocksNav></BlocksNav>

  <div class="login" :class="{ 'login__login-background': !currentUser }">
    <span v-if="!currentUser">
      <ElementsLogin></ElementsLogin>
    </span>
    <span v-else-if="currentUser" class="login__page-wrapper">
      <h2>Deel jouw zin</h2>
      <p>
        Je bent nu ingelogd, er is een begin gemaakt aan het verhaal van de
        maand. Deel nu jouw zin met je collega's om het verhaal voort te zetten.
      </p>
      <div class="login__buttons">
        <ElementsButton to="/writeStory">Starten</ElementsButton>
        <!-- <ElementsScndButton to="/allStories">Bekijk alle verhalen</ElementsScndButton> -->
      </div>
    </span>
    <span v-else>
      <p>Oeps er lijkt iets mis te zijn gegaan</p>
    </span>
  </div>
</template>
<script setup>
const currentUser = useCurrentUser();
</script>
<style lang="scss">
@import "../scss/vars/_breakpoints.scss";
@import "/scss/mixins/index";
@import "/scss/vars/colors";

$component: "login";

.#{$component} {
  display: grid;
  place-items: center;
  height: 100vh;
  text-align: center;
  margin: auto;
  @include primary-background;

  @include sm {
    margin: 0;
  }

  &__login-background {
    background: $secondary-background;
  }

  &__buttons {
    display: flex;
    gap: 20px;
    justify-content: center;
    @include sm {
      flex-direction: column;
    }
  }

  &__page-wrapper {
    width: 50vw;
  }
  span p {
    color: #010309;
  }
}
</style>

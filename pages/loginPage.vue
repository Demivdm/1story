<template>
    <BlocksNav></BlocksNav>

  <div class="login-wrapper">
    <span v-if="!currentUser">
        <ElementsLogin></ElementsLogin>
      </span>
    <span v-else-if="currentUser">
        <h2>
        Deel jouw zin van de week {{ currentUser.displayName }}
        </h2>
        <p>Je bent nu ingelogd, er is een begin gemaakt aan het verhaal van de maand. Deel nu jouw zin met je collega's om het verhaal voort te zetten.</p>
        <div class="buttons" >
          <ElementsButton to="/writeStory">Deel je zin</ElementsButton>
      <ElementsScndButton to="/allStories">Bekijk alle verhalen</ElementsScndButton>
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

.buttons{
  display: flex;
  gap: 20px;
  justify-content: center;
  @include sm{
    flex-direction: column;
  }
}
.login-wrapper{
display: grid;
place-items: center;
height: 100vh;
text-align: center;
width: 50vw;
margin: auto;
// background: #F6F7FE;


@include sm{
    width: 80vw;
  }
}
span p{
  color: #010309;
}
</style>
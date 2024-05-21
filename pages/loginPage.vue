<template>
    <BlocksNav></BlocksNav>

    <span v-if="!currentUser">
        <ElementsLogin></ElementsLogin>
      </span>
    <span v-else-if="currentUser">
        <h2>
        Deel jouw zin van de week {{ currentUser.displayName }}
        </h2>
        <p>Je bent nu ingelogd, er is een begin gemaakt aan het verhaal van de maand. Deel nu jouw zin met je collega's om het verhaal voort te zetten.</p>
    
      <ElementsButton to="/writeStory">Deel je zin</ElementsButton>
      <ElementsButton to="/allStories">Bekijk alle verhalen</ElementsButton>
      </span>
      <span v-else>
        <p>Oeps er lijkt iets mis te zijn gegaan</p>
      </span>
     
</template>
<script setup>
  const currentUser = useCurrentUser();

</script>
<style>

</style>
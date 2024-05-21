<template>
    <BlocksNav></BlocksNav>
    <ElementsLogin></ElementsLogin>
    <ElementsBackButton></ElementsBackButton>
    <span v-if="currentUser">
        <h2>
        Welcome {{ currentUser.displayName }}
        </h2>
        <p>Je bent nu ingelogd, en kunt een zin schrijven door op de onderstaande knop te klikken.</p>
 
    
      <ElementsButton to="/writeStory">Deel je zin</ElementsButton>
      </span>
</template>
<script setup>
  const currentUser = useCurrentUser();

</script>
<style>

</style>
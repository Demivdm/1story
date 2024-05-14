<template>
  <h2>Bedankt voor het delen</h2>
  <p>Hieronder kun je nogmaals zien wat je hebt ingevuld. Foutje gemaakt? Geen probleem, je kunt het nu nog aanpassen. Als alles naar wens is, kun je het tabblad sluiten of andere verhalen bekijken.</p>
 <ElementsButton>Verzenden</ElementsButton>
 <ElementsButton>Bewerken</ElementsButton>
 <ElementsButton>Bekijk alle verhalen</ElementsButton>

 
  <!-- <div class="confirm-pop-up" v-if="showConfirm">
    <div class="confirm-pop-up-content">
      <p>Weet je zeker of je deze zin wilt toevoegen?</p>
      BR ERUIT HALEN TIJDENS VORMGEVEN 
     {{ newSentence }}<br>
      <button @click="() => confirmAddSentence()">Ja, ik wil mijn zin toevoegen</button>
      <button @click="cancelAddSentence()">Nee, ik wil verder gaan met bewerken</button>
    </div>
  </div> -->
</template>
<script>
const router = useRouter();


export default {
  name: 'confirm'
};
</script>
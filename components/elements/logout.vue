<template>
    <span v-if="currentUser">
      <ElementsButton :user="currentUser" @click="logout">
        Logout
      </ElementsButton>
     
      <pre> <p>{{ logoutMessage.value }}</p></pre>
      <p>{{ logoutMessage }}</p>
    </span>
  </template>
  
  <script setup>

  
  const auth = getAuth();
  const router = useRouter();
  const logoutMessage = ref('');
  const currentUser = useCurrentUser();
  
  const logout = async () => {
    try {
      await signOut(auth);
      logoutMessage.value = "Logging out";
      setTimeout(() => {
        router.push('/');
        logoutMessage.value = ''; 
      }, 5000);
    } catch (error) {
      console.error("Error signing out: ", error);
      router.push('/404');
    }
  };
  </script>
  
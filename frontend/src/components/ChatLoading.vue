<template>
  <div class="chat-message assistant">
    <div class="loader"></div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1a73e8;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>

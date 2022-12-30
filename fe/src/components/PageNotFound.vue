<template>
  <div class="container">
    <h1>404</h1>
    <h2>UH OH! You're lost.</h2>
    <p class="container-description">The page you are looking for does not exist.
      How you got here is a mystery. But you can click the button below
      to go back to the homepage.
    </p>
    <router-link :to="'/users'" class="btn btn-secondary btn-back">
      Home
    </router-link>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  max-width: 600px;
  align-items: center;
}

.container-description {
  text-align: center;
}
</style>
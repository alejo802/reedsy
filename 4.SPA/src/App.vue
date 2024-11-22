<template>
  <div id="app">
    <header>
      <h1>Most Popular Books of All Time</h1>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style lang="scss">
/* Global Styles */
@import "@/assets/styles/main.scss";

#app {
  font-family: Arial, sans-serif;
  color: #333;

  header {
    text-align: center;
    padding: 1rem;
    background-color: #f9f9f9;
    border-bottom: 1px solid #ddd;

    h1 {
      font-size: 1.8rem;
      font-weight: 600;
      color: #333;
    }
  }

  main {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    background-color: #fff;
  }
}
</style>
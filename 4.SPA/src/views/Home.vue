<template>
    <div class="home">
      <h1>Most Popular Books of All Time</h1>
      <BookList />
    </div>
  </template>
  
  <script>
  import BookList from '@/components/BookList.vue';
  
  export default {
    components: {
      BookList,
    },
  };
  </script>
  
  <style scoped>
  .home {
    max-width: 900px;
    margin: 0 auto;
    padding: 1rem;
  
    h1 {
      text-align: center;
      margin-bottom: 2rem;
      font-size: 2rem;
      color: #343a40;
    }
  }
  </style>
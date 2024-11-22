<template>
    <div class="not-found">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <router-link to="/">Go back to Home</router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: "NotFound",
  };
  </script>
  
  <style scoped>
  .not-found {
    text-align: center;
    margin: 2rem auto;
    font-family: Arial, sans-serif;
  
    h1 {
      font-size: 2rem;
      color: #343a40;
    }
  
    p {
      margin: 1rem 0;
      color: #6c757d;
    }
  
    a {
      color: #007bff;
      text-decoration: underline;
  
      &:hover {
        text-decoration: none;
      }
    }
  }
  </style>
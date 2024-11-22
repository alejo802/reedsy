<template>
    <div class="book-details">
      <h1>{{ book.title }}</h1>
      <img :src="book.cover" alt="Book Cover" />
      <p><strong>Author:</strong> {{ book.author }}</p>
      <p><strong>Published:</strong> {{ book.published }}</p>
      <p><strong>Rating:</strong> {{ book.rating }}</p>
      <p>{{ book.description }}</p>
      <router-link to="/">Go back to Home</router-link>
    </div>
  </template>
  
  <script>
  import books from "@/data/books.json";
  
  export default {
    name: "BookDetails",
    props: ["id"],
    data() {
      return {
        book: {},
      };
    },
    created() {
      this.fetchBook();
    },
    methods: {
      fetchBook() {
        this.book = books.find((b) => b.id === parseInt(this.id));
      },
    },
  };
  </script>
  
  <style scoped>
  .book-details {
    max-width: 600px;
    margin: 2rem auto;
    text-align: center;
  
    img {
      max-width: 100%;
      height: auto;
      margin: 1rem 0;
    }
  
    h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
  
    p {
      font-size: 1.1rem;
      color: #555;
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
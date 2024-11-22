<template>
    <li class="book-item">
      <div class="book-header" @click="toggleDetails">
        <img :src="book.cover" alt="book cover" />
        <h2>{{ book.title }}</h2>
        <p>{{ book.author }}</p>
      </div>
      <div v-if="book.showDetails" class="book-details">
        <p><strong>Published:</strong> {{ book.published }}</p>
        <p><strong>Rating:</strong> {{ book.rating }}</p>
        <p>{{ book.description }}</p>
      </div>
    </li>
  </template>
  
  <script>
  export default {
    props: ["book"],
    methods: {
      toggleDetails() {
        this.$emit("toggleDetails", this.book.id);
      },
    },
  };
  </script>
  
  <style lang="scss" scoped>
  .book-item {
    border: 1px solid #ddd;
    padding: 1rem;
    margin: 1rem 0;
    cursor: pointer;
  
    .book-header {
      display: flex;
      align-items: center;
    }
  
    .book-details {
      margin-top: 0.5rem;
      color: #555;
    }
  }
  </style>
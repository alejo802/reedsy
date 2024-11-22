<template>
    <div class="book-list">
      <ul>
        <BookItem
          v-for="book in paginatedBooks"
          :key="book.id"
          :book="book"
          @toggleDetails="toggleDetails"
        />
      </ul>
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-changed="changePage"
      />
    </div>
  </template>
  
  <script>
  import booksData from "@/data/books.json";
  import BookItem from "@/components/BookItem.vue";
  import Pagination from "@/components/Pagination.vue";
  
  export default {
    components: { BookItem, Pagination },
    data() {
      return {
        books: [],
        currentPage: 1,
        perPage: 5,
      };
    },
    computed: {
      totalPages() {
        return Math.ceil(this.books.length / this.perPage);
      },
      paginatedBooks() {
        const start = (this.currentPage - 1) * this.perPage;
        return this.books.slice(start, start + this.perPage);
      },
    },
    methods: {
      fetchBooks() {
        // Simulate HTTP fetch
        this.books = booksData;
      },
      changePage(page) {
        this.currentPage = page;
      },
      toggleDetails(bookId) {
        const book = this.books.find((b) => b.id === bookId);
        book.showDetails = !book.showDetails;
      },
    },
    created() {
      this.fetchBooks();
    },
  };
  </script>
  
  <style lang="scss" scoped>
  @import "@/assets/styles/main.scss";
  
  .book-list {
    ul {
      list-style: none;
      padding: 0;
    }
  }
  </style>
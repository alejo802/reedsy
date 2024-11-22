<template>
    <div class="pagination">
      <button
        v-for="page in totalPages"
        :key="page"
        :class="{ active: page === currentPage }"
        @click="emitPageChange(page)"
      >
        {{ page }}
      </button>
    </div>
  </template>
  
  <script>
  export default {
    props: ["currentPage", "totalPages"],
    methods: {
      emitPageChange(page) {
        this.$emit("page-changed", page);
      },
    },
  };
  </script>
  
  <style lang="scss" scoped>
  .pagination {
    button {
      margin: 0.5rem;
      padding: 0.5rem 1rem;
      border: 1px solid #ccc;
      cursor: pointer;
  
      &.active {
        background-color: #007bff;
        color: white;
      }
    }
  }
  </style>
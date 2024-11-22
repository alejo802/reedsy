# Book Explorer

Book Explorer is a single-page application (SPA) built using Vue.js. It allows users to explore a list of popular books, view details, and navigate through pages using pagination.

## Features

- Displays a list of books with pagination (5 books per page).
- Allows users to expand/collapse details for each book.
- Clean and responsive UI built with modern CSS and SASS.
- Scalable architecture suitable for production.

## Project Setup

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (Node Package Manager)

### Installation

1. Clone this repository:

   ```bash
   git clone <repository-url>
   cd book-explorer
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run serve
   ```

   The application will be available at `http://localhost:8080`.

## Testing

This project uses [Jest](https://jestjs.io/) for unit testing.

### Run Tests

To execute the tests, run:

```bash
npm run test:unit
```

### Adding Tests

- Tests are located in the `tests/unit` directory.
- You can add new test files following the `*.spec.js` convention.

## Building for Production

To build the application for production, run:

```bash
npm run build
```

The build output will be located in the `dist/` directory.

## Linting

To ensure code quality, run:

```bash
npm run lint
```

## Folder Structure

```plaintext
src/
├── App.vue               # Root component
├── assets/               # Static assets (images, styles, etc.)
├── components/           # Reusable components (BookList, BookItem, etc.)
├── data/                 # Static or mock data (books.json)
├── router/               # Vue Router configuration
├── views/                # Page-level components (Home, BookDetails, etc.)
└── tests/                # Unit tests
```

## Technologies Used

- [Vue.js 3](https://v3.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Jest](https://jestjs.io/)
- SASS for styling

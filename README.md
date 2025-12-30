# OVARC TASK

## Tech Stack
- **Vite**: Fast build tool and dev server.
- **React Router**: Dynamic routing with code splitting.
- **Tailwind CSS**: Utility-first CSS framework.


## Setup
1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## Features
1. **Shop Page**:

   It has a list of cards containing the book cover page, title & author, and which stores this book is available in. The sell button should mark this as sold but keep the card on the page.

2. **Authors Page**

   It has a simple list of authors and two CTAs to edit the name (in-line edit) or delete the author entirely. There is a CTA & a modal too for adding a new author.

3. **Books Page**

   It has a list of books, the number of pages, and who the author is. The edit CTA is an in-line edit for the book title.

4. **Stores Page**

   Same as the above two. The entire row is a CTA for the next page.

5. **Store Inventory Page**

   This is where the admin adds more books to the store’s
inventory. The books should be viewable either in a list view or grouped by the author via the tab selection. The add to inventory CTA pops up a modal to select the new book and set its price.

## Project Structure
- src/pages/: Contains page components like Home, BrowseStores, Browse, BrowseAuthors, and Inventory.

- src/components/: Includes reusable UI components such as StoreCard, BookCard, AuthorCard, BooksTable, Modal, and Header.

- src/hooks/: Custom hooks like useLibraryData for data fetching and state management.

- src/assets/: Stores static assets like author images (a1.png, a2.png).

- data/: JSON files (stores.json, books.json, authors.json, inventory.json) for mock data.

Routes
- /: Home page with sections for Stores, Books, and Authors.

- /browse-stores: Browse all stores with their book counts and average prices.

- /browse: Browse all books with their authors and store availability.

- /browse-authors: Browse all authors with their published book counts.



## Mock Server
- A mock server was added at the root level of the project.
- The mock server is implemented using **json-server** to simulate backend APIs.
- An `.env` file is used to control whether the application runs against the mock server or a real backend.
- This allows seamless switching between environments without changing application code.
- Add script to run the **mock-server** in package.json: ``npm run mock:server``

## Authentication
- An `auth` folder was created under `src/auth` to encapsulate authentication logic.
- An `AuthContext` is used to manage and share authentication state across the application.
- A custom `useAuth` hook exposes authentication actions such as **Sign In** and **Sign Out** for easy consumption by components.
- The application starts with no authenticated user.
- Inventory management actions (add, edit, delete) are restricted to authenticated users only.

## Data Limitations
- The provided mock data contains structural inconsistencies across entities.
- Some relationships (e.g. between books, authors, and inventory) are not fully consistent or normalized.
- As a result, certain functionalities could not be implemented in a fully reliable manner without altering the original data structure.
- Since the data is assumed to be provided by an external backend, the source data was not modified.

## API Handling
- A custom `useApi` hook was implemented to centralize API communication logic.
- The hook resolves the API base URL dynamically based on environment variables.
- `Promise.all` is used to fetch related resources concurrently, improving performance and simplifying data loading logic.

## Inventory store
- Fix the issues and add new requirements in the store details page (`/store/:id`) displays the store inventory, listing all available books along with their store-specific prices. The page supports searching, sorting, and inventory management actions for authenticated users.
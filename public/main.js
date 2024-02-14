async function fetchBooks(page = 1, limit = 10, genre = '', author = '', publicationYear = '', sortBy = '', search = '') {
  try {
      // Construct query parameters based on the provided arguments
      const queryParams = new URLSearchParams({
          page,
          limit,
          genre,
          author,
          publicationYear,
          sortBy,
          search
      });

      // Fetch books based on the constructed query parameters
      const response = await fetch(`/api/books?${queryParams.toString()}`);
      const data = await response.json();
      displayBooks(data.books);
  } catch (error) {
      console.error('Error fetching books:', error);
  }
}

function displayBooks(books) {
  const booksList = document.getElementById('booksList');
  booksList.innerHTML = '';

  if (!Array.isArray(books)) {
    console.error('Books is not an array:', books);
    return;
  }

  books.forEach(book => {
    const bookElement = document.createElement('div');
    bookElement.innerHTML = `
      <div class="col">
        <div class="card">
          <div class="card-body bg-dark m-1">
            <h2 class="card-title card-header">${book.title}</h2>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Genre:</strong> ${book.genre}</p>
            <p><strong>Publication Year:</strong> ${book.publicationYear}</p>
            <p><strong>Quantity:</strong> ${book.quantity}</p>
            <p><strong>Price:</strong> ${book.price}₸</p>
            <button onclick="editBook('${book._id}')" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button>
            <button onclick="deleteBook('${book._id}')" class="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>
    `;
    booksList.appendChild(bookElement);
  });
}

async function editBook(bookId) {
  try {
      // Fetch book details by ID
      const response = await fetch(`/api/books/${bookId}`);
      const book = await response.json();

      // Create a container for the modal
      const modalContainer = document.createElement('div');
      modalContainer.innerHTML = `
      <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
              <div class="modal-content bg-dark m-1">
                  <div class="modal-header">
                      <h2 class="card-header">Edit Book</h2>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <label for="title" class="form-label">Title:</label>
                      <input type="text" class="form-control" id="title" value="${book.title}">
                      <label for="author" class="form-label">Author:</label>
                      <input type="text" class="form-control" id="author" value="${book.author}">
                      <label for="genre" class="form-label">Genre:</label>
                      <input type="text" class="form-control" id="genre" value="${book.genre}">
                      <label for="publicationYear" class="form-label">Publication Year:</label>
                      <input type="number" class="form-control" id="publicationYear" value="${book.publicationYear}">
                      <label for="quantity" class="form-label">Quantity:</label>
                      <input type="number" class="form-control" id="quantity" value="${book.quantity}">
                      <label for="price" class="form-label">Price:</label>
                      <input type="number" class="form-control" id="price" value="${book.price}">
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button type="button" class="btn btn-primary" id="updateBookBtn">Update</button>
                  </div>
              </div>
          </div>
      </div>
      `;
      document.body.appendChild(modalContainer);

      // Show the modal
      const modal = new bootstrap.Modal(modalContainer.querySelector('.modal'));
      modal.show();

      // Handle update button click
      const updateBtn = modalContainer.querySelector('#updateBookBtn');
      updateBtn.addEventListener('click', async () => {
          const updatedBook = {
              title: modalContainer.querySelector('#title').value,
              author: modalContainer.querySelector('#author').value,
              genre: modalContainer.querySelector('#genre').value,
              publicationYear: parseInt(modalContainer.querySelector('#publicationYear').value),
              quantity: parseInt(modalContainer.querySelector('#quantity').value),
              price: parseFloat(modalContainer.querySelector('#price').value)
          };

          try {
              // Send update request to backend API
              await fetch(`/api/books/${bookId}`, {
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(updatedBook)
              });
              alert('Book updated successfully!');
              modal.hide(); // Hide the modal after successful update
              fetchBooks(); // Refresh the book list
          } catch (error) {
              console.error('Error updating book:', error);
              alert('Error updating book. Please try again.');
          }
      });
  } catch (error) {
      console.error('Error fetching book details:', error);
      alert('Error fetching book details. Please try again.');
  }
}

// Function to search books
async function searchBooks() {
  // Get the value of the search input field
  const searchInput = document.getElementById('searchInput').value;
  
  // Call fetchBooks with the search input as the value of the 'search' parameter
  await fetchBooks(1, 10, '', '', '', '', searchInput);
}

// Function to fetch books based on the selected sorting option
async function fetchBooksBySort() {
  // Get the selected value from the sorting dropdown
  const sortBy = document.getElementById('sortBySelect').value;

  // Call fetchBooks with the selected sorting option
  await fetchBooks(1, 10, '', '', '', sortBy);
}

// Function to fetch books based on the filter options
async function fetchBooksByFilters(){
  // Get the values of the filter input fields
  const genre = document.getElementById('genreInput').value;
  const author = document.getElementById('authorInput').value;
  const publicationYear = document.getElementById('publicationYearInput').value;

  // Call fetchBooks with the filter values
  await fetchBooks(1, 10, genre, author, publicationYear);
}

// Function to handle pagination
async function changePage() {
  // Get the value of the selected page
  const page = document.getElementById('pageInput').value;

  // Get the value of the selected page
  const limit = document.getElementById('limitSelect').value;

  // Call fetchBooks with the selected page
  await fetchBooks(page, limit);
}

async function deleteBook(bookId) {
  try {
    // Send a DELETE request to the server to delete the book with the specified ID
    await fetch(`/api/books/${bookId}`, { method: 'DELETE' });

    // After successfully deleting the book, refresh the book list
    fetchBooks();
  } catch (error) {
    // If an error occurs during the delete operation, log the error to the console
    console.error('Error deleting book:', error);
  }
}

async function addBook() {
  const title = document.getElementById('titleInput').value;
  const author = document.getElementById('authorInput').value;
  const genre = document.getElementById('genreInput').value;
  const publicationYear = document.getElementById('publicationYearInput').value;
  const quantity = document.getElementById('quantityInput').value;
  const price = document.getElementById('priceInput').value;

  // Convert input values to appropriate types (e.g., parse integers and floats)
  const newBook = {
    title,
    author,
    genre,
    publicationYear: parseInt(publicationYear),
    quantity: parseInt(quantity),
    price: parseFloat(price)
  };

  try {
    // Send a POST request to the server to add a new book
    await fetch('/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newBook)
    });

    // After successfully adding the new book, refresh the book list
    fetchBooks();
  } catch (error) {
    // If an error occurs during the add operation, log the error to the console
    console.error('Error adding book:', error);
  }
}
// Call fetchBooks() when the page loads to display the initial list of books
fetchBooks();

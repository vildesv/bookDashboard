// Hent HTML-elementer
const form = document.getElementById('book-form');
const bookList = document.getElementById('book-list');
const genreFilter = document.getElementById('filter-genre');
const stats = document.getElementById('stats-output');
const clearAllBtn = document.getElementById('clear-all');

// Last inn data fra localStorage eller bruk tom liste
let books = JSON.parse(localStorage.getItem('books')) || [];

// Lag HTML-visning av en bok
function renderBooks(bookArray) {
  bookList.innerHTML = ''; // Tøm gammel visning
  bookArray.forEach(({ id, bookTitle, author, genre, pages }) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${bookTitle}</strong> av ${author} <br/>
      Sjanger: ${genre} – Sider: ${pages} <br/>
      <button onclick="deleteBook('${id}')">Slett</button>
    `;
    bookList.append(li);
  });
}

// Oppdater localStorage og UI
function update() {
  localStorage.setItem('books', JSON.stringify(books));
  renderBooks(getFilteredBooks());
  updateStats();
  updateFilterOptions();
}

// Hent filtrerte bøker basert på valgt sjanger
function getFilteredBooks() {
  const filterValue = genreFilter.value;
  return filterValue ? books.filter(book => book.genre === filterValue) : books;
}

// Legg til ny bok
form.addEventListener('submit', e => {
  e.preventDefault(); // Hindre reload

  // Hent data fra inputfeltene
  const bookTitle = form.bookTitle.value;
  const author = form.author.value;
  const genre = form.genre.value;
  const pages = Number(form.pages.value);

  // Lag et unikt bokobjekt
  const newBook = {
    id: crypto.randomUUID(), // Unik ID
    bookTitle,
    author,
    genre,
    pages
  };

  books.push(newBook); // Legg til bok
  form.reset(); // Tøm skjema
  update(); // Oppdater visning og lagring
});

// Slett en bok
function deleteBook(id) {
  books = books.filter(book => book.id !== id);
  update();
}

// Tøm hele listen
clearAllBtn.addEventListener('click', () => {
  if (confirm('Er du sikker på at du vil slette alle bøker?')) {
    books = [];
    update();
  }
});

// Oppdater statistikk med reduce()
function updateStats() {
  if (books.length === 0) {
    stats.textContent = 'Ingen bøker registrert.';
    return;
  }

  // Bruk reduce() for å summere sider
  const totalPages = books.reduce((sum, { pages }) => sum + pages, 0);
  stats.textContent = `Du har registrert ${books.length} bøker med totalt ${totalPages} sider.`;
}

// Oppdater filtervalg basert på sjangre i listen
function updateFilterOptions() {
  const genres = [...new Set(books.map(book => book.genre))]; // Finn unike sjangre
  genreFilter.innerHTML = '<option value="">Alle sjangre</option>';
  genres.forEach(genre => {
    const option = document.createElement('option');
    option.value = genre;
    option.textContent = genre;
    genreFilter.append(option);
  });
}

// Lytt etter endring i filter
genreFilter.addEventListener('change', () => {
  renderBooks(getFilteredBooks());
});

// Initial oppstart
update();

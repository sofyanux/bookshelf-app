document.addEventListener("DOMContentLoaded", function () {
  // Check if there are existing books in local storage
  if (localStorage.getItem("books") === null) {
    localStorage.setItem("books", JSON.stringify([]));
  } else {
    renderBooks();
  }
});

function addBook() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;
  const isComplete = document.getElementById("isComplete").checked;

  if (!title || !author || !year) {
    showNotification("Harap melengkapi data terlebih dahulu!");
    return;
  }

  const book = {
    id: Date.now(),
    title: title,
    author: author,
    year: year,
    isComplete: isComplete,
  };

  const books = JSON.parse(localStorage.getItem("books"));
  books.push(book);
  localStorage.setItem("books", JSON.stringify(books));

  renderBooks();

  document.getElementById("bookForm").reset();
  showNotification("Buku berhasil ditambahkan!");
  console.log(book);
}

function renderBooks() {
  const unfinishedBookshelf = document.getElementById("unfinishedBookshelf");
  const finishedBookshelf = document.getElementById("finishedBookshelf");
  unfinishedBookshelf.innerHTML = "";
  finishedBookshelf.innerHTML = "";

  const books = JSON.parse(localStorage.getItem("books"));

  books.forEach((book) => {
    const card = document.createElement("div");
    card.classList.add("book-card");

    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("book-buttons");

    const buttonMove = document.createElement("button");
    const buttonDelete = document.createElement("button");
    const buttonEdit = document.createElement("button");

    buttonMove.classList.add("buttonMove");
    buttonDelete.classList.add("buttonDelete");
    buttonEdit.classList.add("buttonEdit");

    buttonMove.textContent = "Pindahkan";
    buttonMove.onclick = function () {
      moveBook(book.id);
    };

    buttonDelete.textContent = "Hapus";
    buttonDelete.onclick = function () {
      showConfirmationPopup(book.id);
    };

    buttonEdit.textContent = "Edit";
    buttonEdit.onclick = function () {
      showEditPopup(book);
    };

    buttonsContainer.appendChild(buttonEdit);
    buttonsContainer.appendChild(buttonMove);
    buttonsContainer.appendChild(buttonDelete);

    card.innerHTML = `
        <div class="content">
            <p class="title">${book.title}</p>
            <p class="info"><span>Penulis :</span> ${book.author}</p>
            <p class="info"><span>Tahun :</span> ${book.year}</p>
        </div>    
    `;
    card.appendChild(buttonsContainer);

    if (book.isComplete) {
      document.getElementById("finishedBookshelf").appendChild(card);
    } else {
      document.getElementById("unfinishedBookshelf").appendChild(card);
    }
  });
}

function closePopups() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("confirmationPopup").style.display = "none";
  document.getElementById("editPopup").style.display = "none";
}

function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.display = "block";

  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}

function moveBook(bookId) {
  const books = JSON.parse(localStorage.getItem("books"));
  const bookIndex = books.findIndex((book) => book.id === bookId);
  books[bookIndex].isComplete = !books[bookIndex].isComplete;
  localStorage.setItem("books", JSON.stringify(books));
  renderBooks();
  const notificationMessage = books[bookIndex].isComplete
    ? "Buku berhasil dipindahkan ke Rak Selesai Dibaca!"
    : "Buku berhasil dipindahkan ke Rak Belum Selesai Dibaca!";

  showNotification(notificationMessage);
}

function showConfirmationPopup(bookId) {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("confirmationPopup").style.display = "block";
  document.getElementById("confirmationPopup").dataset.bookId = bookId;
}

function confirmDelete() {
  const bookId = document.getElementById("confirmationPopup").dataset.bookId;
  const books = JSON.parse(localStorage.getItem("books"));
  const updatedBooks = books.filter((book) => book.id != bookId);
  document.getElementById("overlay").style.display = "none";
  document.getElementById("confirmationPopup").style.display = "none";

  localStorage.setItem("books", JSON.stringify(updatedBooks));
  
  renderBooks();
  showNotification("Buku berhasil dihapus!");
}

function cancelDelete() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("confirmationPopup").style.display = "none";
}

function showEditPopup(book) {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("editPopup").style.display = "block";

  document.getElementById("editTitle").value = book.title;
  document.getElementById("editAuthor").value = book.author;
  document.getElementById("editYear").value = book.year;

  const editIsCompleteCheckbox = document.getElementById("editIsComplete");
  if (editIsCompleteCheckbox) {
    editIsCompleteCheckbox.checked = book.isComplete;
  }

  document.getElementById("editPopup").dataset.bookId = book.id;
}

function confirmEdit() {
  const bookId = document.getElementById("editPopup").dataset.bookId;
  const books = JSON.parse(localStorage.getItem("books"));
  const bookIndex = books.findIndex((book) => book.id == bookId);

  const editTitleInput = document.getElementById("editTitle");
  const editAuthorInput = document.getElementById("editAuthor");
  const editYearInput = document.getElementById("editYear");
  const editIsCompleteCheckbox = document.getElementById("editIsComplete");

  if (editIsCompleteCheckbox) {
    books[bookIndex].isComplete = editIsCompleteCheckbox.checked;
  }

  books[bookIndex].title = editTitleInput.value;
  books[bookIndex].author = editAuthorInput.value;
  books[bookIndex].year = editYearInput.value;

  localStorage.setItem("books", JSON.stringify(books));
  renderBooks();

  closePopups();
  showNotification("Buku berhasil diperbarui!");
}


function cancelEdit() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("editPopup").style.display = "none";
}

function searchBooks() {
  const searchQuery = document
    .getElementById("searchQuery")
    .value.toLowerCase();
  const books = JSON.parse(localStorage.getItem("books"));

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery) ||
      book.author.toLowerCase().includes(searchQuery) ||
      book.year.toString().includes(searchQuery)
  );

  renderFilteredBooks(filteredBooks);
}

function renderFilteredBooks(filteredBooks) {
  const unfinishedBookshelf = document.getElementById("unfinishedBookshelf");
  const finishedBookshelf = document.getElementById("finishedBookshelf");
  unfinishedBookshelf.innerHTML = "";
  finishedBookshelf.innerHTML = "";

  filteredBooks.forEach((book) => {
    const card = document.createElement("div");
    card.classList.add("book-card");

    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("book-buttons");

    const buttonMove = document.createElement("button");
    const buttonDelete = document.createElement("button");
    const buttonEdit = document.createElement("button");

    buttonMove.classList.add("buttonMove");
    buttonDelete.classList.add("buttonDelete");
    buttonEdit.classList.add("buttonEdit");

    buttonMove.textContent = "Pindahkan";
    buttonMove.onclick = function () {
      moveBook(book.id);
    };

    buttonDelete.textContent = "Hapus";
    buttonDelete.onclick = function () {
      showConfirmationPopup(book.id);
    };

    buttonEdit.textContent = "Edit";
    buttonEdit.onclick = function () {
      showEditPopup(book);
    };

    buttonsContainer.appendChild(buttonMove);
    buttonsContainer.appendChild(buttonDelete);
    buttonsContainer.appendChild(buttonEdit);

    card.innerHTML = `
        <div class="content">
            <p class="title">${book.title}</p>
            <p class="info"><span>Penulis :</span> ${book.author}</p>
            <p class="info"><span>Tahun :</span> ${book.year}</p>
        </div>    
    `;
    card.appendChild(buttonsContainer);

    if (book.isComplete) {
      document.getElementById("finishedBookshelf").appendChild(card);
    } else {
      document.getElementById("unfinishedBookshelf").appendChild(card);
    }
  });
}

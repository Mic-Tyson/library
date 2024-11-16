// Helpers -----------------
function generateHeaderDiv(index) {
  const header = document.createElement("h2");
  header.textContent = `Book #${index + 1}`; 
  return header;
}

function generateDeleteBookButton(index) {
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-book"
  deleteButton.id = `delete-button-${index}`;
  deleteButton.textContent = "Delete"; 

  deleteButton.addEventListener("click", (e) => {
    e.preventDefault();

    const bookDiv = document.getElementById(`book-${index}`)
    if (bookDiv) { 
      library.removeBook(index);
      bookDiv.remove() };
  });

  return deleteButton;
}

function generateReadCheck(index) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "read-checkbox";
  checkbox.id = `read-checkbox-${index}`;
  
  const label = document.createElement("label");
  label.setAttribute("for", checkbox.id);
  label.textContent = "Read";

  const wrapper = document.createElement("div");
  wrapper.appendChild(label);
  wrapper.appendChild(checkbox);

  checkbox.addEventListener("click", (e) => {
    const bookDiv = document.getElementById(`book-${index}`);
    if (bookDiv) { 
      const book = library.books[index];
      book.read = checkbox.checked;
      console.log(book.read);
    }
  });

  return wrapper;
}

// Book --------------------
function Book(title, author, read = false) {
  this.title = title;
  this.author = author;
  this.read = read;
}

Book.prototype.display = function() {
  const div = document.createElement("div");
  const author = document.createElement("p");
  const title = document.createElement("p");

  div.className = "book";

  title.textContent = "Title: " + this.title;
  author.textContent = "Author: " + this.author;

  div.appendChild(title);
  div.appendChild(author);
  return div;
}

// Library --------------------
function Library(books = []) {
  this.books = books;
}

Library.prototype.addBook = function(book) {
  this.books.push(book);
}

Library.prototype.removeBook = function(index) {
  this.books.splice(index, 1);
}

Library.prototype.display = function(fragment, container) {
  this.books.forEach((book, i) => {
    const div = book.display();
    div.id = `book-${i}`;
  
    div.appendChild(generateReadCheck(i));
    div.appendChild(generateDeleteBookButton(i));
    div.prepend(generateHeaderDiv(i));

    fragment.appendChild(div);
  });
  container.appendChild(fragment);
}


// DOM elements --------------------
const booksContainer = document.querySelector(".books-container");
const fragment = document.createDocumentFragment();

const showButton = document.getElementById("add-book");
const dialog = document.getElementById("book-dialog");
const form = dialog.querySelector("form");


// Events Listeners --------------------
showButton.addEventListener("click", (e) => {
  e.preventDefault();
  dialog.showModal()
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = form.elements["title"].value;
  const author = form.elements["author"].value;

  let book = new Book(title, author);
  library.addBook(book);
  dialog.close();

  const div = book.display();
  div.prepend(generateHeaderDiv(library.books.length - 1));  
  div.appendChild(generateDeleteBookButton(library.books.length - 1));
  div.appendChild(generateReadCheck(library.books.length -1));
  booksContainer.appendChild(div);
});


// Main ------------------

let library = new Library();
let book = new Book("Sample Title", "Sample Author");
library.addBook(book);

library.display(fragment, booksContainer);
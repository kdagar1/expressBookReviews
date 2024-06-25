const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify({books}, null, "\t"));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    isbn = req.params.isbn;
    let filtered_books = [];
    for (let key in books) {
        if (books.hasOwnProperty(key) && key === isbn) {
            filtered_books.push(books[key]);
        }
    }
    res.send(filtered_books);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    author = req.params.author;
    let filtered_books = [];
    for (let key in books) {
        if (books.hasOwnProperty(key) && books[key].author == author) {
            filtered_books.push(books[key]);
        }
    }
    res.send(filtered_books);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;

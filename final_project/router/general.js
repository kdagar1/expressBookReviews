const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    if(req.query.username === null) {
        res.send({ message: "Username not provided"});
    } else if (req.query.password === null) {
        res.send({ message: "Password not provided"});
    } else {
        if (users.includes({
            "username": req.query.username,
            "password": req.query.password
        })) {
            res.send({message: "Customer is already registered."})
        } else {
        users.push({
            "username": req.query.username,
            "password": req.query.password
        })
        res.send({ message: "Customer successfully registered. Now you can log in"});
        }
    }
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
    let filtered_books = {"booksbyauthor": []};
    for (let key in books) {
        if (books.hasOwnProperty(key) && books[key].author == author) {
            filtered_books["booksbyauthor"].push(
                {isbn: key, title: books[key].title, reviews: books[key].reviews});
        }
    }
    res.send(filtered_books);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let filtered_books = {"booksbytitle": []};
    for (let key in books) {
        if (books.hasOwnProperty(key) && books[key].title == title) {
            filtered_books["booksbytitle"].push(
                {isbn: key, author: books[key].author, reviews: books[key].reviews});
        }
    }
    res.send(filtered_books);

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    isbn = req.params.isbn;
    let review;
    for (let key in books) {
        if (books.hasOwnProperty(key) && key === isbn) {
            review = books[key].reviews;
        }
    }
    res.send(review);
});

module.exports.general = public_users;

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if(isValid(username)) {
            res.send({message: "Customer is already registered."})
        } else {
            users.push({
            "username": username,
            "password": password
            })
            res.send({ message: "Customer successfully registered. Now you can log in"});
        }
    }
    return res.status(404).json({message: "Username or password not provided"})
});

let getBooksPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(books)
    },6000)})

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    getBooksPromise.then((books) => {
        res.send(JSON.stringify({books}, null, "\t"));
  })
});

function getISBNPromise(isbn){
    return new Promise((resolve,reject) => {
        let filtered_books = [];
        for (let key in books) {
            if (books.hasOwnProperty(key) && key === isbn) {
                filtered_books.push(books[key]);
                resolve(filtered_books);
            }
        }   
        reject({message: "ISBN not found"});
    })
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    getISBNPromise(req.params.isbn).then((found_book) => {
        res.send(found_book);
    })
 });
  
function getAuthorPromise(author) {
    return new Promise((resolve,reject) => {
        let filtered_books = {"booksbyauthor": []};
        for (let key in books) {
            if (books.hasOwnProperty(key) && books[key].author == author) {
                filtered_books["booksbyauthor"].push(
                    {isbn: key, title: books[key].title, reviews: books[key].reviews});
                resolve(filtered_books);
            }
        }
        reject({message: `Book by ${author} not found`});
    })
}
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    getAuthorPromise(req.params.author).then((found_book) => {
        res.send(found_book);
    })
});

function getTitlePromise(title) {
    return new Promise((resolve,reject) => {
        let filtered_books = {"booksbytitle": []};
        for (let key in books) {
            if (books.hasOwnProperty(key) && books[key].title == title) {
                filtered_books["booksbytitle"].push(
                    {isbn: key, author: books[key].author, reviews: books[key].reviews});
                resolve(filtered_books);
            }
        }
        reject({message: `Book by ${author} not found`});
    })   
}
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    getTitlePromise(req.params.title).then((found_book) => {
        res.send(found_book);
    })
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

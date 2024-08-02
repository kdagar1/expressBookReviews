const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    let filtered_users = users.filter((user)=> username.username === username);
    if(filtered_users.length > 0){
        return true;
    }
    return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let filtered_users = users.filter((user)=> (user.username===username)&&(user.password===password));
    if(filtered_users.length > 0){
        return true;
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const user = req.body.username;
    const password = req.body.password;
    if (!authenticatedUser(user, password)) {
        return res.status(404).json({ message: "Invalid username or password" });
    }
    // Generate JWT access token
    let accessToken = jwt.sign({
        data: user, password
    }, 'access', { expiresIn: 60 * 60 });

    // Store access token in session
    req.session.authorization = {
        accessToken, user
    }
    return res.status(200).send("Customer successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let user = req.session.username;
    let isbn = req.params.isbn;
    let newReview = req.query.review;
    books[isbn].reviews[user] =  newReview;
    return res.status(201).json(`The Review for the book with ISBN ${isbn} has been added/updated.`)
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;


const express = require("express");
const router =  express.Router();
const Book = require("../models/Book");

// Retrieve all books in the inventory with pagination, filtering, sorting, and searching
router.get("/", async (req, res) => {
    // Extracting query parameters
    const { page = 1, limit = 10, genre, author, publicationYear, sortBy, search } = req.query;
    
    // Building the query object based on the provided parameters
    let query = {};

    // Filtering
    if (genre) query.genre = genre;
    if (author) query.author = author;
    if (publicationYear) query.publicationYear = publicationYear;

    // Searching
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { author: { $regex: search, $options: 'i' } },
            { genre: { $regex: search, $options: 'i' } }
        ];
    }

    try {
        // Executing the query and handling pagination and sorting
        let books;
        if (sortBy) {
            books = await Book.find(query)
                .sort({ [sortBy]: 1 })
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();
        } else {
            books = await Book.find(query)
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();
        }

        // Counting total number of documents to calculate total pages
        const count = await Book.countDocuments(query);

        // Sending response with paginated results
        res.json({
            books,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        // Handling errors
        res.status(500).json({ message: err.message });
    }
});


// Creating a new book
router.post("/", async (req,res)=>{
    try{
        const newBook = await Book.create(req.body);
        res.json(newBook);
    }catch(err){
        res.status(400).json({message: err.message});
    }
});

// Getting a single book
router.get("/:id", getBook, async (req,res)=>{
    res.json(res.book);
});

// Updating a book
router.put("/:id", getBook, async (req,res)=>{
    try{
        if(req.body.title != null){
            res.book.title = req.body.title;
        }
        if(req.body.author != null){
            res.book.author = req.body.author;
        }
        if(req.body.genre != null){
            res.book.genre = req.body.genre;
        }
        if(req.body.publicationYear != null){
            res.book.publicationYear = req.body.publicationYear;
        }
        if(req.body.quantity != null){
            res.book.quantity = req.body.quantity;
        }
        if(req.body.price != null){
            res.book.price = req.body.price;
        }
        const updatedBook = await res.book.save();
        res.json(updatedBook);
    }catch(err){
        res.status(400).json({message: err.message});
    }
});

// Deleting a book
router.delete("/:id", getBook, async (req, res) => {
    try {
        await res.book.deleteOne();
        res.json({ message: "Book deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getBook(req, res, next) {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      res.book = book; // Attach the book to the response object
      next();
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
  

module.exports = router;
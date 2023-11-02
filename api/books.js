const express = require("express");
const router = express.Router();
const prisma = require('../prisma')
module.exports = router;

// /api/books returns an array of all books
router.get('/', async (req, res, next) => {
  try {
    const books = await prisma.book.findMany();
    res.send(books);
  } catch {
    next();
  }
});

// /api/books/:id returns a single book with the specified id
router.get('/:id', async (req, res, next) => {
  try {
    const id = +req.params.id
    const result = await prisma.book.findUnique({
      where: {
        id: id,
      },
    });
    if (!result) {
      return next({
        status: 404,
        message: `Could not find book with id ${id}`,
      });
    }
    res.send(result)
  } catch {
    next();
  }
})

// /api/books/:id overwrites the book with the information provided in the request body
router.put('/:id', async (req, res, next) => {
  try {
    const id = +req.params.id
    const bookExists = await prisma.book.findUnique({ where: { id } });
    if (!bookExists) {
      return next({
        status: 404,
        message: `Could not find book with id ${id}`,
      });
    }
    const { book } = req.body
    if (!book) {
      return next({
        status: 400,
        message: 'Book must have a title',
      });
    }
    const update = await prisma.book.update({
      where: { id: id },
      data: { title: book },
    });
    res.send(update)
  } catch {
    next();
  }
})

// /api/books/:id deletes the book with the specified id
router.delete('/:id', async (req, res, next) => {
  try {
    const id = +req.params.id
    const bookExists = await prisma.book.findUnique({ where: { id } });
    if (!bookExists) {
      return next({
        status: 404,
        message: `Could not find book with id ${id}`,
      });
    }
    const book = await prisma.book.delete({
      where: { id: id },
    });
    res.send(book);
  } catch {
    next();
  }
})





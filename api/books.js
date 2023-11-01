const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({});
module.exports = router;

// /api/books returns an array of all books
router.get('/', async (req, res) => {
  const books = await prisma.book.findMany();
  res.send(books);
});

// /api/books/:id returns a single book with the specified id
router.get('/:id', async (req, res) => {
  const id = +req.params.id
  const result = await prisma.book.findUnique({
    where: {
      id: id,
    },
  });
  res.send(result)
})

// /api/books/:id overwrites the book with the information provided in the request body
router.put('/:id', async (req, res) => {
  const id = +req.params.id
  const { book } = req.body
  const update = await prisma.book.update({
    where: { id: id },
    data: { title: book },
  });
  res.send(update)
})

// /api/books/:id deletes the book with the specified id
router.delete('/:id', async (req, res) => {
  const id = +req.params.id
  const book = await prisma.book.delete({
    where: { id: id },
  });
  res.send(book);
})





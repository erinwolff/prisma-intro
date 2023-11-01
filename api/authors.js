const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({});
module.exports = router;

// /api/authors returns an array of all authors
router.get('/', async (req, res) => {
  const authors = await prisma.author.findMany();
  res.send(authors);
});



// /api/authors/:id returns a single author with the specified id
router.get('/:id', async (req, res) => {
  const id = +req.params.id
  const result = await prisma.author.findUnique({
    where: {
      id: id,
    },
  });
  res.send(result)
})

// /api/authors/:id/books get all books written by the specified author
router.get('/:id/books', async (req, res) => {
  const id = +req.params.id
  const result = await prisma.author.findUnique({
    where: {
      id: id,
    },
    include: {
      books: true,
    }
  })
  res.send(result)
})

// /api/authors creates a new author with the information provided in the request body
router.post('/', async (req, res) => {
  const { name, book1, book2, book3 } = req.body
  console.log(req.body)
  const author = await prisma.author.create({
    data: {
      name: name,
      books: {
        create: [
          { title: book1 },
          { title: book2 },
          { title: book3 },
        ],
      },
    },
  })
  res.send(author);
})

// /api/authors/:id overwrites the author with the information provided in the request body
router.put('/:id', async (req, res) => {
  const id = +req.params.id
  const { name, book1, book2, book3 } = req.body
  const author = await prisma.author.update({
    where: { id: id },
    data: {
      name: name,
      books: {
        create: [
          { title: book1 },
          { title: book2 },
          { title: book3 },
        ],
      },
    },
  })
  res.send(author);
})


// /api/authors/:id deletes the author with the specified id
router.delete('/:id', async (req, res) => {
  const id = +req.params.id
  const author = await prisma.author.delete({
    where: { id: id },
  })
  res.send(author);
})

// /api/author/:id/books creates a new book as provided in the request body with the specified author
router.post('/:id/books', async (req, res) => {
  const id = +req.params.id
  const { newbook } = req.body
  const result = await prisma.author.update({
    where: {
      id: id,
    },
    include: {
      books: true,
    },
    data: {
      books: {
        create: [
          { title: newbook },
        ],
      },
    },
  })
  res.send(result)
})





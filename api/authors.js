const express = require("express");
const router = express.Router();
const prisma = require('../prisma')
module.exports = router;

// /api/authors returns an array of all authors
router.get('/', async (req, res, next) => {
  try {
    const authors = await prisma.author.findMany();
    res.send(authors);
  } catch {
    next();
  }
});



// /api/authors/:id returns a single author with the specified id
router.get('/:id', async (req, res, next) => {
  try {
    const id = +req.params.id
    const result = await prisma.author.findUnique({
      where: {
        id: id,
      },
    });
    if (!result) {
      return next({
        status: 404,
        message: `Could not find author with id ${id}`
      });
    }
    res.send(result)
  } catch {
    next();
  }
})

// /api/authors/:id/books get all books written by the specified author
router.get('/:id/books', async (req, res, next) => {
  try {
    const id = +req.params.id
    const result = await prisma.author.findUnique({
      where: {
        id: id,
      },
      include: {
        books: true,
      }
    })
    if (!result) {
      return next({
        status: 404,
        message: `Could not find author with id ${id}`
      })
    }
    res.send(result)
  } catch {
    next();
  }
})

// /api/authors creates a new author with the information provided in the request body
router.post('/', async (req, res, next) => {
  try {
    const { name, book1, book2, book3 } = req.body
    if (!name) {
      const error = {
        status: 400,
        message: 'Author must have a name.',
      };
      return next(error);
    }
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
  } catch {
    next();
  }
});

// /api/authors/:id overwrites the author with the information provided in the request body
router.put('/:id', async (req, res, next) => {
  try {
    const id = +req.params.id;

    const authorExists = await prisma.author.findUnique({ where: { id } });
    if (!authorExists) {
      return next({
        status: 404,
        message: `Could not find author with id ${id}.`,
      });
    }
    const { name, book1, book2, book3 } = req.body
    if (!name) {
      return next({
        status: 400,
        message: 'Author must have a name'
      });
    }
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
  } catch {
    next();
  }
})


// /api/authors/:id deletes the author with the specified id
router.delete('/:id', async (req, res, next) => {
  try {
    const id = +req.params.id
    const authorExists = await prisma.author.findUnique({ where: { id } });
    if (!authorExists) {
      return next({
        status: 404,
        message: `Could not find author with id ${id}`,
      });
    }
    const author = await prisma.author.delete({
      where: { id: id },
    })
    res.sendStatus(204);
  } catch {
    next();
  }
})

// /api/author/:id/books creates a new book as provided in the request body with the specified author
router.post('/:id/books', async (req, res, next) => {
  try {
    const id = +req.params.id
    const author = await prisma.author.findUnique({ where: { id } });
    if (!author) {
      return next({
        staus: 404,
        message: `Could not find author with ${id}`,
      });
    }
    const { newbook } = req.body
    if (!newbook) {
      return next({
        status: 400,
        message: 'Book must have a title',
      });
    }
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
    res.send(result);
  } catch {
    next();
  }
})





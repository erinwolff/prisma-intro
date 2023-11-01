const prisma = require('../prisma');
const seed = async () => {
  //TODO: Create 20 authors with 3 books each
  for (let i = 1; i <= 20; i++) {
    await prisma.author.create({
      data: {
        name: `Author ${i}`,
        books: {
          create: [
            { title: `Book 1 of Author ${i}` },
            { title: `Book 2 of Author ${i}` },
            { title: `Book 3 of Author ${i}` },
          ],
        },
      },
    });
  }
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
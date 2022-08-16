import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    name: "Alice",
    email: "alice@prisma.io",
    id: "1",
    todos: {
      create: [
        {
          text: "walk dog",
          done: false,
        },
        {
          text: "clean house",
          done: false,
        },
        {
          text: "water plants",
          done: false,
        },
        {
          text: "buy groceries",
          done: false,
        },
      ],
    },
  },
  {
    name: "Nilu",
    email: "nilu@prisma.io",
    id: "2",
    todos: {
      create: [
        {
          text: "walk dog",
          done: false,
        },
      ],
    },
  },
];

async function main() {
  console.log(`Start seeding ...`);

  await prisma.user.deleteMany();

  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

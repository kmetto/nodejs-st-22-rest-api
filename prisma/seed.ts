import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { login: 'login a' },
    update: {},
    create: {
      login: 'login a',
      password: '123qwe',
      age: 50,
    },
  });

  await prisma.user.upsert({
    where: { login: 'login b' },
    update: {},
    create: {
      login: 'login b',
      password: '123qwe',
      age: 50,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async () => {
    await prisma.$disconnect();
    process.exit(1);
  });

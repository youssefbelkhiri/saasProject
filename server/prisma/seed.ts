/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.upsert({
    where: { email: 'youssef.bel3231@gmail.com' },
    update: {},
    create: {
      first_name: 'youssef',
      last_name: 'belkhiri',
      email: 'youssef.bel3231@gmail.com',
      phone: '0681751539',
      password: '123',
    },
  });
  const plan1 = await prisma.plan.upsert({
    where: { id: 1 },
    update: {},
    create: {
      plan_name: 'basic plan',
      description: 'basic plan description',
    },
  });
  const feature1 = await prisma.feature.upsert({
    where: { id: 1 },
    update: {},
    create: {
      feature_name: 'feature 1',
      description: 'Description for Feature 1',
    },
  });
  const planfeature1 = await prisma.planFeature.upsert({
    where: { id: 1 },
    update: {},
    create: {
      plan_id: 1,
      feature_id: 1,
    },
  });
  const userPlan1 = await prisma.userPlan.upsert({
    where: { id: 1 },
    update: {},
    create: {
      user_id: 1,
      plan_id: 1,
      date_start: '2023-01-01T00:00:00Z',
      date_end: '2023-12-31T23:59:59Z',
      price: 29.99,
    },
  });
}
main()
  .catch((e) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

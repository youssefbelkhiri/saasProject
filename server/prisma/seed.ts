/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

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
      password: '123456',
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

  const group1 = await prisma.groups.create({
    data: {
      name: 'Science Grp 1',
      user_id: user1.id
    },
  });

  const group2 = await prisma.groups.create({
    data: {
      name: 'Science Grp 2',
      user_id: user1.id
    },
  });

  for (let i = 1; i <= 10; i++) {
    await prisma.students.create({
      data: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        student_number: faker.string.alphanumeric(8),
        groups: {
          connect: { group_id: group1.group_id },
        },
      },
    });
  }

  for (let i = 1; i <= 10; i++) {
    await prisma.students.create({
      data: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        student_number: faker.string.alphanumeric(8),
        groups: {
          connect: [{
            group_id: group2.group_id,
          },]
        },
      },
    });
  }

  const exam1 = await prisma.exam.create({
    data: {
      name: 'History Exam',
      exam_language: 'English',
      description: 'Test students math skills',
      exam_time: 60.0,
      total_point: 20,
      author: {
        connect: { id: user1.id },
      },
      groups: {
        connect: { group_id: group1.group_id },
      },
    },
  });

  for (let i = 1; i <= 4; i++) {
    const question = await prisma.questions.create({
      data: {
        questionOrder: i,
        content: `Question ${i}  Math Exam`,
        difficulty: 'Easy',
        points: 5,
        examR: {
          connect: { exam_id: exam1.exam_id },
        },
      },
    });

    for (let j = 1; j <= 3; j++) {
      await prisma.options.create({
        data: {
          optionOrder: j,
          option: `Option ${j} for Question ${i}`,
          correct: j === 1,
          question: {
            connect: { question_id: question.question_id },
          },
        },
      });
    }
  }

  const exam2 = await prisma.exam.create({
    data: {
      name: 'Science Exam',
      exam_language: 'French',
      description: 'Science Exam Description',
      exam_time: 60.0,
      total_point: 20,
      author: {
        connect: { id: user1.id },
      },
      groups: {
        connect: [
          { group_id: group1.group_id },
          { group_id: group2.group_id },
        ],
      },
    },
  });

  for (let i = 1; i <= 4; i++) {
    const question = await prisma.questions.create({
      data: {
        questionOrder: i,
        content: `Question ${i}  Science Exam`,
        difficulty: 'Hard',
        points: 5,
        examR: {
          connect: { exam_id: exam2.exam_id },
        },
      },
    });

    for (let j = 1; j <= 3; j++) {
      await prisma.options.create({
        data: {
          optionOrder: j,
          option: `Option ${j} for Question ${i}`,
          correct: j === 2,
          question: {
            connect: { question_id: question.question_id },
          },
        },
      });
    }
  }
}

main()
  .catch((e) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

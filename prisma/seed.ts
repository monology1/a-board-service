import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const posts = [
  {
    id: 1,
    author: 'Writesel',
    category: 'History',
    title: 'The Beginning of the End of the World',
    excerpt:
      'The afterlife vision The Good Place comes to its culmination, the show\'s two protagonists, Eleanor and Chidi, contemplate their future, having lived thousands upon thousands of lifetimes together, and having experienced virtually everything this life has to offe...',
    commentsCount: 32,
  },
  {
    id: 2,
    author: 'Zach',
    category: 'History',
    title: 'The Big Short War',
    excerpt:
      'The afterlife, beforetime and certain eyes, he was the kind of hyper-ambitious kid other kids tend to hate and just the type to make the school more difficult for everyone. But on the night before the L.A.P.D, his father took pity on him and cancelled the trip. "You\'ll ne...',
    commentsCount: 14,
  },
  {
    id: 3,
    author: 'Nicholas',
    category: 'Exercise',
    title: 'The Mental Health Benefits of Exercise',
    excerpt:
      'You already know that exercise is good for your body. But did you know it can also boost your mood, improve your sleep, and help you deal with depression, anxiety, stress, and more?',
    commentsCount: 32,
  },
  {
    id: 4,
    author: 'Nicholas',
    category: 'Exercise',
    title: 'The Mental Health Benefits of Exercise',
    excerpt:
      'You already know that exercise is good for your body. But did you know it can also boost your mood, improve your sleep, and help you deal with depression, anxiety, stress, and more?',
    commentsCount: 32,
  },
  {
    id: 5,
    author: 'Nicholas',
    category: 'Exercise',
    title: 'The Mental Health Benefits of Exercise',
    excerpt:
      'You already know that exercise is good for your body. But did you know it can also boost your mood, improve your sleep, and help you deal with depression, anxiety, stress, and more?',
    commentsCount: 32,
  },
  {
    id: 6,
    author: 'Nicholas',
    category: 'Exercise',
    title: 'The Mental Health Benefits of Exercise',
    excerpt:
      'You already know that exercise is good for your body. But did you know it can also boost your mood, improve your sleep, and help you deal with depression, anxiety, stress, and more?',
    commentsCount: 32,
  },
];

async function main() {
  for (const post of posts) {
    await prisma.post.upsert({
      where: { id: post.id },
      update: {},
      create: post,
    });
  }
  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
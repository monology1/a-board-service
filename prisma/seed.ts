import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//
// 1. POSTS DATA
//
const posts = [
  {
    id: 1,
    author: 'Writesel',
    category: 'History',
    title: 'The Beginning of the End of the World',
    excerpt:
      "The afterlife vision The Good Place comes to its culmination, the show's two protagonists, Eleanor and Chidi, contemplate their future...",
    content: 'Full content for "The Beginning of the End of the World"...',
    commentsCount: 32,
  },
  {
    id: 2,
    author: 'Zach',
    category: 'History',
    title: 'The Big Short War',
    excerpt:
      'He was the kind of hyper-ambitious kid other kids tend to hate. On the night before the L.A.P.D, his father took pity on him and cancelled the trip...',
    content: 'Full content for "The Big Short War"...',
    commentsCount: 14,
  },
  {
    id: 3,
    author: 'Nicholas',
    category: 'Exercise',
    title: 'The Mental Health Benefits of Exercise',
    excerpt:
      'You already know that exercise is good for your body. But did you know it can also boost your mood, improve your sleep, and help you deal with stress?',
    content: 'Full content for "The Mental Health Benefits of Exercise" (1)...',
    commentsCount: 32,
  },
  {
    id: 4,
    author: 'Nicholas',
    category: 'Exercise',
    title: 'The Mental Health Benefits of Exercise',
    excerpt:
      'You already know that exercise is good for your body. But did you know it can also boost your mood, improve your sleep, and help you deal with stress?',
    content: 'Full content for "The Mental Health Benefits of Exercise" (2)...',
    commentsCount: 32,
  },
  {
    id: 5,
    author: 'Nicholas',
    category: 'Exercise',
    title: 'The Mental Health Benefits of Exercise',
    excerpt:
      'You already know that exercise is good for your body. But did you know it can also boost your mood, improve your sleep, and help you deal with stress?',
    content: 'Full content for "The Mental Health Benefits of Exercise" (3)...',
    commentsCount: 32,
  },
  {
    id: 6,
    author: 'Nicholas',
    category: 'Exercise',
    title: 'The Mental Health Benefits of Exercise',
    excerpt:
      'You already know that exercise is good for your body. But did you know it can also boost your mood, improve your sleep, and help you deal with stress?',
    content: 'Full content for "The Mental Health Benefits of Exercise" (4)...',
    commentsCount: 32,
  },
];

//
// 2. COMMENTS DATA
//
const comments = [
  // For post with id=2 ("The Big Short War")
  {
    id: 101,
    author: 'Wittawat88',
    content: 'Lorem ipsum dolor sit amet consectetur. Purus cursus vel a et pretium quam imperdiet.',
    postId: 2,
  },
  {
    id: 102,
    author: 'Hawaii5',
    content: 'Lorem ipsum dolor sit amet consectetur. Amet mollis eget fringilla et fusce.',
    postId: 2,
  },
  {
    id: 103,
    author: 'Ace123',
    content: 'Lorem ipsum dolor sit amet consectetur. Purus cursus vel a et pretium quam imperdiet.',
    postId: 2,
  },

  // For post with id=1 ("The Beginning of the End of the World")
  {
    id: 104,
    author: 'UserA',
    content: 'Great post! Thanks for sharing.',
    postId: 1,
  },
  {
    id: 105,
    author: 'UserB',
    content: 'I disagree with some points, but interesting read.',
    postId: 1,
  },
];

async function main() {
  // Upsert all posts
  for (const post of posts) {
    await prisma.post.upsert({
      where: { id: post.id },
      update: {
        author: post.author,
        category: post.category,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        commentsCount: post.commentsCount,
      },
      create: {
        ...post,
      },
    });
  }

  // Upsert all comments
  for (const comment of comments) {
    await prisma.comment.upsert({
      where: { id: comment.id },
      update: {
        author: comment.author,
        content: comment.content,
        postId: comment.postId,
      },
      create: {
        ...comment,
      },
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
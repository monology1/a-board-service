import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//
// 1. USERS DATA
//
const users = [
  {
    username: 'writesel',
    firstName: 'Sarah',
    lastName: 'Writesel',
    email: 'sarah.writesel@example.com',
    bio: 'History enthusiast and storyteller',
    avatar: 'https://example.com/avatars/writesel.jpg',
  },
  {
    username: 'zach',
    firstName: 'Zachary',
    lastName: 'Thompson',
    email: 'zach.thompson@example.com',
    bio: 'Financial analyst and history buff',
    avatar: 'https://example.com/avatars/zach.jpg',
  },
  {
    username: 'nicholas',
    firstName: 'Nicholas',
    lastName: 'Chen',
    email: 'nicholas.chen@example.com',
    bio: 'Fitness expert and wellness coach',
    avatar: 'https://example.com/avatars/nicholas.jpg',
  },
];

//
// 2. POSTS DATA
//
const createPosts = (users: any[]) => [
  {
    title: 'The Beginning of the End of the World',
    content: 'Full content for "The Beginning of the End of the World"...',
    category: 'History',
    excerpt:
      "The afterlife vision The Good Place comes to its culmination, the show's two protagonists, Eleanor and Chidi, contemplate their future...",
    commentsCount: 32,
    authorId: users[0].id, // Writesel
  },
  {
    title: 'The Big Short War',
    content: 'Full content for "The Big Short War"...',
    category: 'History',
    excerpt:
      'He was the kind of hyper-ambitious kid other kids tend to hate. On the night before the L.A.P.D, his father took pity on him and cancelled the trip...',
    commentsCount: 14,
    authorId: users[1].id, // Zach
  },
  {
    title: 'The Mental Health Benefits of Exercise',
    content: 'Full content for "The Mental Health Benefits of Exercise"...',
    category: 'Exercise',
    excerpt:
      'You already know that exercise is good for your body. But did you know it can also boost your mood, improve your sleep, and help you deal with stress?',
    commentsCount: 32,
    authorId: users[2].id, // Nicholas
  },
];

//
// 3. COMMENTS DATA
//
const createComments = (users: any[], posts: any[]) => [
  {
    content: 'Great post! Thanks for sharing.',
    authorId: users[1].id, // Zach commenting
    postId: posts[0].id, // on Writesel's post
  },
  {
    content: 'I disagree with some points, but interesting read.',
    authorId: users[2].id, // Nicholas commenting
    postId: posts[0].id, // on Writesel's post
  },
  {
    content: 'This really helped me understand the topic better.',
    authorId: users[0].id, // Writesel commenting
    postId: posts[1].id, // on Zach's post
  },
];

async function main() {
  console.log('Start seeding...');

  // Clear existing data
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const createdUsers: any = [];
  for (const user of users) {
    const createdUser = await prisma.user.create({
      data: user,
    });
    createdUsers.push(createdUser);
    console.log(`Created user: ${createdUser.username}`);
  }

  // Create posts
  const posts: any = createPosts(createdUsers);
  const createdPosts: any = [];
  for (const post of posts) {
    const createdPost = await prisma.post.create({
      data: post,
    });
    createdPosts.push(createdPost);
    console.log(`Created post: ${createdPost.title}`);
  }

  // Create comments
  const comments: any = createComments(createdUsers, createdPosts);
  for (const comment of comments) {
    const createdComment = await prisma.comment.create({
      data: comment,
    });
    console.log(`Created comment: ${createdComment.id}`);
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

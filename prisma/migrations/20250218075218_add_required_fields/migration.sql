-- First, make sure the User table has all required fields
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "email" TEXT,
ADD COLUMN IF NOT EXISTS "firstName" TEXT,
ADD COLUMN IF NOT EXISTS "lastName" TEXT,
ADD COLUMN IF NOT EXISTS "bio" TEXT,
ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT,
ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS "role" TEXT DEFAULT 'user';

-- Add temporary columns to store author IDs
ALTER TABLE "Post" ADD COLUMN "authorId" INTEGER;
ALTER TABLE "Comment" ADD COLUMN "authorId" INTEGER;

-- Update the authorId columns based on the username match
UPDATE "Post" p
SET "authorId" = u.id
FROM "User" u
WHERE p.author = u.username;

UPDATE "Comment" c
SET "authorId" = u.id
FROM "User" u
WHERE c.author = u.username;

-- Drop the old author columns
ALTER TABLE "Post" DROP COLUMN "author";
ALTER TABLE "Comment" DROP COLUMN "author";

-- Add foreign key constraints
ALTER TABLE "Post" 
ADD CONSTRAINT "Post_authorId_fkey" 
FOREIGN KEY ("authorId") 
REFERENCES "User"(id) 
ON DELETE CASCADE;

ALTER TABLE "Comment" 
ADD CONSTRAINT "Comment_authorId_fkey" 
FOREIGN KEY ("authorId") 
REFERENCES "User"(id) 
ON DELETE CASCADE;

-- Make authorId required
ALTER TABLE "Post" ALTER COLUMN "authorId" SET NOT NULL;
ALTER TABLE "Comment" ALTER COLUMN "authorId" SET NOT NULL;

-- Add unique constraint to email
ALTER TABLE "User" ADD CONSTRAINT "User_email_key" UNIQUE ("email");

-- Make required fields NOT NULL
ALTER TABLE "User" 
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "lastName" SET NOT NULL;


/*
  Warnings:

  - Added the required column `role` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('active', 'banned');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "hash" VARCHAR,
ADD COLUMN     "role" "user_role" NOT NULL,
ADD COLUMN     "status" "user_status" NOT NULL,
ALTER COLUMN "nickname" SET DATA TYPE VARCHAR,
ALTER COLUMN "email" SET DATA TYPE VARCHAR;

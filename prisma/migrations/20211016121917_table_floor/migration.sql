/*
  Warnings:

  - Added the required column `floor` to the `Table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Table" ADD COLUMN     "floor" TEXT NOT NULL;

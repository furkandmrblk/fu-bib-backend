/*
  Warnings:

  - Added the required column `order` to the `Table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Table" ADD COLUMN     "order" INTEGER NOT NULL;

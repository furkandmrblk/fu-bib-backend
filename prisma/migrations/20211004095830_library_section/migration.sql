/*
  Warnings:

  - A unique constraint covering the columns `[section]` on the table `Library` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `section` to the `Library` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Library" ADD COLUMN     "section" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Library_section_key" ON "Library"("section");

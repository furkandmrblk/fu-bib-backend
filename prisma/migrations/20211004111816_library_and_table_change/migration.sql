/*
  Warnings:

  - You are about to drop the column `libraryId` on the `Table` table. All the data in the column will be lost.
  - Added the required column `libraryName` to the `Table` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Table" DROP CONSTRAINT "Table_libraryId_fkey";

-- AlterTable
ALTER TABLE "Table" DROP COLUMN "libraryId",
ADD COLUMN     "libraryName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Table" ADD CONSTRAINT "Table_libraryName_fkey" FOREIGN KEY ("libraryName") REFERENCES "Library"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

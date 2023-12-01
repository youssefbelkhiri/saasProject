/*
  Warnings:

  - You are about to drop the column `group_id` on the `Exam` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_group_id_fkey";

-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "group_id";

-- CreateTable
CREATE TABLE "_ExamToGroups" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ExamToGroups_AB_unique" ON "_ExamToGroups"("A", "B");

-- CreateIndex
CREATE INDEX "_ExamToGroups_B_index" ON "_ExamToGroups"("B");

-- AddForeignKey
ALTER TABLE "_ExamToGroups" ADD CONSTRAINT "_ExamToGroups_A_fkey" FOREIGN KEY ("A") REFERENCES "Exam"("exam_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExamToGroups" ADD CONSTRAINT "_ExamToGroups_B_fkey" FOREIGN KEY ("B") REFERENCES "Groups"("group_id") ON DELETE CASCADE ON UPDATE CASCADE;

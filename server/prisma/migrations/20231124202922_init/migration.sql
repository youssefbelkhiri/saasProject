/*
  Warnings:

  - You are about to drop the `StudentGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudentGroup" DROP CONSTRAINT "StudentGroup_group_id_fkey";

-- DropForeignKey
ALTER TABLE "StudentGroup" DROP CONSTRAINT "StudentGroup_student_id_fkey";

-- DropTable
DROP TABLE "StudentGroup";

-- CreateTable
CREATE TABLE "_GroupsToStudents" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GroupsToStudents_AB_unique" ON "_GroupsToStudents"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupsToStudents_B_index" ON "_GroupsToStudents"("B");

-- AddForeignKey
ALTER TABLE "_GroupsToStudents" ADD CONSTRAINT "_GroupsToStudents_A_fkey" FOREIGN KEY ("A") REFERENCES "Groups"("group_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupsToStudents" ADD CONSTRAINT "_GroupsToStudents_B_fkey" FOREIGN KEY ("B") REFERENCES "Students"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;

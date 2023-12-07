/*
  Warnings:

  - You are about to drop the `StudentPapers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudentPapers" DROP CONSTRAINT "StudentPapers_exam_id_fkey";

-- DropForeignKey
ALTER TABLE "StudentPapers" DROP CONSTRAINT "StudentPapers_student_id_fkey";

-- DropTable
DROP TABLE "StudentPapers";

-- CreateTable
CREATE TABLE "Papers" (
    "paper_id" SERIAL NOT NULL,
    "paper" TEXT NOT NULL,
    "note" DECIMAL(65,30) NOT NULL,
    "exam_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,

    CONSTRAINT "Papers_pkey" PRIMARY KEY ("paper_id")
);

-- AddForeignKey
ALTER TABLE "Papers" ADD CONSTRAINT "Papers_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "Exam"("exam_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Papers" ADD CONSTRAINT "Papers_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Students"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

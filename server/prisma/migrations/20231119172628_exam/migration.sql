/*
  Warnings:

  - Added the required column `exam_id` to the `Questions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Questions" ADD COLUMN     "exam_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Exam" (
    "exam_id" SERIAL NOT NULL,
    "name" TEXT,
    "exam_language" TEXT NOT NULL,
    "description" TEXT,
    "exam_time" DOUBLE PRECISION NOT NULL,
    "total_point" DOUBLE PRECISION NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("exam_id")
);

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Questions" ADD CONSTRAINT "Questions_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "Exam"("exam_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "StudentPapers" (
    "paper_id" SERIAL NOT NULL,
    "paper" TEXT NOT NULL,
    "note" DECIMAL(65,30) NOT NULL,
    "exam_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,

    CONSTRAINT "StudentPapers_pkey" PRIMARY KEY ("paper_id")
);

-- AddForeignKey
ALTER TABLE "StudentPapers" ADD CONSTRAINT "StudentPapers_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "Exam"("exam_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentPapers" ADD CONSTRAINT "StudentPapers_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Students"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

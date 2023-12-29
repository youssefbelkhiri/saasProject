-- CreateTable
CREATE TABLE "student_group" (
    "student_group_id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,

    CONSTRAINT "student_group_pkey" PRIMARY KEY ("student_group_id")
);

-- CreateTable
CREATE TABLE "Questions" (
    "question_id" SERIAL NOT NULL,
    "questionOrder" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "points" INTEGER NOT NULL,

    CONSTRAINT "Questions_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "Options" (
    "option_id" SERIAL NOT NULL,
    "optionOrder" INTEGER NOT NULL,
    "option" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "Options_pkey" PRIMARY KEY ("option_id")
);

-- AddForeignKey
ALTER TABLE "Options" ADD CONSTRAINT "Options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Questions"("question_id") ON DELETE RESTRICT ON UPDATE CASCADE;

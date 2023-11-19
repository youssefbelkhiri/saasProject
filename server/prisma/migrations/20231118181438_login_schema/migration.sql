/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
DROP COLUMN "name",
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "user_id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("user_id");

-- CreateTable
CREATE TABLE "Plan" (
    "plan_id" SERIAL NOT NULL,
    "plan_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("plan_id")
);

-- CreateTable
CREATE TABLE "UserPlan" (
    "user_id" INTEGER NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "date_start" TIMESTAMP(3) NOT NULL,
    "date_end" TIMESTAMP(3) NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "UserPlan_pkey" PRIMARY KEY ("user_id","plan_id")
);

-- CreateTable
CREATE TABLE "Feature" (
    "feature_id" SERIAL NOT NULL,
    "feature_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("feature_id")
);

-- CreateTable
CREATE TABLE "PlanFeature" (
    "plan_id" INTEGER NOT NULL,
    "feature_id" INTEGER NOT NULL,

    CONSTRAINT "PlanFeature_pkey" PRIMARY KEY ("plan_id","feature_id")
);

-- AddForeignKey
ALTER TABLE "UserPlan" ADD CONSTRAINT "UserPlan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPlan" ADD CONSTRAINT "UserPlan_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "Plan"("plan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanFeature" ADD CONSTRAINT "PlanFeature_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "Plan"("plan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanFeature" ADD CONSTRAINT "PlanFeature_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "Feature"("feature_id") ON DELETE RESTRICT ON UPDATE CASCADE;

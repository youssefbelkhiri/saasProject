/*
  Warnings:

  - The primary key for the `PlanFeature` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UserPlan` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "PlanFeature" DROP CONSTRAINT "PlanFeature_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "PlanFeature_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "UserPlan" DROP CONSTRAINT "UserPlan_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "UserPlan_pkey" PRIMARY KEY ("id");

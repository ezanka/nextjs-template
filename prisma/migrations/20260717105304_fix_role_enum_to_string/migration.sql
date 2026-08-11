/*
  Warnings:

  - The `role` column on the `invitation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `invitation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `member` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "invitation" DROP COLUMN "role",
ADD COLUMN     "role" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "member" DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'member';

-- DropEnum
DROP TYPE "InvitationStatus";

-- DropEnum
DROP TYPE "MemberRole";

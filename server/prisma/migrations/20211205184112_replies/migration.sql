-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "isReply" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "replyId" TEXT;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

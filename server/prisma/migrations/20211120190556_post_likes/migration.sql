-- CreateTable
CREATE TABLE "_postlikes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_postlikes_AB_unique" ON "_postlikes"("A", "B");

-- CreateIndex
CREATE INDEX "_postlikes_B_index" ON "_postlikes"("B");

-- AddForeignKey
ALTER TABLE "_postlikes" ADD FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_postlikes" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

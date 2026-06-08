-- CreateTable
CREATE TABLE "Documentation" (
    "id" TEXT NOT NULL,
    "caption" TEXT,
    "category" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "publicId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Documentation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Documentation_publicId_key" ON "Documentation"("publicId");

-- CreateIndex
CREATE INDEX "Documentation_category_published_idx" ON "Documentation"("category", "published");

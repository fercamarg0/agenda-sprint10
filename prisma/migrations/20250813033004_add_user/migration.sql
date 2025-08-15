-- AlterTable
ALTER TABLE "public"."ProductCategory" ADD COLUMN     "userBusinessId" UUID;

-- AlterTable
ALTER TABLE "public"."ProductSupplier" ADD COLUMN     "userBusinessId" UUID;

-- CreateIndex
CREATE INDEX "ProductCategory_createdById_idx" ON "public"."ProductCategory"("createdById");

-- CreateIndex
CREATE INDEX "ProductCategory_updatedById_idx" ON "public"."ProductCategory"("updatedById");

-- CreateIndex
CREATE INDEX "ProductSupplier_createdById_idx" ON "public"."ProductSupplier"("createdById");

-- CreateIndex
CREATE INDEX "ProductSupplier_updatedById_idx" ON "public"."ProductSupplier"("updatedById");

-- AddForeignKey
ALTER TABLE "public"."ProductCategory" ADD CONSTRAINT "ProductCategory_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."UserBusiness"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductCategory" ADD CONSTRAINT "ProductCategory_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."UserBusiness"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductCategory" ADD CONSTRAINT "ProductCategory_userBusinessId_fkey" FOREIGN KEY ("userBusinessId") REFERENCES "public"."UserBusiness"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductSupplier" ADD CONSTRAINT "ProductSupplier_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."UserBusiness"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductSupplier" ADD CONSTRAINT "ProductSupplier_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."UserBusiness"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductSupplier" ADD CONSTRAINT "ProductSupplier_userBusinessId_fkey" FOREIGN KEY ("userBusinessId") REFERENCES "public"."UserBusiness"("id") ON DELETE SET NULL ON UPDATE CASCADE;

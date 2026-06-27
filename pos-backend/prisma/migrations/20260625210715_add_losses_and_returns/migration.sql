-- CreateEnum
CREATE TYPE "LossType" AS ENUM ('VENCIDO', 'DANADO', 'MERMA', 'OTRO');

-- CreateEnum
CREATE TYPE "ReturnType" AS ENUM ('VENCIDO', 'DEFECTO_FABRICA', 'MAL_ESTADO_LLEGADA', 'OTRO');

-- CreateTable
CREATE TABLE "ProductLoss" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reason" "LossType" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ProductLoss_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductReturn" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reason" "ReturnType" NOT NULL,
    "notes" TEXT,
    "supplier" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ProductReturn_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductLoss" ADD CONSTRAINT "ProductLoss_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductLoss" ADD CONSTRAINT "ProductLoss_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductReturn" ADD CONSTRAINT "ProductReturn_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductReturn" ADD CONSTRAINT "ProductReturn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

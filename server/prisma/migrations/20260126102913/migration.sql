/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `historic_place` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "historic_place_name_key" ON "historic_place"("name");

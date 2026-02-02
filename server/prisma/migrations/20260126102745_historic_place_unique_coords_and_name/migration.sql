/*
  Warnings:

  - A unique constraint covering the columns `[coord_x]` on the table `historic_place` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[coord_y]` on the table `historic_place` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "historic_place_coord_x_key" ON "historic_place"("coord_x");

-- CreateIndex
CREATE UNIQUE INDEX "historic_place_coord_y_key" ON "historic_place"("coord_y");

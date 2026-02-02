-- CreateTable
CREATE TABLE "historic_place" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "coord_x" DOUBLE PRECISION NOT NULL,
    "coord_y" DOUBLE PRECISION NOT NULL,
    "historic_value" DOUBLE PRECISION NOT NULL,
    "days_to_visit" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "historic_place_pkey" PRIMARY KEY ("id")
);

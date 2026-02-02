-- CreateTable
CREATE TABLE "trip" (
    "id" UUID NOT NULL,
    "max_cost_limit" DOUBLE PRECISION NOT NULL,
    "max_time_limit" INTEGER NOT NULL,
    "total_value" DOUBLE PRECISION NOT NULL,
    "total_cost" DOUBLE PRECISION NOT NULL,
    "total_time" DOUBLE PRECISION NOT NULL,
    "calculation_time" DOUBLE PRECISION NOT NULL,
    "algorithm_id" UUID NOT NULL,
    "parameters_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_step" (
    "id" UUID NOT NULL,
    "trip_id" UUID NOT NULL,
    "historic_place_id" UUID NOT NULL,
    "visit_order" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "trip_step_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "travel_cost" (
    "id" UUID NOT NULL,
    "source_id" UUID NOT NULL,
    "destination_id" UUID NOT NULL,
    "travel_cost" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "travel_cost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "algorithm" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "algorithm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "algorithm_parameters" (
    "id" UUID NOT NULL,
    "alpha" DOUBLE PRECISION,
    "beta" DOUBLE PRECISION,
    "evaporation_rate" DOUBLE PRECISION,
    "iterations" INTEGER,
    "antCount" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "algorithm_parameters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "nickname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trip_parameters_id_key" ON "trip"("parameters_id");

-- CreateIndex
CREATE UNIQUE INDEX "trip_step_trip_id_visit_order_key" ON "trip_step"("trip_id", "visit_order");

-- CreateIndex
CREATE UNIQUE INDEX "travel_cost_source_id_destination_id_key" ON "travel_cost"("source_id", "destination_id");

-- CreateIndex
CREATE UNIQUE INDEX "algorithm_name_key" ON "algorithm"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_nickname_key" ON "user"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "trip" ADD CONSTRAINT "trip_algorithm_id_fkey" FOREIGN KEY ("algorithm_id") REFERENCES "algorithm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip" ADD CONSTRAINT "trip_parameters_id_fkey" FOREIGN KEY ("parameters_id") REFERENCES "algorithm_parameters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip" ADD CONSTRAINT "trip_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_step" ADD CONSTRAINT "trip_step_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_step" ADD CONSTRAINT "trip_step_historic_place_id_fkey" FOREIGN KEY ("historic_place_id") REFERENCES "historic_place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_cost" ADD CONSTRAINT "travel_cost_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "historic_place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_cost" ADD CONSTRAINT "travel_cost_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "historic_place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

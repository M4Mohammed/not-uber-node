-- CreateEnum
CREATE TYPE "user_type" AS ENUM ('ADMIN', 'DRIVER', 'RIDER');

-- CreateEnum
CREATE TYPE "driver_status" AS ENUM ('ONLINE', 'OFFLINE');

-- CreateEnum
CREATE TYPE "ride_status" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED', 'SCHEDULED');

-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "first_name" VARCHAR NOT NULL,
    "last_name" VARCHAR NOT NULL,
    "date_of_birth" TIMESTAMP NOT NULL,
    "gender" VARCHAR NOT NULL,
    "phone_number" VARCHAR NOT NULL,
    "city" VARCHAR NOT NULL,
    "state" VARCHAR NOT NULL,
    "national_id" VARCHAR NOT NULL,
    "refresh_token_version" INTEGER NOT NULL DEFAULT 0,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "user_type" "user_type" NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "riders" (
    "id" VARCHAR NOT NULL,
    "user_id" VARCHAR NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "rating" DECIMAL NOT NULL DEFAULT 0,

    CONSTRAINT "riders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drivers" (
    "id" VARCHAR NOT NULL,
    "user_id" VARCHAR NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "license_number" VARCHAR NOT NULL,
    "status" "driver_status" NOT NULL DEFAULT 'ONLINE',
    "rating" DECIMAL NOT NULL DEFAULT 0,

    CONSTRAINT "drivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,
    "make" VARCHAR NOT NULL,
    "model" VARCHAR NOT NULL,
    "year" INTEGER NOT NULL,
    "license_plate" VARCHAR NOT NULL,
    "vehicle_class" VARCHAR NOT NULL,
    "seat_capacity" INTEGER NOT NULL,
    "has_ac" BOOLEAN NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trips" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,
    "driver_id" VARCHAR NOT NULL,
    "rider_id" VARCHAR NOT NULL,
    "vehicle_id" VARCHAR NOT NULL,
    "trip_type" VARCHAR NOT NULL,
    "fare_id" VARCHAR NOT NULL,
    "start_time" TIMESTAMP NOT NULL,
    "end_time" TIMESTAMP NOT NULL,
    "duration" TIMESTAMP NOT NULL,
    "waiting_time" DECIMAL NOT NULL,
    "start_location" VARCHAR NOT NULL,
    "start_location_coordinates" JSONB NOT NULL,
    "end_location" VARCHAR NOT NULL,
    "end_location_coordinates" JSONB NOT NULL,
    "distance" DECIMAL NOT NULL,
    "status" "ride_status" NOT NULL DEFAULT 'SCHEDULED',
    "total_fare" DECIMAL NOT NULL,
    "comment" VARCHAR,
    "cancel_reason" VARCHAR,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_types" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "base_fare" DECIMAL NOT NULL,
    "cost_per_km" DECIMAL NOT NULL,
    "cost_per_min" DECIMAL NOT NULL,
    "min_fare" DECIMAL NOT NULL,
    "max_fare" DECIMAL NOT NULL,

    CONSTRAINT "trip_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fare_rules" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,
    "name" VARCHAR NOT NULL,
    "condition" JSONB NOT NULL,
    "action" JSONB NOT NULL,
    "tripTypeId" VARCHAR,

    CONSTRAINT "fare_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_type_fare_rules" (
    "trip_type_id" VARCHAR NOT NULL,
    "fare_rule_id" VARCHAR NOT NULL,

    CONSTRAINT "trip_type_fare_rules_pkey" PRIMARY KEY ("trip_type_id","fare_rule_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- CreateIndex
CREATE INDEX "users_id_idx" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "riders_user_id_key" ON "riders"("user_id");

-- CreateIndex
CREATE INDEX "riders_id_idx" ON "riders"("id");

-- CreateIndex
CREATE UNIQUE INDEX "drivers_user_id_key" ON "drivers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "drivers_license_number_key" ON "drivers"("license_number");

-- CreateIndex
CREATE INDEX "drivers_id_idx" ON "drivers"("id");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_license_plate_key" ON "vehicles"("license_plate");

-- CreateIndex
CREATE INDEX "vehicles_id_idx" ON "vehicles"("id");

-- CreateIndex
CREATE INDEX "trips_id_idx" ON "trips"("id");

-- CreateIndex
CREATE UNIQUE INDEX "trip_types_name_key" ON "trip_types"("name");

-- CreateIndex
CREATE INDEX "trip_types_id_idx" ON "trip_types"("id");

-- CreateIndex
CREATE INDEX "fare_rules_id_idx" ON "fare_rules"("id");

-- AddForeignKey
ALTER TABLE "riders" ADD CONSTRAINT "riders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_rider_id_fkey" FOREIGN KEY ("rider_id") REFERENCES "riders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_trip_type_fkey" FOREIGN KEY ("trip_type") REFERENCES "trip_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_fare_id_fkey" FOREIGN KEY ("fare_id") REFERENCES "fare_rules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_type_fare_rules" ADD CONSTRAINT "trip_type_fare_rules_trip_type_id_fkey" FOREIGN KEY ("trip_type_id") REFERENCES "trip_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_type_fare_rules" ADD CONSTRAINT "trip_type_fare_rules_fare_rule_id_fkey" FOREIGN KEY ("fare_rule_id") REFERENCES "fare_rules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

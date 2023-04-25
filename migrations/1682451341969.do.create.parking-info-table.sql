CREATE TABLE "parkingInformations" (
"parkingInfoId" SERIAL PRIMARY KEY,
"location" text NOT NULL, 
"fourWheelerLimit" INT,
"twoWheelerLimit" INT,
"fourWheelerParked" INT,
"twoWheelerParked" INT,
status BOOLEAN NOT NULL DEFAULT true,
"createdBy" VARCHAR(40),
"updatedBy" VARCHAR(40),
"deletedBy" VARCHAR(40),
"createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
"updatedAt" TIMESTAMPTZ,
"deletedAt" TIMESTAMPTZ
)
CREATE TABLE "vehicles" (
"vehicleId" SERIAL PRIMARY KEY,
"vehicleNumber" VARCHAR(30),
"outstandingBill" INT,
"totalBill" INT NOT NULL,
status BOOLEAN NOT NULL DEFAULT true,
"createdBy" VARCHAR(40),
"updatedBy" VARCHAR(40),
"deletedBy" VARCHAR(40),
"createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
"updatedAt" TIMESTAMPTZ,
"deletedAt" TIMESTAMPTZ
)
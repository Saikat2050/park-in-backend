CREATE TABLE "entranceData" (
"entranceId" SERIAL PRIMARY KEY,
"parkingId" INT NOT NULL, 
"vehicleId" INT,
"entryTime" VARCHAR(20) NOT NULL,
"expectedExitTime" VARCHAR(20) NOT NULL,
"exitTime" VARCHAR(20),
"overTime" VARCHAR(20),
"isExited" BOOLEAN,
status BOOLEAN NOT NULL DEFAULT true,
"createdBy" VARCHAR(40),
"updatedBy" VARCHAR(40),
"deletedBy" VARCHAR(40),
"createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
"updatedAt" TIMESTAMPTZ,
"deletedAt" TIMESTAMPTZ
)
CREATE TABLE "users" (
"userId" SERIAL PRIMARY KEY,
"vehicleId" INT NOT NULL, 
name VARCHAR(30),
"userName" VARCHAR(30) NOT NULL,
"secretCode" VARCHAR(255) NOT NULL,
"verificationCode" INT,
status BOOLEAN NOT NULL DEFAULT true,
"createdBy" VARCHAR(40),
"updatedBy" VARCHAR(40),
"deletedBy" VARCHAR(40),
"createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
"updatedAt" TIMESTAMPTZ,
"deletedAt" TIMESTAMPTZ
)
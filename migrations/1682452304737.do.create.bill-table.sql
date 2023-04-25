CREATE TABLE "bills" (
"billId" SERIAL PRIMARY KEY,
"vehicleId" VARCHAR(30),
"amountPaid" INT,
"totalBill" INT NOT NULL,
"isClosed" BOOLEAN,
status BOOLEAN NOT NULL DEFAULT true,
"createdBy" VARCHAR(40),
"updatedBy" VARCHAR(40),
"deletedBy" VARCHAR(40),
"createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
"updatedAt" TIMESTAMPTZ,
"deletedAt" TIMESTAMPTZ
)
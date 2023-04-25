CREATE TABLE "payments" (
"transactionId" SERIAL PRIMARY KEY,
"billId" INT NOT NULL,
"amountPaid" INT,
"mode" INT NOT NULL,
"remarks" TEXT,
status BOOLEAN NOT NULL DEFAULT true,
"createdBy" VARCHAR(40),
"updatedBy" VARCHAR(40),
"deletedBy" VARCHAR(40),
"createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
"updatedAt" TIMESTAMPTZ,
"deletedAt" TIMESTAMPTZ
)
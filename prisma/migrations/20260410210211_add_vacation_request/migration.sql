-- CreateTable
CREATE TABLE "Vacation_Request" (
    "id" SERIAL NOT NULL,
    "emp_id" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "reason" TEXT NOT NULL,
    "apprStatus" BOOLEAN NOT NULL,

    CONSTRAINT "Vacation_Request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Vacation_Request_emp_id_idx" ON "Vacation_Request"("emp_id");

-- AddForeignKey
ALTER TABLE "Vacation_Request" ADD CONSTRAINT "Vacation_Request_emp_id_fkey" FOREIGN KEY ("emp_id") REFERENCES "Employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

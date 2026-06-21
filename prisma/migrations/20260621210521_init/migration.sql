-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "ApprState" AS ENUM ('VERIFIED', 'NOT_VERIFIED');

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "approvalState" "ApprState" NOT NULL DEFAULT 'NOT_VERIFIED',
    "verificationCode" INTEGER,
    "verificationCode_ExpiresAt" TIMESTAMP(3),
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50),
    "hashedPassword" TEXT NOT NULL,
    "hashedRefreshToken" TEXT,
    "hashedAccessToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "employee_id" INTEGER,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employees" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "name_code" TEXT NOT NULL,
    "attrition" BOOLEAN NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" BOOLEAN NOT NULL,
    "distance_from_home" INTEGER NOT NULL,
    "hourly_rate" INTEGER NOT NULL,
    "daily_rate" INTEGER NOT NULL,
    "monthly_rate" INTEGER NOT NULL,
    "monthly_income" INTEGER NOT NULL,
    "percent_salary_hike" INTEGER NOT NULL,
    "job_level" INTEGER NOT NULL,
    "num_of_companies_worked" INTEGER NOT NULL,
    "total_working_years" INTEGER NOT NULL,
    "training_times_last_year" INTEGER NOT NULL,
    "years_at_company" INTEGER NOT NULL,
    "years_in_current_role" INTEGER NOT NULL,
    "years_since_last_promotion" INTEGER NOT NULL,
    "years_with_curr_manager" INTEGER NOT NULL,
    "stock_option_level" INTEGER NOT NULL,
    "over_time" BOOLEAN NOT NULL,
    "workload_pressure_index" INTEGER NOT NULL,
    "engagement_score" INTEGER NOT NULL,
    "engagement_feedback_score" INTEGER NOT NULL,
    "training_hours_last_year" INTEGER NOT NULL,
    "training_hours_last_6_months" INTEGER NOT NULL,
    "training_gap_score" INTEGER NOT NULL,
    "promotion_stagnation_ratio" DOUBLE PRECISION NOT NULL,
    "role_stability_ratio" DOUBLE PRECISION NOT NULL,
    "marital_status_id" INTEGER NOT NULL,
    "job_role_id" INTEGER NOT NULL,
    "business_travel_id" INTEGER NOT NULL,
    "department_id" INTEGER NOT NULL,
    "education_id" INTEGER NOT NULL,
    "performance_rating_id" INTEGER NOT NULL,
    "attrition_risk_class_id" INTEGER NOT NULL,
    "environment_satisfaction_id" INTEGER NOT NULL,
    "job_involvement_id" INTEGER NOT NULL,
    "job_satisfaction_id" INTEGER NOT NULL,
    "relationship_satisfaction_id" INTEGER NOT NULL,
    "work_life_balance_id" INTEGER NOT NULL,
    "work_shift_id" INTEGER NOT NULL,

    CONSTRAINT "Employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaritalStatus" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "name_code" TEXT NOT NULL,

    CONSTRAINT "MaritalStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessTravel" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "name_code" TEXT NOT NULL,

    CONSTRAINT "BusinessTravel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepartmentType" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "name_code" TEXT NOT NULL,

    CONSTRAINT "DepartmentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "name_code" TEXT NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Satisfaction" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "name_code" TEXT NOT NULL,

    CONSTRAINT "Satisfaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobRoleType" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "name_code" TEXT NOT NULL,

    CONSTRAINT "JobRoleType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceRating" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "name_code" TEXT NOT NULL,

    CONSTRAINT "PerformanceRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttritionRiskClass" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "name_code" TEXT NOT NULL,

    CONSTRAINT "AttritionRiskClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestStatus" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "RequestStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vacation_Request" (
    "id" SERIAL NOT NULL,
    "emp_id" INTEGER NOT NULL,
    "processed_by" TEXT,
    "processed_at" TIMESTAMP(3),
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "reason" TEXT NOT NULL,
    "approval_status" INTEGER NOT NULL,

    CONSTRAINT "Vacation_Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkShift" (
    "id" SERIAL NOT NULL,
    "shift_name" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "grace_period_minutes" INTEGER NOT NULL,

    CONSTRAINT "WorkShift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance_Logs" (
    "id" SERIAL NOT NULL,
    "emp_id" INTEGER NOT NULL,
    "check_in" TIMESTAMP(3) NOT NULL,
    "check_out" TIMESTAMP(3),
    "shift_id" INTEGER NOT NULL,

    CONSTRAINT "Attendance_Logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_phone_key" ON "Users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Users_employee_id_key" ON "Users"("employee_id");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_marital_status_id_fkey" FOREIGN KEY ("marital_status_id") REFERENCES "MaritalStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_job_role_id_fkey" FOREIGN KEY ("job_role_id") REFERENCES "JobRoleType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_business_travel_id_fkey" FOREIGN KEY ("business_travel_id") REFERENCES "BusinessTravel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "DepartmentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_education_id_fkey" FOREIGN KEY ("education_id") REFERENCES "Education"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_performance_rating_id_fkey" FOREIGN KEY ("performance_rating_id") REFERENCES "PerformanceRating"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_attrition_risk_class_id_fkey" FOREIGN KEY ("attrition_risk_class_id") REFERENCES "AttritionRiskClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_environment_satisfaction_id_fkey" FOREIGN KEY ("environment_satisfaction_id") REFERENCES "Satisfaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_job_involvement_id_fkey" FOREIGN KEY ("job_involvement_id") REFERENCES "Satisfaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_job_satisfaction_id_fkey" FOREIGN KEY ("job_satisfaction_id") REFERENCES "Satisfaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_relationship_satisfaction_id_fkey" FOREIGN KEY ("relationship_satisfaction_id") REFERENCES "Satisfaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_work_life_balance_id_fkey" FOREIGN KEY ("work_life_balance_id") REFERENCES "Satisfaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_work_shift_id_fkey" FOREIGN KEY ("work_shift_id") REFERENCES "WorkShift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vacation_Request" ADD CONSTRAINT "Vacation_Request_emp_id_fkey" FOREIGN KEY ("emp_id") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vacation_Request" ADD CONSTRAINT "Vacation_Request_processed_by_fkey" FOREIGN KEY ("processed_by") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vacation_Request" ADD CONSTRAINT "Vacation_Request_approval_status_fkey" FOREIGN KEY ("approval_status") REFERENCES "RequestStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance_Logs" ADD CONSTRAINT "Attendance_Logs_emp_id_fkey" FOREIGN KEY ("emp_id") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance_Logs" ADD CONSTRAINT "Attendance_Logs_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "WorkShift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

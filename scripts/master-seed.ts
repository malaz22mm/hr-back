import { PrismaClient } from '../generated/prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

//###########################################################
//#########################  MySQL  #########################
//###########################################################
// const adapter = new PrismaMariaDb({
//     host:process.env.DB_HOST ,
//     user:process.env.DB_USERNAME ,
//     password:process.env.DB_PASSWORD ,
//     database: process.env.DB_DATABASE,
//     port:Number(process.env.DB_PORT),
//     // connectionLimit:5
// });
//###########################################################
//#########################  Postgresql  ####################
//###########################################################
const adapter = new PrismaPg({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT),
    ssl: {
        rejectUnauthorized: false,
    },

    // connectionLimit:5
});
//###########################################################
//################### Local  Postgresql  ####################
//###########################################################
// const adapter = new PrismaPg({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
//     port: Number(process.env.DB_PORT),
//     // connectionLimit:5
// });
const prisma = new PrismaClient({
    adapter: adapter
});
//********************************************************* */
// Define an interface for the CSV row structure
interface EmployeeCSVRow {
    id: string;
    name: string;
    name_code: string;
    attrition: string;
    age: string;
    gender: string;
    marital_status_id: string;
    distance_from_home: string;
    hourly_rate: string;
    daily_rate: string;
    monthly_rate: string;
    monthly_income: string;
    percent_salary_hike: string;
    job_level: string;
    num_of_companies_worked: string;
    total_working_years: string;
    training_times_last_year: string;
    years_at_company: string;
    years_in_current_role: string;
    years_since_last_promotion: string;
    years_with_curr_manager: string;
    stock_option_level: string;
    over_time: string;
    workload_pressure_index: string;
    engagement_score: string;
    engagement_feedback_score: string;
    training_hours_last_year: string;
    training_hours_last_6_months: string;
    training_gap_score: string;
    promotion_stagnation_ratio: string;
    role_stability_ratio: string;
    job_role_id: string;
    business_travel_id: string;
    department_id: string;
    education_id: string;
    performance_rating_id: string;
    attrition_risk_class_id: string;
    environment_satisfaction_id: string;
    job_involvement_id: string;
    job_satisfaction_id: string;
    relationship_satisfaction_id: string;
    work_life_balance_id: string;
    work_shift_id: string;
}
//********************************************** */
async function main() {
    console.log('--- Starting Master Seed ---');

    // 1. SEED LOOKUP TABLES
    // These provide the IDs referenced by the Employees CSV
    await seedLookups();

    // 2. SEED SYSTEM USER
    // Required for processing vacation requests
    const systemUserUUID = '00000000-0000-0000-0000-000000000000';
    await prisma.users.upsert({
        where: { id: systemUserUUID },
        update: {},
        create: {
            id: systemUserUUID,
            name: 'System Processor',
            email: 'system@hrms.local',
            hashedPassword: 'SYSTEM_INTERNAL_ACCOUNT',
            role: 'SUPER_ADMIN',
            approvalState: 'VERIFIED',
        },
    });
    console.log('✔ System User seeded');

    // 3. SEED EMPLOYEES
    // Remove the '../' because the file is in the same folder as this script
    const employeesPath = path.resolve(__dirname, './Employees_Dataset_Final_With_Shifts.csv');
     const employeeRaw = fs.readFileSync(employeesPath, 'utf-8');
    const employeeRecords = parse(employeeRaw, {
        columns: true,
        skip_empty_lines: true
    }) as EmployeeCSVRow[];
    console.log(`Parsing ${employeeRecords.length} employees...`);

    // We use a loop or createMany to ensure ID 0 is explicitly set
    for (const record of employeeRecords) {
        await prisma.employees.create({
            data: {
                id: parseInt(record.id),
                name: record.name,
                name_code: record.name_code,
                attrition: record.attrition.toLowerCase() === 'true',
                age: parseInt(record.age),
                gender: record.gender.toLowerCase() === 'true',
                distance_from_home: parseInt(record.distance_from_home),
                hourly_rate: parseInt(record.hourly_rate),
                daily_rate: parseInt(record.daily_rate),
                monthly_rate: parseInt(record.monthly_rate),
                monthly_income: parseInt(record.monthly_income),
                percent_salary_hike: parseInt(record.percent_salary_hike),
                job_level: parseInt(record.job_level),
                num_of_companies_worked: parseInt(record.num_of_companies_worked),
                total_working_years: parseInt(record.total_working_years),
                training_times_last_year: parseInt(record.training_times_last_year),
                years_at_company: parseInt(record.years_at_company),
                years_in_current_role: parseInt(record.years_in_current_role),
                years_since_last_promotion: parseInt(record.years_since_last_promotion),
                years_with_curr_manager: parseInt(record.years_with_curr_manager),
                stock_option_level: parseInt(record.stock_option_level),
                over_time: record.over_time.toLowerCase() === 'true',
                workload_pressure_index: parseInt(record.workload_pressure_index),
                engagement_score: parseInt(record.engagement_score),
                engagement_feedback_score: parseInt(record.engagement_feedback_score),
                training_hours_last_year: parseInt(record.training_hours_last_year),
                training_hours_last_6_months: parseInt(record.training_hours_last_6_months),
                training_gap_score: parseInt(record.training_gap_score),
                promotion_stagnation_ratio: parseFloat(record.promotion_stagnation_ratio),
                role_stability_ratio: parseFloat(record.role_stability_ratio),
                marital_status_id: parseInt(record.marital_status_id),
                job_role_id: parseInt(record.job_role_id),
                business_travel_id: parseInt(record.business_travel_id),
                department_id: parseInt(record.department_id),
                education_id: parseInt(record.education_id),
                performance_rating_id: parseInt(record.performance_rating_id),
                attrition_risk_class_id: parseInt(record.attrition_risk_class_id),
                environment_satisfaction_id: parseInt(record.environment_satisfaction_id),
                job_involvement_id: parseInt(record.job_involvement_id),
                job_satisfaction_id: parseInt(record.job_satisfaction_id),
                relationship_satisfaction_id: parseInt(record.relationship_satisfaction_id),
                work_life_balance_id: parseInt(record.work_life_balance_id),
                work_shift_id: parseInt(record.work_shift_id),
            },
        });
    }
    console.log('✔ Employees seeded');

    // Sync Postgres Sequence for Employees
    await prisma.$executeRawUnsafe(
        `SELECT setval(pg_get_serial_sequence('"Employees"', 'id'), (SELECT MAX(id) FROM "Employees") + 1);`
    );

    // 4. SEED ATTENDANCE LOGS
    // const attendancePath = path.resolve(__dirname, '../attendance_logs_updated.csv');    
    // Remove the '../' because the file is in the same folder as this script
    const attendancePath = path.resolve(__dirname, './attendance_logs_updated.csv');   
    const attendanceRaw = fs.readFileSync(attendancePath, 'utf-8');
    const attendanceRecords = parse(attendanceRaw, { columns: true }) as any[];
    await prisma.attendance_Logs.createMany({
        data: attendanceRecords.map((r: any) => ({
            emp_id: parseInt(r.emp_id),
            check_in: new Date(r.check_in),
            check_out: r.check_out ? new Date(r.check_out) : null,
            shift_id: parseInt(r.shift_id),
        })),
    });
    console.log('✔ Attendance Logs seeded');

    // 5. SEED VACATION REQUESTS
    const vacationPath = path.resolve(__dirname, './vacation_requests_updated.csv');
    const vacationRaw = fs.readFileSync(vacationPath, 'utf-8');
    const vacationRecords = parse(vacationRaw, { columns: true }) as any[];
    await prisma.vacation_Request.createMany({
        data: vacationRecords.map((r: any) => ({
            emp_id: parseInt(r.emp_id),
            processed_by: r.processed_by,
            processed_at: r.processed_at ? new Date(r.processed_at) : null,
            requested_at: new Date(r.requested_at),
            start_date: new Date(r.start_date),
            end_date: new Date(r.end_date),
            reason: r.reason,
            approval_status: parseInt(r.approval_status),
        })),
    });
    console.log('✔ Vacation Requests seeded');

    console.log('--- Master Seed Complete ---');
}

async function seedLookups() {
    // RequestStatus (0, 1, 2 from CSV)
    await prisma.requestStatus.createMany({
        data: [
            { id: 0, name: 'PENDING' },
            { id: 1, name: 'APPROVED' },
            { id: 2, name: 'REJECTED' },
        ],
        skipDuplicates: true,
    });

    // // Satisfaction (0 to 3 from CSV)
    // await prisma.satisfaction.createMany({
    //     data: [
    //         { id: 0, name: 'Low', name_code: 'low' },
    //         { id: 1, name: 'Medium', name_code: 'med' },
    //         { id: 2, name: 'High', name_code: 'high' },
    //         { id: 3, name: 'Very High', name_code: 'vhigh' },
    //     ],
    //     skipDuplicates: true,
    // });

    // WorkShifts (1, 2 from CSV)
    await prisma.workShift.createMany({
        data: [
            { id: 1, shift_name: 'Morning', start_time: new Date('2024-01-01T08:00:00'), end_time: new Date('2024-01-01T16:00:00'), grace_period_minutes: 15 },
            { id: 2, shift_name: 'Afternoon', start_time: new Date('2024-01-01T14:00:00'), end_time: new Date('2024-01-01T22:00:00'), grace_period_minutes: 15 },
        ],
        skipDuplicates: true,
    });

    // Departments, MaritalStatus, Education etc. should be seeded here similarly 
    // mapping the specific IDs found in your CSV to descriptive names.
    console.log('✔ Lookup tables seeded');

    console.log('--- Seeding Dimension Tables ---');

    // 1. Department Mapping
    await prisma.departmentType.createMany({
        data: [
            { id: 0, name: 'Human Resources', name_code: 'hr' },
            { id: 1, name: 'Research & Development', name_code: 'rd' },
            { id: 2, name: 'Sales', name_code: 'sales' },
        ],
        skipDuplicates: true,
    });

    // 2. Marital Status Mapping
    await prisma.maritalStatus.createMany({
        data: [
            { id: 0, name: 'Married', name_code: 'married' },
            { id: 1, name: 'Single', name_code: 'single' },
            { id: 2, name: 'Divorced', name_code: 'divorced' },
        ],
        skipDuplicates: true,
    });

    // 3. Business Travel Mapping
    await prisma.businessTravel.createMany({
        data: [
            { id: 0, name: 'Non-Travel', name_code: 'none' },
            { id: 1, name: 'Travel Rarely', name_code: 'rarely' },
            { id: 2, name: 'Travel Frequently', name_code: 'frequent' },
        ],
        skipDuplicates: true,
    });

    // 4. Education Level Mapping
    await prisma.education.createMany({
        data: [
            { id: 0, name: 'Below College', name_code: 'level_1' },
            { id: 1, name: 'College', name_code: 'level_2' },
            { id: 2, name: 'Bachelor', name_code: 'level_3' },
            { id: 3, name: 'Master', name_code: 'level_4' },
            { id: 4, name: 'Doctor', name_code: 'level_5' },
        ],
        skipDuplicates: true,
    });

    // 5. Job Role Mapping
    await prisma.jobRoleType.createMany({
        data: [
            { id: 0, name: 'Healthcare Representative', name_code: 'hcr' },
            { id: 1, name: 'Human Resources', name_code: 'hr' },
            { id: 2, name: 'Laboratory Technician', name_code: 'lab_tech' },
            { id: 3, name: 'Manager', name_code: 'mgr' },
            { id: 4, name: 'Manufacturing Director', name_code: 'mfg_dir' },
            { id: 5, name: 'Research Director', name_code: 'res_dir' },
            { id: 6, name: 'Research Scientist', name_code: 'res_sci' },
            { id: 7, name: 'Sales Executive', name_code: 'sales_exec' },
            { id: 8, name: 'Sales Representative', name_code: 'sales_rep' },
        ],
        skipDuplicates: true,
    });

    // 6. Performance Rating Mapping
    await prisma.performanceRating.createMany({
        data: [
            { id: 0, name: 'Low', name_code: 'low' },
            { id: 1, name: 'Good', name_code: 'good' },
            { id: 2, name: 'Excellent', name_code: 'exc' },
            { id: 3, name: 'Outstanding', name_code: 'out' },
        ],
        skipDuplicates: true,
    });

    // 7. Attrition Risk Class Mapping
    await prisma.attritionRiskClass.createMany({
        data: [
            { id: 0, name: 'Very Low', name_code: 'vlow' },
            { id: 1, name: 'Low', name_code: 'low' },
            { id: 2, name: 'Medium', name_code: 'med' },
            { id: 3, name: 'High', name_code: 'high' },
        ],
        skipDuplicates: true,
    });

    // Satisfaction levels (used for 5 different relations)
    await prisma.satisfaction.createMany({
        data: [
            { id: 0, name: 'Low', name_code: 'low' },
            { id: 1, name: 'Medium', name_code: 'med' },
            { id: 2, name: 'High', name_code: 'high' },
            { id: 3, name: 'Very High', name_code: 'vhigh' },
        ],
        skipDuplicates: true,
    });

    console.log('✔ All Lookup/Dimension tables seeded');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
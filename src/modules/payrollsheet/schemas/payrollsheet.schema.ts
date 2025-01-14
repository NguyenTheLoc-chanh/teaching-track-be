import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type PayRollSheetDocument = HydratedDocument<Payrollsheet>;

export class Payrollsheet {
    @Prop()
    payroll_sheet_id: string; // Mã bảng tính 
    
    @Prop()
    semester: number;

    @Prop()
    academic_year: string;

    @Prop()
    created_date: Date;
}

export const QuotaSchema = SchemaFactory.createForClass(Payrollsheet);
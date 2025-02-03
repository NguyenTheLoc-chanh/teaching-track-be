import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export type PayRollSheetDocument = HydratedDocument<Payrollsheet>;

export class Payrollsheet {
    @Prop({ default: () => uuidv4() })
    payroll_sheet_id: string; // Mã bảng tính 
    
    @Prop({ required: true })
    semester: number;

    @Prop({ required: true })
    academic_year: string;

    @Prop({ required: true })
    created_date: Date;
}

export const PayrollsheetSchema = SchemaFactory.createForClass(Payrollsheet);
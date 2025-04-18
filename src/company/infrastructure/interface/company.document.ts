import { Document } from 'mongoose';

export interface CompanyDocument extends Document {
  cuit: string;
  businessName: string;
  registrationDate: Date;
}
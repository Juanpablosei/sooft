import { Schema } from 'mongoose';

export const CompanySchema = new Schema({
  cuit: {
    type: String,
    required: true,
    unique: true, 
    
  },
  businessName: {
    type: String,
    required: true, 
  },
  registrationDate: {
    type: Date,
    default: Date.now, 
  },
});

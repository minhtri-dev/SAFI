import { Schema, model, Document } from 'mongoose';
import { IService } from './HealthServiceModel';

interface IHealthClinic extends Document {
  name: string;
  scrapedAt: Date;
  address: string;
  phone: string;
  email: string;
  services: IService[];
}

const HealthClinicSchema = new Schema<IHealthClinic>({
  name: { type: String, required: true },
  scrapedAt: { type: Date },
  address: { type: String },
  phone: { type: String },
  email: { type: String },
  services: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Service'
    }
  ]
});

const HealthClinicModel = model<IHealthClinic>('HealthClinic', HealthClinicSchema);

export default HealthClinicModel;
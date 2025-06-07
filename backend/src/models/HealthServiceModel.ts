import { Schema, model, Document } from 'mongoose';

export interface IService extends Document {
  type: string;
  description?: string;
}

const ServiceSchema = new Schema<IService>({
  type: { type: String, required: true },
  description: { type: String }
});

const ServiceModel = model<IService>('Service', ServiceSchema);

export default ServiceModel;
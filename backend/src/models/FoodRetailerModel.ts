import { Schema, model, Document } from 'mongoose';

interface IFoodRetailer extends Document {
  name: string;
  scrapedAt: Date;
  campus: string;
  location: number;
  description: string;
  openingHours: string;
  contact: string;
}

const FoodRetailerSchema = new Schema<IFoodRetailer>({
  name: { type: String, required: true },
  scrapedAt: { type: Date },
  campus: { type: String },
  location: { type: Number },
  description: { type: String },
  openingHours: { type: String },
  contact: { type: String }
});

const FoodRetailerModel = model<IFoodRetailer>('FoodRetailer', FoodRetailerSchema);

export default FoodRetailerModel;
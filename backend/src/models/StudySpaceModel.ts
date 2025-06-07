import { Schema, model, Document } from 'mongoose';

interface IStudySpace extends Document {
  name: string;
  scrapedAt: Date;
  campus: string;
  type: string;
  location: string;
  capacity: number;
  openingHours: string;
}

const StudySpaceSchema = new Schema<IStudySpace>({
  name: { type: String, required: true },
  scrapedAt: { type: Date },
  campus: { type: String },
  type: { type: String },
  location: { type: String },
  capacity: { type: Number },
  openingHours: { type: String }
});

const StudySpaceModel = model<IStudySpace>('StudySpace', StudySpaceSchema);

export default StudySpaceModel;
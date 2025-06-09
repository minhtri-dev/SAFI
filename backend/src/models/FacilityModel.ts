import { Schema, model, Document } from 'mongoose';

interface IFacility extends Document {
  name: string;
  campus?: string;
  keywords?: [string];
}

// Facility Schemas and Models
const options = { discriminatorKey: 'type' };

const BaseFacilitySchema = new Schema(
  {
    name: { type: String, required: true },
    campus: { type: String },
    keywords: { type: String },
  },
  options
);

const Facility = model<IFacility>('Facility', BaseFacilitySchema);

const StudySpaceFacility = Facility.discriminator(
  'StudySpace',
  new Schema({
    capacity: { type: Number },
    services: [{ type: String }],
    scrapedAt: { type: Date },
    campus: { type: String },
    openingHours: { type: String },
  })
);

const HealthClinicFacility = Facility.discriminator(
  'HealthClinic',
  new Schema({
    services: [
      {
        name: { type: String },
        description: { type: String} 
      },
    ],
    scrapedAt: { type: Date },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
  })
);

const FoodRetailerFacility = Facility.discriminator(
  'FoodRetailer',
  new Schema({
    scrapedAt: { type: Date },
    campus: { type: String },
    retailLocation: { type: String },
    description: { type: String },
    openingHours: { type: String },
    contact: { type: [String] },
  })
);


export { BaseFacilitySchema, StudySpaceFacility, HealthClinicFacility, FoodRetailerFacility };

export default Facility;
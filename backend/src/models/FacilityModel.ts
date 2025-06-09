import { Schema, model, Document } from 'mongoose';

interface IFacility extends Document {
  // name: string;
  campus?: string;
  keywords?: string[];
  scrapedAt?: Date;
}

interface IStudySpace extends IFacility {
  capacity?: number;
  services?: string[];
  openingHours?: string;
}

interface IHealthClinic extends IFacility {
  services?: { name: string; description: string }[];
  address?: string;
  phone?: string;
  email?: string;
}

interface IFoodRetailer extends IFacility {
  retailLocation?: string;
  description?: string;
  openingHours?: string;
  contact?: string[];
}

// Facility Schemas and Models
const options = { discriminatorKey: 'type', _id: false  };

const BaseFacilitySchema = new Schema(
  {
    // name: { type: String, required: true},
    campus: { type: String, description: "Name of campus", example: "City Campus" },
    keywords: { type: [String], description: "Keywords 1 to 3 words", example: [ 'Japanese', 'Cafe', 'Matcha' ]},
    scrapedAt: { type: String }
  },
  options
);

const Facility = model<IFacility>('Facility', BaseFacilitySchema);

const StudySpaceFacility = Facility.discriminator<IStudySpace>(
  'StudySpace',
  new Schema({
    capacity: { type: Number },
    services: [{ type: String }],
    openingHours: { type: String },
  })
);

const HealthClinicFacility = Facility.discriminator<IHealthClinic>(
  'HealthClinic',
  new Schema({
    services: [
      {
        name: { type: String },
        description: { type: String }
      },
    ],
    address: { type: String },
    phone: { type: String },
    email: { type: String },
  })
);

const FoodRetailerFacility = Facility.discriminator<IFoodRetailer>(
  'FoodRetailer',
  new Schema({
    retailName: { type: String, required: true, description: 'Name of the food retailer', example: 'Tokyo Yokocho x Taiyo Sun' },
    retailLocation: { type: String, required: true, description: 'Location of food retailer', example: 'Building 80, and Building 14 Level 4 Room 141'  },
    description: { type: String, required: true, description: 'Short 10-20 word description', example: "Located in the heart of Melbourne's CBD The Oxford Scholar provides award winning parmas, private dining options, professional events, or an enjoyable night out."  },
    openingHours: { type: String, required: true, description: 'Hours of operation', example: "Monday to Friday, 11am to 3pm" },
    contact: { type: [String], required: false, description: 'Methods of contact, only input valid emails and phone numbers', example: ["example@gmail.com", "0412 345 678"]  },
  })
);

export { BaseFacilitySchema, StudySpaceFacility, HealthClinicFacility, FoodRetailerFacility };

export default Facility;
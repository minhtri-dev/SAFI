import { Schema, model, Document } from 'mongoose';

interface IFacility extends Document {
  campus?: string;
  keywords?: string[];
  scrapedAt?: Date;
}

interface IStudySpace extends IFacility {
  capacity?: number;
  services?: string[];
  openingHours?: string;
}

interface IFoodRetailer extends IFacility {
  retailLocation?: string;
  description?: string;
  openingHours?: string;
  contact?: string[];
}

// Facility Schemas and Models
const options = { discriminatorKey: 'type', _id: false };

const BaseFacilitySchema = new Schema(
  {
    campus: { type: String, description: "Name of campus", example: "City Campus" },
    keywords: { type: [String], description: "Keywords up to 10 words", example: ["Japanese", "Cafe", "Matcha"] },
    scrapedAt: { type: Date }
  },
  options
);

const Facility = model<IFacility>('Facility', BaseFacilitySchema);

const StudySpaceFacility = Facility.discriminator<IStudySpace>(
  'StudySpace',
  new Schema({
    location: { type: String, required: true, description: 'Location of study. Each JSON object should represent a different study space', example: 'Building 80, and Building 14 Level 4 Room 141' },
    capacity: { type: Schema.Types.Mixed, description: "Capacity of the study space", example: "Approximately 950"},
    services: { type: [String], description: "Services available", example: ["Wifi", "Study rooms", "Computer rooms"] },
    openingHours: { type: String, description: "Opening hours", example: "Monday to Friday, 11am to 3pm" },
    studyRoomType: { type: String, description: "Type of study room. Input can only be 'Independent study spaces', 'Group meeting and study spaces' or 'Recreational spaces'", example: "Independent study spaces" },
    numberOfRooms: { type: String, description: "Number of rooms. Can only be inputed for the studyRoomType 'Group meeting and study spaces' otherwise no entry", example: "4 Each room includes a desk, table and 3 seats."},
  })
);

const FoodRetailerFacility = Facility.discriminator<IFoodRetailer>(
  'FoodRetailer',
  new Schema({
    retailName: { type: String, required: true, description: 'Name of the food retailer. Each JSON object should represent a different food retailer', example: 'Tokyo Yokocho x Taiyo Sun' },
    location: { type: String, required: true, description: 'Location of food retailer', example: 'Building 80, and Building 14 Level 4 Room 141' },
    description: { type: String, required: true, description: 'Short 10-20 word description', example: "Located in the heart of Melbourne's CBD The Oxford Scholar provides award winning parmas, private dining options, professional events, or an enjoyable night out." },
    openingHours: { type: String, required: true, description: 'Hours of operation', example: "Monday to Friday, 11am to 3pm" },
    contact: { type: [String], required: false, description: 'Methods of contact, only input valid emails and phone numbers', example: ["example@gmail.com", "0412 345 678"] }
  })
);

export { Facility, StudySpaceFacility, FoodRetailerFacility };

export default Facility;
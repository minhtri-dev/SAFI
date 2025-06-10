import { Schema } from 'mongoose';

import { StudySpaceFacility, FoodRetailerFacility } from '../models/FacilityModel'
import SchemaDetails from '../models/SchemaDetailsModel'

// Function to extract schema details
function extractSchemaDetails(schema: Schema): Record<string, any> {
  const schemaDetails: Record<string, any> = {};
  schema.eachPath((key, pathType) => {
    schemaDetails[key] = {
      type: pathType.instance,
      required: pathType.options.required || false,
      description: pathType.options.description || '',
      example: pathType.options.example || '',
    };
  });
  return schemaDetails;
}

// Export schemas as strings
export function exportSchemas(): string {
  const schemas = {
    StudySpaceFacility: extractSchemaDetails(StudySpaceFacility.schema),
    // HealthClinicFacility: extractSchemaDetails(HealthClinicFacility.schema),
    FoodRetailerFacility: extractSchemaDetails(FoodRetailerFacility.schema),
  };

  return JSON.stringify(schemas, null, 2);
}

// Function to insert schemas into the collection
export async function insertSchemasIntoCollection(): Promise<void> {
  const schemas = exportSchemas();
  const schemaObjects = JSON.parse(schemas);

  const inserts = Object.entries(schemaObjects).map(([name, schemaDetails]) => ({
    name,
    schemaDetails,
  }));

  await SchemaDetails.insertMany(inserts);

  console.log('Schemas inserted into MongoDB successfully!');
}

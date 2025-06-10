import { z } from 'zod'
import { StructuredOutputParser } from '@langchain/core/output_parsers'

const FacilitySchema = z.object({
  name: z
    .string()
    .nonempty('Facility name is required')
    .describe('Name of the facility.'),
  campus: z.string().optional().describe('Name of campus'),
  key_words: z
    .array(z.string())
    .optional()
    .describe(
      'Relevant keywords associated with the facility for search optimisation.',
    )
    .nullable(),
  location: z
    .string()
    .nonempty('Location is required')
    .describe('Location of facility'),
  description: z
    .string()
    .nonempty('Description is required')
    .describe('Short 10 word description'),
  contact_details: z
    .object({
      email: z.string().email().optional().nullable(),
      phone_number: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
  additional_info: z
    .record(z.any())
    .optional()
    .describe(
      'Contains various key-value pairs for extra details, such as booking policies, opening hours and additional notes.',
    ),
})

export const FoodRetailerSchema = FacilitySchema.extend({
  urls: z
    .array(
      z
        .string()
        .url()
        .describe('An array of URLs associated with this food retailer'),
    )
    .optional()
    .nullable(),
})

export const StudySpaceSchema = FacilitySchema.extend({
  study_room_type: z
    .string()
    .nonempty()
    .describe(
      "Type of study room. Input can only be 'Independent study spaces', 'Group meeting and study spaces' or 'Recreational spaces'",
    ),
  capacity: z
    .record(z.any())
    .optional()
    .describe('Store the approximate number or the number of desk space')
    .nullable(),
  number_of_rooms: z
    .record(z.any())
    .optional()
    .describe(
      'Store the number of rooms or capacity. This field is only applicable to the Group study spaces',
    )
    .nullable(),
  amenities: z
    .array(z.string())
    .optional()
    .describe(
      "List of services available at the study space, e.g., ['WiFi', 'Power outlets', 'Whiteboards']",
    )
    .nullable(),
})

export type FoodRetailerType = z.infer<typeof FoodRetailerSchema>
export type StudySpaceType = z.infer<typeof StudySpaceSchema>

export const getParser = (type: string) => {
  switch (type) {
    case 'FoodRetailer':
      return StructuredOutputParser.fromZodSchema(z.array(FoodRetailerSchema))
    case 'StudySpace':
      return StructuredOutputParser.fromZodSchema(z.array(StudySpaceSchema))
    default:
      throw new Error('Invalid type provided')
  }
}

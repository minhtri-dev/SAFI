import mongoose, { Schema } from 'mongoose';

interface ISchemaDocument extends mongoose.Document {
  name: string;
  schemaDetails: any;
}

const SchemaDetailsSchema = new Schema({
  name: { type: String, required: true },
  schemaDetails: { type: Schema.Types.Mixed, required: true },
});

const SchemaDetails = mongoose.model<ISchemaDocument>('SchemaDetails', SchemaDetailsSchema);

export default SchemaDetails
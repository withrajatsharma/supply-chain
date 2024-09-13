import { Schema, model, models } from 'mongoose';


const parcelSchema = new Schema({

    name: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      location: {
        type: String,
        required: true
      },
      service: {
        type: String,
        required: true
      },
      numCheckpoints: {
        type: Number,
        required: true
      },
      locations: {
        type: [String], // Array of strings
        required: true
      }



});

// module.exports = mongoose.model("PARCEL",parcelSchema);


const PARCEL = models.User || model("PARCEL", parcelSchema);

export default PARCEL;
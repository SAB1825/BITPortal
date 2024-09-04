import mongoose from "mongoose";

const InmateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  relation: { type: String, required: true },
  phoneNumber: { type: String, required: true }
});

const Inmates = mongoose.model("Inmates", InmateSchema);
export default Inmates;
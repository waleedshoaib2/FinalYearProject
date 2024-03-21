import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
  email: { type: String },
});

const Subscriber = mongoose.model("subscribers", subscriberSchema);

export default Subscriber;

import mongoose from "mongoose";

const SignupSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const SignupModel = mongoose.model("Signup", SignupSchema);
export default SignupModel;
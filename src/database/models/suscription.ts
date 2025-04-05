import mongoose from 'mongoose';
const { Schema } = mongoose;

const suscriptionSchema = new Schema({
    email: {
        type: String,
        required: true
    }
})


export const Suscription = mongoose.models.Suscription || mongoose.model('Suscription', suscriptionSchema);
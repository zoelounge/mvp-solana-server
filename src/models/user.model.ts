import mongoose, { Schema, model, connect } from "mongoose";
import { Model } from 'mongoose'

export interface UserInterface extends mongoose.Document {
    email: string;
    name: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}



const userSchema = new Schema<UserInterface>(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);


// 3. Create a Model.
const UserModel = model<UserInterface>('User', userSchema);

run().catch(err => console.log(err));

async function run() {
    // 4. Connect to MongoDB
    await connect('mongodb://127.0.0.1:27017/test');

    const user = new UserModel({
        name: 'Bill',
        email: 'bill@initech.com',
        avatar: 'https://i.imgur.com/dM7Thhn.png'
    });
    await user.save();

    console.log(user.email); // 'bill@initech.com'
}



export default UserModel;
import mongoose from "mongoose";

let url = "mongodb+srv://kolleparasrikanth:Srikanth5359$@ecomdb.ndaljpt.mongodb.net/chatterupdb"
export const connect = async () => {
    await mongoose.connect(url)
    console.log("DB is connected");
}
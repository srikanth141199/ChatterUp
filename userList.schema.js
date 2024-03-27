import mongoose, { mongo } from "mongoose";

const userListSchema = new mongoose.Schema({
    username : String
})

export const userListModel = mongoose.model("userList", userListSchema)
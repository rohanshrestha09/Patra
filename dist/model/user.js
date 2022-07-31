"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const moment = require("moment");
const UserSchema = new mongoose_1.default.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
    },
    imgUrl: {
        type: String,
        default: "",
    },
    creation: {
        type: String,
        default: moment().format("MMMM Do YYYY, h:mm:ss a"),
    },
}, {
    timestamps: true,
});
module.exports = mongoose_1.default.model("User", UserSchema);

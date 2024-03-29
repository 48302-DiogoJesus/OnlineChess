"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const userAuthentication = new Schema({
    _id: { type: String, required: true },
    password: { type: String, required: true },
    token: { type: String, required: true }
}, { collection: 'UsersAuthentication' });
exports.default = mongoose_1.default.model("UserAuthenticationSchema", userAuthentication);

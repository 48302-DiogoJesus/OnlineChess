"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const userPublic = new Schema({
    _id: { type: String, required: true },
    rank: { type: String, required: true },
}, { collection: 'UsersPublic' });
exports.default = mongoose_1.default.model("UserPublicSchema", userPublic);

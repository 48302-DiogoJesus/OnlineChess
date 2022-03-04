"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const Game = new Schema({
    _id: { type: String, required: true },
    player_white: { type: String, required: true },
    player_black: { type: String, required: true },
    board: { type: String, required: true },
    winner: { type: String, required: true },
    turn: { type: String, required: true }
}, { collection: 'Games' });
exports.default = mongoose_1.default.model("GameSchema", Game);

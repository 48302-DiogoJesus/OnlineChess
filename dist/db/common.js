"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeInDB = exports.connectionURL = void 0;
const config_1 = __importDefault(require("../config/config"));
const mongoose_1 = __importDefault(require("mongoose"));
exports.connectionURL = config_1.default.MONGO_DB.REMOTE ?
    `mongodb+srv://${config_1.default.MONGO_DB.USERNAME}:${config_1.default.MONGO_DB.PASSWORD}@mycluster.h5qxe.mongodb.net/${config_1.default.MONGO_DB.DB_NAME}?retryWrites=true&w=majority`
    :
        `mongodb://127.0.0.1:27017/${config_1.default.MONGO_DB.DB_NAME}`;
function executeInDB(block) {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect(exports.connectionURL);
        let result;
        try {
            result = yield block();
        }
        catch (err) {
            // Evaluate Mongo Error -> Convert to "our" error format -> throw it formatted 
            throw err;
        }
        yield mongoose_1.default.connection.close();
        return result;
    });
}
exports.executeInDB = executeInDB;

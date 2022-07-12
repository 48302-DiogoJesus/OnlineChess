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
exports.executeInDB = exports.clearDatabase = exports.connectMongoDB = void 0;
const config_1 = __importDefault(require("../config"));
const mongoose_1 = __importDefault(require("mongoose"));
function connectMongoDB() {
    var db_name = config_1.default.TEST_ENV
        ? config_1.default.MONGO_DB.TEST_DB_NAME
        : config_1.default.MONGO_DB.DB_NAME;
    const connectionURL = config_1.default.MONGO_DB.REMOTE ?
        `mongodb+srv://${config_1.default.MONGO_DB.USERNAME}:${config_1.default.MONGO_DB.PASSWORD}@cluster0.fspkz.mongodb.net/${db_name}?retryWrites=true&w=majority`
        :
            `mongodb://127.0.0.1:27017/${db_name}`;
    console.log("[DEBUG] DB Connection URI:", connectionURL);
    return mongoose_1.default.connect(connectionURL);
}
exports.connectMongoDB = connectMongoDB;
const game_1 = __importDefault(require("./schemas/game"));
const userToken_1 = __importDefault(require("./schemas/userToken"));
const userPublic_1 = __importDefault(require("./schemas/userPublic"));
const userAuthentication_1 = __importDefault(require("./schemas/userAuthentication"));
// ! DANGEROUS
function clearDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        yield game_1.default.deleteMany({});
        yield userToken_1.default.deleteMany({});
        yield userPublic_1.default.deleteMany({});
        yield userAuthentication_1.default.deleteMany({});
    });
}
exports.clearDatabase = clearDatabase;
function executeInDB(block) {
    return __awaiter(this, void 0, void 0, function* () {
        let result;
        try {
            result = yield block();
        }
        catch (err) {
            // Evaluate Mongo Error -> Convert to "our" error format -> throw it formatted 
            throw err;
        }
        return result;
    });
}
exports.executeInDB = executeInDB;

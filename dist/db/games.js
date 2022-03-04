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
exports.gameExists = exports.updateGame = exports.createGame = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const game_1 = __importDefault(require("./schemas/game"));
const config_1 = __importDefault(require("../config/config"));
const connectionURL = config_1.default.MONGO_DB.REMOTE ?
    `mongodb+srv://${config_1.default.MONGO_DB.USERNAME}:${config_1.default.MONGO_DB.PASSWORD}@mycluster.h5qxe.mongodb.net/${config_1.default.MONGO_DB.DB_NAME}?retryWrites=true&w=majority`
    :
        `mongodb://127.0.0.1:27017/${config_1.default.MONGO_DB.DB_NAME}`;
function executeInDB(block) {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect(connectionURL);
        let result;
        try {
            result = yield block();
        }
        catch (err) {
            // Evaluate Mongo Error -> Convert to "our" error format -> throw it formatted 
            result = false;
        }
        yield mongoose_1.default.connection.close();
        return result;
    });
}
/* ---------------------- MAIN FUNCTIONS ---------------------- */
// | createGame | updateGame | gameExists | 
function createGame(gameObject) {
    return __awaiter(this, void 0, void 0, function* () {
        return executeInDB(() => __awaiter(this, void 0, void 0, function* () {
            if (yield gameExists(gameObject._id, true)) {
                return false;
            }
            yield (new game_1.default(gameObject)).save();
            return true;
        }));
    });
}
exports.createGame = createGame;
function updateGame(gameObject) {
    return __awaiter(this, void 0, void 0, function* () {
        return executeInDB(() => __awaiter(this, void 0, void 0, function* () {
            if (!(yield gameExists(gameObject._id, true)))
                return false;
            yield game_1.default.findOneAndUpdate({ _id: gameObject._id }, gameObject);
            return true;
        }));
    });
}
exports.updateGame = updateGame;
function gameExists(game_id, already_connected = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const block = () => __awaiter(this, void 0, void 0, function* () { return (yield game_1.default.findById(game_id)) !== null; });
        if (already_connected)
            return yield block();
        return executeInDB(() => __awaiter(this, void 0, void 0, function* () {
            return yield block();
        }));
    });
}
exports.gameExists = gameExists;
// ! TEST FUNCTION FOR THIS MODULE ! \\
/*
const testCGame = {
    _id: 'Test Game',
    board: ' ',
    turn: PieceColor.BLACK,
    winner: PieceColor.WHITE
}
const testUGame = {
    _id: 'Test Game',
    board: ' ',
    turn: PieceColor.BLACK,
    winner: PieceColor.WHITE
}
async function test() {
    console.log(await createGame(testCGame))
    //console.log(await updateGame(testUGame))
}
test()
*/ 

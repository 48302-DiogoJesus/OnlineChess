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
exports.createUser = exports.userExists = void 0;
const common_1 = require("./common");
const userToken_1 = __importDefault(require("./schemas/userToken"));
const userPublic_1 = __importDefault(require("./schemas/userPublic"));
const userAuthentication_1 = __importDefault(require("./schemas/userAuthentication"));
const errors_1 = __importDefault(require("../errors/errors"));
const crypto_1 = require("crypto");
const md5_1 = __importDefault(require("md5"));
function validateUserName(username) {
    if (!(username.length >= 4 && username.length <= 20)) {
        throw errors_1.default.INVALID_USERNAME_LENGTH;
    }
    if (!/[a-zA-Z0-9]*/.test(username)) {
        throw errors_1.default.INVALID_USERNAME_CHARACTERS;
    }
}
function validatePassword(password) {
    if (!(password.length >= 4 && password.length <= 20)) {
        throw errors_1.default.INVALID_PASSWORD_LENGTH;
    }
    if (!/[a-zA-Z0-9_-]*/.test(password)) {
        throw errors_1.default.INVALID_PASSWORD_CHARACTERS;
    }
    if (!/[A-Z]+/.test(password)) {
        throw errors_1.default.INVALID_PASSWORD_UPPERCASE;
    }
}
/* ---------------------- MAIN FUNCTIONS ---------------------- */
// | userExists | getUser | createUser | deleteUser | updateUserPassword | updateUserPublic | validateCredentials | 
function userExists(username, already_connected = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const block = () => __awaiter(this, void 0, void 0, function* () { return yield userAuthentication_1.default.findOne({ _id: username }); });
        if (already_connected) {
            if ((yield block()) !== null)
                return true;
            return false;
        }
        return (0, common_1.executeInDB)(() => __awaiter(this, void 0, void 0, function* () {
            if ((yield block()) !== null)
                return true;
            return false;
        }));
    });
}
exports.userExists = userExists;
function createUser(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        // Throws if not valid
        validateUserName(username);
        validatePassword(password);
        return (0, common_1.executeInDB)(() => __awaiter(this, void 0, void 0, function* () {
            if (yield userExists(username, true)) {
                throw errors_1.default.USER_ALREADY_EXISTS;
            }
            const token = (0, crypto_1.randomUUID)();
            const hashedPassword = (0, md5_1.default)(password);
            yield Promise.all([
                (new userAuthentication_1.default({
                    _id: username,
                    password: hashedPassword,
                    token: token
                })).save(),
                (new userPublic_1.default({
                    _id: username,
                    rank: 0,
                })).save(),
                (new userToken_1.default({
                    _id: token,
                    username: username,
                })).save()
            ]);
            console.log("CREATING USER");
            return token;
        }));
    });
}
exports.createUser = createUser;
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(yield createUser("J3ZERA", "Mypass"));
        }
        catch (err) {
            console.log(err);
        }
    });
}
test();

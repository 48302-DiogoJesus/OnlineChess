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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.validateCredentials = exports.updateUserPublic = exports.updateUserPassword = exports.tokenToUsername = exports.getUserPublic = exports.deleteUser = exports.createUser = exports.userExists = exports.validatePassword = exports.validateUserName = void 0;
const common_1 = require("./common");
const userToken_1 = __importDefault(require("./schemas/userToken"));
const userPublic_1 = __importDefault(require("./schemas/userPublic"));
const userAuthentication_1 = __importDefault(require("./schemas/userAuthentication"));
const errors_1 = __importDefault(require("../errors/errors"));
const crypto_1 = require("crypto");
const md5_1 = __importDefault(require("md5"));
function validateUserName(username) {
    if (!(username.length >= 5 && username.length <= 20)) {
        throw errors_1.default.INVALID_USERNAME_LENGTH;
    }
    /*
    if (!(/^[a-zA-Z0-9]+$/.test(username))) {
        throw ERRORS.INVALID_USERNAME_CHARACTERS
    }
    */
}
exports.validateUserName = validateUserName;
function validatePassword(password) {
    if (!(password.length >= 5 && password.length <= 20)) {
        throw errors_1.default.INVALID_PASSWORD_LENGTH;
    }
    /*
    if (!/[a-zA-Z0-9_-]* /.test(password)) {
        throw ERRORS.INVALID_PASSWORD_CHARACTERS
    }
    if (!/[A-Z]+/.test(password)) {
        throw ERRORS.INVALID_PASSWORD_UPPERCASE
    }
    */
}
exports.validatePassword = validatePassword;
/* ---------------------- MAIN FUNCTIONS ---------------------- */
// | userExists | createUser | deleteUser | getUserPublic | tokenToUsername |
// | updateUserPassword | updateUserPublic | validateCredentials | 
const bundled = {
    validateUserName, validatePassword, userExists, createUser, deleteUser, getUserPublic,
    getUsers, tokenToUsername, updateUserPassword, updateUserPublic, validateCredentials
};
exports.default = bundled;
function userExists(username) {
    return (0, common_1.executeInDB)(() => __awaiter(this, void 0, void 0, function* () {
        if ((yield userAuthentication_1.default.findOne({ _id: username })) !== null)
            return true;
        return false;
    }));
}
exports.userExists = userExists;
function createUser(username, password) {
    return (0, common_1.executeInDB)(() => __awaiter(this, void 0, void 0, function* () {
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
        return token;
    }));
}
exports.createUser = createUser;
function deleteUser(username) {
    return (0, common_1.executeInDB)(() => __awaiter(this, void 0, void 0, function* () {
        yield Promise.all([
            userAuthentication_1.default.deleteOne({ _id: username }),
            userPublic_1.default.deleteOne({ _id: username }),
            userToken_1.default.deleteOne({ username: username })
        ]);
        return;
    }));
}
exports.deleteUser = deleteUser;
function getUserPublic(username) {
    return (0, common_1.executeInDB)(() => __awaiter(this, void 0, void 0, function* () {
        const publicUserDoc = yield userPublic_1.default.findById(username);
        return publicUserDoc;
    }));
}
exports.getUserPublic = getUserPublic;
/*
export async function getUserAuthenticationInfo(username: string): Promise<UserAuthenticationObject> {
    return executeInDB(async () => {
        const userAuthDoc = await UserAuthenticationSchema.findOne({ _id: username })
        return (userAuthDoc as UserAuthenticationObject)
    })
}
*/
function tokenToUsername(token) {
    return (0, common_1.executeInDB)(() => __awaiter(this, void 0, void 0, function* () {
        const userTokenDoc = yield userToken_1.default.findById(token);
        if (userTokenDoc === null)
            throw errors_1.default.INVALID_TOKEN;
        return userTokenDoc.username;
    }));
}
exports.tokenToUsername = tokenToUsername;
function updateUserPassword(username, new_password) {
    return (0, common_1.executeInDB)(() => __awaiter(this, void 0, void 0, function* () {
        yield userAuthentication_1.default.findOneAndUpdate({
            _id: username
        }, {
            password: (0, md5_1.default)(new_password)
        });
        return;
    }));
}
exports.updateUserPassword = updateUserPassword;
function updateUserPublic(username, userData) {
    return (0, common_1.executeInDB)(() => __awaiter(this, void 0, void 0, function* () {
        // Filter _id from the object 
        const { _id } = userData, updatedUserData = __rest(userData, ["_id"]);
        yield userPublic_1.default.findOneAndUpdate({ _id: username }, Object.assign({}, updatedUserData));
    }));
}
exports.updateUserPublic = updateUserPublic;
function validateCredentials(username, password) {
    return (0, common_1.executeInDB)(() => __awaiter(this, void 0, void 0, function* () {
        const userCredentials = (yield userAuthentication_1.default.findById(username));
        if (userCredentials.password !== (0, md5_1.default)(password))
            throw errors_1.default.WRONG_PASSWORD;
        return true;
    }));
}
exports.validateCredentials = validateCredentials;
function getUsers() {
    return (0, common_1.executeInDB)(() => __awaiter(this, void 0, void 0, function* () {
        const users = yield userPublic_1.default.find();
        return users === null ? [] : users;
    }));
}
exports.getUsers = getUsers;
function t() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(yield getUsers());
    });
}
t();

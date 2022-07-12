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
exports.hasFriend = exports.removeFriend = exports.addFriend = exports.getFriends = void 0;
const userPublic_1 = __importDefault(require("./schemas/userPublic"));
const common_1 = require("./common");
const bundled = {
    getFriends, addFriend, removeFriend, hasFriend
};
exports.default = bundled;
function getFriends(username) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, common_1.executeInDB)(() => __awaiter(this, void 0, void 0, function* () {
            const userDoc = (yield userPublic_1.default.findById(username));
            return userDoc.friends;
        }));
    });
}
exports.getFriends = getFriends;
function addFriend(username, friend_name) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, common_1.executeInDB)(() => __awaiter(this, void 0, void 0, function* () {
            const userFriends = (yield userPublic_1.default.findById(username)).friends;
            userFriends.push(friend_name);
            yield userPublic_1.default.findOneAndUpdate({ _id: username }, { friends: userFriends });
            return;
        }));
    });
}
exports.addFriend = addFriend;
function removeFriend(username, friend_name) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, common_1.executeInDB)(() => __awaiter(this, void 0, void 0, function* () {
            const userFriends = (yield userPublic_1.default.findById(username)).friends;
            userFriends.splice(userFriends.indexOf(friend_name));
            yield userPublic_1.default.findOneAndUpdate({ _id: username }, { friends: userFriends });
            return;
        }));
    });
}
exports.removeFriend = removeFriend;
function hasFriend(username, friend_name) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, common_1.executeInDB)(() => __awaiter(this, void 0, void 0, function* () {
            const userFriends = (yield userPublic_1.default.findById(username)).friends;
            return userFriends.includes(friend_name);
        }));
    });
}
exports.hasFriend = hasFriend;

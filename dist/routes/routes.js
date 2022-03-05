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
exports.executeSafe = void 0;
const express_1 = __importDefault(require("express"));
const games_1 = __importDefault(require("./games/games"));
const app = (0, express_1.default)();
function executeSafe(res, block) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield block();
        }
        catch (err) {
            if (err.http_code === undefined) {
                res.status(500).json({ error: err });
            }
            else {
                res.status(err.http_code).json({ error: err });
            }
            return;
        }
    });
}
exports.executeSafe = executeSafe;
app.use(games_1.default);
exports.default = app;

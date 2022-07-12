"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
    Runs the app on the defined server port
*/
const config_1 = __importDefault(require("./config"));
const common_1 = require("./db/common");
const routes_1 = __importDefault(require("./routes/routes"));
if (!config_1.default.TEST_ENV) {
    (0, common_1.connectMongoDB)();
}
routes_1.default.listen(config_1.default.SERVER_PORT, () => {
    console.log(`Backend listening on port ${config_1.default.SERVER_PORT}`);
});

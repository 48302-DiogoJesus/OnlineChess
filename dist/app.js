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
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes/routes"));
const path_1 = __importDefault(require("path"));
if (!config_1.default.TEST_ENV) {
    (0, common_1.connectMongoDB)();
}
const siteFilesPath = path_1.default.join(__dirname, '../react-ui/build');
routes_1.default.use('/', express_1.default.static(siteFilesPath));
routes_1.default.get('/*', (req, res) => {
    res.sendFile(path_1.default.join(siteFilesPath, 'index.html'));
});
routes_1.default.listen(config_1.default.SERVER_PORT, () => {
    console.log(`Backend listening on port ${config_1.default.SERVER_PORT}`);
});

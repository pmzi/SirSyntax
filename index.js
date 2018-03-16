const config = require("./Config/Config");

const Bot = require("./Core/Bot");

const bot = new Bot(config.general.API, config.general.ID);

// Let's initate

const BotController = require("./Core/BotController")(bot);

// Let's add admin section

const AdminController = require("./Core/AdminController")(bot);
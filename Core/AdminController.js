const config = require("../Config/Config");

const Bot = require("./Bot");

const bot = new Bot(config.general.API, config.general.ID);

//libraries

const fs = require("fs");

// Modeles

const Users = require("../Modeles/Users");

const Unies = require("../Modeles/Universities");

const Teachers = require("../Modeles/Teachers");

const Cats = require("../Modeles/Cats");

const Lessens = require("../Modeles/Lessens");

const Votes = require("../Modeles/Votes");

const Likes = require("../Modeles/Likes");

const Comments = require("../Modeles/Comments");

const Suggestions = require("../Modeles/Suggestions");

const Questions = require("../Modeles/Questions");
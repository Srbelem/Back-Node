const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
var fs = require('fs')

module.exports = {
  dest: path.resolve(__dirname, "..", "Documents", "temp"),
  storage:  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, "..", "Documents", "temp"));
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);
        file.key = `${hash.toString("hex")}`;

        cb(null, file.key);
      });
    }
  }),

};
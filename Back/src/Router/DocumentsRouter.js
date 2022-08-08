/////////////////
const route = require('express').Router()
const multer = require("multer");
const multerConfig = require("../Config/multer");
const  Documents = require('../Controller/DocumentsController')

routes.get("/getDocuments", async (req, res) => {
  const posts = await Post.find();

  return res.json(posts);
});

route.put('/sendDocuments', multer(multerConfig).single("file"),Documents.sendDocuments)
route.put('/getDocuments',Documents.getDocuments)
routes.delete("/Documents/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);

  await post.remove();

  return res.send();
});

module.exports = route;
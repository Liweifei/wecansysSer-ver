var express = require('express');
var router = express.Router();
var dbTool = require("../public/dbTool/dbTool");
var collectionName="users";
/* save user. */
router.post('/save', function(req, res, next) {
  	if (req.body.name && req.body.password) {
  		dbTool.insertOne(collectionName,req.body,function(result){
  			var msg=result?'添加成功！':'添加失败！';
  			res.send(msg);
  		})
  	}
});

/* get user list. */
router.get('/list', function(req, res, next) {
	dbTool.findAll(collectionName,function(result){
		console.log(result)
		res.send(result);
	})
  	
});

module.exports = router;

var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId ;
var dbTool = require("../public/dbTool/dbTool");
var collectionName="users";
/* save user. */
router.post('/save', function(req, res, next) {
  	if (req.body.name && req.body.password) {
        dbTool.findOne(collectionName,{"name":req.body.name},function(resons){
            if (!!resons) {
                res.send("账户已存在！");
            }else{
                dbTool.insertOne(collectionName,req.body,function(result){
                    var msg=result?'添加成功！':'添加失败！';
                    res.send(msg);
                })
            }
        })
  		
  	}
});

/* remove user. */
router.post('/delete', function(req, res, next) {
    if (req.body._id) {
        let whereStr={'_id':ObjectId(req.body._id)};
        dbTool.deleteOne(collectionName,whereStr,function(result){
            var msg=result?'删除成功！':'删除失败！';
            res.send(msg);
        })
    }
});

/* update psd. */
router.post('/updatePsd', function(req, res, next) {
    if (req.body._id && req.body.password) {
        let whereStr={'_id':ObjectId(req.body._id)};
        let updateStr={$set:{"password":req.body.password}}
        dbTool.updateOne(collectionName,whereStr,updateStr,function(result){
            var msg=result?'更改成功！':'更改失败！';
            res.send(msg);
        })
    }else{
      res.send("原账号数据不正确");
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

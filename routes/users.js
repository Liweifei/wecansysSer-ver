var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId ;
var dbTool = require("../public/dbTool/dbTool");
var jsonTool = require("../public/jsonTool/jsonTool");
var collectionName="users";
/* save user. */
router.post('/save', function(req, res, next) {
  	if (req.body.name && req.body.password) {
        dbTool.findOne(collectionName,{"name":req.body.name},function(resons){
            if (!!resons) {
                res.json(jsonTool.justCodeInt(false,"账号已存在！"))
            }else{
                dbTool.insertOne(collectionName,req.body,function(result){
                    var msg=result?'添加成功！':'添加失败！';
                    res.json(jsonTool.justCodeInt(result,msg))
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
            res.json(jsonTool.justCodeInt(result,msg))
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
            res.json(jsonTool.justCodeInt(result,msg))
        })
    }else{
      res.send("原账号数据不正确");
    }
});

/* get user list. */
router.get('/list', function(req, res, next) {
	dbTool.findAll(collectionName,function(result,info){
        if(result){
            res.json(jsonTool.toArr(info))
        }else{
            res.json(jsonTool.justCodeInt(result,info))
        }
	})
  	
});

module.exports = router;

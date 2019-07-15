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
                var data=req.body;
                data.createDate=new Date();
                dbTool.insertOne(collectionName,data,function(result){
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
        var whereStr={'_id':ObjectId(req.body._id)};
        dbTool.deleteOne(collectionName,whereStr,function(result){
            var msg=result?'删除成功！':'删除失败！';
            res.json(jsonTool.justCodeInt(result,msg))
        })
    }
});

/* update psd. */
router.post('/updatePsd', function(req, res, next) {
    if (req.body._id && req.body.password) {
        var whereStr={'_id':ObjectId(req.body._id)};
        var updateStr={$set:{"password":req.body.password}}
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

/* login api. */
router.post('/login', function(req, res, next) {
    console.log(req.body.name,req.body.psd)
    var msg=(req.body.name=="admin" && req.body.psd=="20140606")?'登录成功！':'账号或密码不对！';
    var type=(req.body.name=="admin" && req.body.psd=="20140606")?true:false;
    res.json(jsonTool.justCodeInt(type,msg))
});

module.exports = router;

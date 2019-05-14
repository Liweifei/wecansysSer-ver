var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId ;
var dbTool = require("../public/dbTool/dbTool");
var jsonTool = require("../public/jsonTool/jsonTool");
var collectionName="navMenu";
/* save nav. */
router.post('/save', function(req, res, next) {
  	if (req.body.type && req.body.name && req.body.url) {
        var data=req.body;
        data.createDate=new Date();
        dbTool.insertOne(collectionName,data,function(result){
            var msg=result?'添加成功！':'添加失败！';
            res.json(jsonTool.justCodeInt(result,msg))
        })
  	}
});

/* remove nav. */
router.post('/delete', function(req, res, xxx) {
    if (req.body._id) {
        var whereStr={'_id':ObjectId(req.body._id)};
        dbTool.deleteOne(collectionName,whereStr,function(result){
            var msg=result?'删除成功！':'删除失败！';
            res.json(jsonTool.justCodeInt(result,msg))
        })
    }
});

/* update nav. */
router.post('/update', function(req, res, next) {
    if (req.body._id && req.body.name) {
        var whereStr={'_id':ObjectId(req.body._id)};
        var updateStr={$set:{"name":req.body.name}}
        dbTool.updateOne(collectionName,whereStr,updateStr,function(result){
            var msg=result?'更改成功！':'更改失败！';
            res.json(jsonTool.justCodeInt(result,msg))
        })
    }else{
      res.send("原账号数据不正确");
    }
});

/* get nav list. */
router.get('/list', function(req, res, next) {
	dbTool.findAll(collectionName,function(result,info){
        if(result){
            var data=[]
            console.log(info)
            for(var i=0;i<info.length;i++){
                var exit=false;
                if(data.length<1){//如果处理的数据是0，那么第一条数据必定是push进去的
                    var obj={}
                    if(info[i].type=="group"){//如果是
                        obj={
                            type:"group",
                            group:info[i].group,
                            childrens:[info[i]]
                        }
                    }else{
                        obj={
                            type:"group",
                            data:[info[i]]
                        }
                    }
                    data.push(obj);
                    continue;
                }
                if(info[i].type=="group"){
                    var exist=false;//用来控制是否存在已处理过的组，有的话直接加进children 否则加到新组
                    for(var j=0;j<data.length;j++){
                        if(data[j].type=="group" && info[i].group==data[j].group){
                            exist=true;
                            data[j].childrens.push(info[i]);
                            break;
                        }
                    }
                    if(!exist){//
                        data.push({
                            type:"group",
                            group:info[i].group,
                            childrens:[info[i]]
                        })
                    }
                }else{
                    data.push({
                        type:"link",
                        data:info[i]
                    })
                }
                
            }
            res.json(jsonTool.toArr(data))
        }else{
            res.json(jsonTool.justCodeInt(result,info))
        }
	})
  	
});

module.exports = router;

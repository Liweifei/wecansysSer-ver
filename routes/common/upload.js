var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId;
var dbTool = require("../../public/dbTool/dbTool");
var jsonTool = require("../../public/jsonTool/jsonTool");
var fs = require('fs');
var path = require('path');
var multer = require('multer');
var collectionName = "upload";
var destination=path.resolve(__dirname, "/fileList/wecansysServer");//文件存放路径
/* save nav. */
var storage = multer.diskStorage({
    destination: destination,
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
})
var upload = multer({ storage: storage });

// 下面的file须和前端传过来的name相对应
//单文件长传用single 也就是一个input==file，（注意，multiple和此无关）
//多文件上传用array   upload.array('file', number) 这里的number也就是input=file 的个数==number，就比如说你传了五个file过来
router.post('/save', upload.single('file'), function (req, res, next) {
    if (req.file.filename) {
        var param = {
            url: "http://" + req.headers.host + "/fileList/" + req.file.filename,
            filename: req.file.filename,
            createDate: new Date(),
        }
        dbTool.insertMany(collectionName, [param], function (result, data) {
            var msg = result ? '添加成功！' : '添加失败！';
            res.json(jsonTool.justCodeInt(result, msg, data))
        })
    }
});

/* delete nav. */
router.post('/delete', function (req, res, xxx) {
    if (req.body._id && req.body.fileName) {
        var whereStr = { '_id': ObjectId(req.body._id) };
        dbTool.deleteOne(collectionName, whereStr, function (result) {
            fs.unlink(path.join(destination,"/"+req.body.fileName), function(err){
                // 仅是回调处理而已
                var msg = result ? '删除成功！' : '删除失败！';
                res.json(jsonTool.justCodeInt(result, msg))
            })
            
        })
    }else{
        res.json(jsonTool.justCodeInt(false, "_id或path不能为空"))
    }
});

/* update nav. */
router.post('/update', function (req, res, next) {
    if (req.body._id && req.body.name) {
        var whereStr = { '_id': ObjectId(req.body._id) };
        var updateStr = { $set: { "name": req.body.name, "url": req.body.url } }
        dbTool.updateOne(collectionName, whereStr, updateStr, function (result) {
            var msg = result ? '更改成功！' : '更改失败！';
            res.json(jsonTool.justCodeInt(result, msg))
        })
    } else {
        res.send("原账号数据不正确");
    }
});

/* drop nav. */
router.post('/drop', function (req, res, next) {
    if (req.body._id && req.body.pid) {
        var whereStr = { '_id': ObjectId(req.body._id) };
        var updateStr = { $set: { "pid": ObjectId(req.body.pid) } }
        dbTool.updateOne(collectionName, whereStr, updateStr, function (result) {
            var msg = result ? '更改成功！' : '更改失败！';
            res.json(jsonTool.justCodeInt(result, msg))
        })
    } else {
        res.send("原账号数据不正确");
    }
});

/* move nav. */
router.post('/move', function (req, res, next) {
    if (req.body._id && req.body.thisSort && req.body.targetId && req.body.targetSort) {
        var whereStr = { '_id': ObjectId(req.body._id) };
        var updateStr = { $set: { "sort": req.body.targetSort } }
        dbTool.updateOne(collectionName, whereStr, updateStr, function () {
            var whereStr2 = { '_id': ObjectId(req.body.targetId) };
            var updateStr2 = { $set: { "sort": req.body.thisSort } }
            dbTool.updateOne(collectionName, whereStr2, updateStr2, function (result) {
                var msg = result ? '更改成功！' : '更改失败！';
                res.json(jsonTool.justCodeInt(result, msg))
            })
        })
    } else {
        res.send("原账号数据不正确");
    }
});

/* get nav list. */
router.get('/list', function (req, res, next) {
    dbTool.findAll(collectionName, function (result, info) {
        if (result) {
            res.json(jsonTool.toArr(info))
        } else {
            res.json(jsonTool.justCodeInt(result, info))
        }
    })

});

module.exports = router;

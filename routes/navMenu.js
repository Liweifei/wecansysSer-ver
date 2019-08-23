var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId;
var dbTool = require("../public/dbTool/dbTool");
var jsonTool = require("../public/jsonTool/jsonTool");
var collectionName = "navMenu";
/* save nav. */
router.post('/save', function (req, res, next) {
    if (req.body.name && req.body.url) {
        var data = req.body;
        var param = {
            pid: req.body._id ? ObjectId(req.body._id) : null,
            name: data.name,
            url: data.url,
            createDate: new Date(),
            sort: new Date().getTime()
        }
        //如果有id传过来就是其子元素
        dbTool.insertMany(collectionName, [param], function (result, data) {
            var msg = result ? '添加成功！' : '添加失败！';
            res.json(jsonTool.justCodeInt(result, msg, data))
        })
    }
});

/* remove nav. */
router.post('/delete', function (req, res, xxx) {
    if (req.body._id) {
        var whereStr = { $or: [{ '_id': ObjectId(req.body._id) }, { 'pid': ObjectId(req.body._id) }] };
        dbTool.deleteOne(collectionName, whereStr, function (result) {
            var msg = result ? '删除成功！' : '删除失败！';
            res.json(jsonTool.justCodeInt(result, msg))
        })
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
    dbTool.findAndSort(collectionName, { sort: 1 }, function (result, info) {
        if (result) {
            var data = formatList(info);
            res.json(jsonTool.toArr(data))
        } else {
            res.json(jsonTool.justCodeInt(result, info))
        }
    })

});

function formatList(arr) {
    var data=[];
    getParent();
    getChild(data, arr);//匹配子元素
    function getParent () {//先把最顶层元素先找出来
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (!item.pid) {
                item.children = [];
                data.push(item);
                arr.splice(i, 1);//找出来顶层元素后原数据删去相应的，就剩下是子元素
                i--;
            }
        }
    }
    function getChild(datas, arrs) {
        for (var i = 0; i < datas.length; i++) {
            var pItem = datas[i];
            for (var j = 0; j < arrs.length; j++) {//循环对比子元素一遍
                var item = arrs[j];
                if (JSON.stringify(item.pid) == JSON.stringify(pItem._id)) {//如果是这层的子元素，则加进去
                    if (Array.isArray(pItem.children)) {
                        pItem.children.push(item);
                    } else {
                        pItem.children = [item];
                    }
                    arrs.splice(j, 1);//再删去已经加处理好的子元素，最后剩下别的子/子子元素
                    j--;
                }
            }
            if (arrs.length > 0) {//如果发现再对比一次也发现还剩下元素
                if (Array.isArray(pItem.children) && pItem.children.length > 0) {//如果有子元素，那就对比是否是子子元素，否则就循环外层的对比
                    getChild(pItem.children, arrs)
                }
            }
        }
    }
    console.log(data)
    return data;
}

module.exports = router;

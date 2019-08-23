var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/wecansys";
var thisDb = {};
var dbInstance = {
    connect: function () {
        MongoClient.connect(url, function (err, client) {
            if (err) throw err;
            console.log("数据库已创建!");
            thisDb = client.db("wecansys");
        })
    },
    insertOne: function (collectionName, param, cb) {//插入一条数据，插入后无具体的信息返回
        //连接到表
        var collection = thisDb.collection(collectionName);
        //插入数据
        collection.insertOne(param, {}, function (err, result, ops) {
            if (err) {
                throw err;
                cb(false);
                return;
            }
            console.warn("-----" + ops + "-----")
            cb(true, result);
        });
    },
    insertMany: function (collectionName, param, cb) {//插入1/多条数据，插入后有具体的信息返回
        //连接到表
        var collection = thisDb.collection(collectionName);
        //插入数据
        collection.insertMany(param, {}, function (err, result) {
            //result 格式
            // {
            //     result: { ok: 1, n: 1 },
            //     ops:
            //     [{
            //         pid: null,
            //         name: '十大发',
            //         url: '暗室逢灯',
            //         createDate: 2019 - 08 - 22T03: 42: 30.670Z,
            //         _id: 5d5e0f261030bd61f84270d8
            //     }],
            //         insertedCount: 1,
            //             insertedIds: { '0': 5d5e0f261030bd61f84270d8 }
            // }
            if (err) {
                throw err;
                cb(false);
                return;
            }
            cb(true, result.ops);
        });
    },
    findOne: function (collectionName, whereStr, cb) {//查询一条数据
        //连接到表
        var collection = thisDb.collection(collectionName);
        // 查数据
        collection.find(whereStr).toArray(function (err, result) {
            if (err) {
                console.log('Error:' + err);
                return;
            } else {
                console.log(result, "长度" + result.length)
                if (result.length < 1) {
                    cb(false);
                } else {
                    cb(result[0]);
                }

            }
        })
    },
    findAll: function (collectionName, cb) {//查询所有数据
        //连接到表
        var collection = thisDb.collection(collectionName);
        // 查数据
        collection.find().toArray(function (err, result) {
            if (err) {
                console.log('Error:' + err);
                cb(false, err)
                return;
            }
            cb(true, result);
        })
    },
    findAndSort: function (collectionName,sort, cb) {//查询所有数据然后进行排序
        //连接到表
        var collection = thisDb.collection(collectionName);
        // 查数据
        collection.find().sort(sort).toArray(function (err, result) {
            if (err) {
                console.log('Error:' + err);
                cb(false, err)
                return;
            }
            cb(true, result);
        })
    },
    deleteOne: function (collectionName, whereStr, cb) {//删除一条数据
        //连接到表
        console.log(whereStr)
        var collection = thisDb.collection(collectionName);
        //删除数据
        collection.remove(whereStr, function (err, result) {
            if (err) {
                throw err;
                cb(false);
                return;
            }
            cb(true);
        });
    },
    updateOne: function (collectionName, whereStr, updateStr, cb) {//更新一条数据
        //连接到表
        var collection = thisDb.collection(collectionName);
        //更新数据
        collection.updateOne(whereStr, updateStr, function (err, result) {
            if (err) {
                throw err;
                cb(false);
                return;
            }
            cb(true);
        });
    },
}

module.exports = dbInstance;
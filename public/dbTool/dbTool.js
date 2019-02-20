var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/wecansys";
var thisDb={};
var dbInstance={
	connect:function(){
		MongoClient.connect(url, function(err, client) {
			if (err) throw err;
			console.log("数据库已创建!");
			thisDb=client.db("wecansys");
		})
	},
	insertOne: function (collectionName, param, cb) {//插入一条数据
        //连接到表
        var collection = thisDb.collection(collectionName);
        //插入数据
        collection.insertOne(param,{}, function (err, result) {
            if (err) {
            	throw err;
            	cb(false);
            	return;
            }
            cb(true);
        });
    },
    findAll: function (collectionName, cb) {//插入一条数据
        //连接到表
        var collection = thisDb.collection(collectionName);
        // 查数据
        collection.find().toArray(function (err, result) {
            if (err) {
                console.log('Error:' + err);
                return;
            }
            cb(result);
        })
    },
}

module.exports = dbInstance;
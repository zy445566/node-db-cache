const redis = require('redis');
var instance =null;
class RedisEngine{
	constructor(cacheConfig) {
		var randomServer = Math.floor(Math.random()*cacheConfig.length);
		this.client = redis.createClient(cacheConfig[randomServer]);
	}
	static getInstance(cacheConfig)
	{
		if (instance==null)
		{
			instance = new RedisEngine(cacheConfig);
		}
		return instance;
	}
	getConnect()
	{
		this.client.on("error", function (err) {
		    throw err;
		});
		return this.client;
	}

	endConnect()
	{
		this.client.quit();
	}

	Command(client,method,data)
	{
		return new Promise(function (resolve,reject) {
			client.send_command(method,data,function(err, reply) {
				if (err) throw err;
			    resolve(reply);
			});
		});
	}

	openPipeline (client) {
		//作为mutli返回，无序操作，可做管道
		return client.batch();
	}

	openMulti (client) {
		return client.multi();
	}

	exec (multi) {
		result = multi.exec();
		return result;
	}
}

module.exports = RedisEngine;
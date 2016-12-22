var config = {
	db:{
		use:'mysql',
		mysql : {
			master:{
				host : "127.0.0.1",
				user : "root",
				password : "123456",
				port : "3306",
				database : 'test'
			},
			slaves:
			[
				{
					host : "127.0.0.1",
					user : "root",
					password : "123456",
					port : "3306",
					database : 'test'
				},
				{
					host : "127.0.0.1",
					user : "root",
					password : "123456",
					port : "3306",
					database : 'test'
				}
			]
		}
	},
	// middleData:{
	// 	use :'mongodb',
	// 	mongodb:{
	// 		host : "127.0.0.1",
	// 		port:"27017",
	// 	}
	// },
	cache:{
		use:'redis',
		redis : 
		[
			{
				host : "127.0.0.1",
				port : "6379",
				// password : "",
				db : 0
			},
			{
				host : "127.0.0.1",
				port : "6379",
				// password : "",
				db : 0
			},
		]
	}
};

var dbCache = require('./index');
var DBCacheEngine = dbCache.DBCacheEngine;
var BaseModule = dbCache.BaseModule;
var enigine = DBCacheEngine.getEngine(config);
class User extends BaseModule
{
	constructor(engine,cacheId,isCache)
	{
		super(engine,'user',cacheId,isCache);
	}

	async getUser(uid)
	{
		var res = await this.mySelect('select * from user where uid=?',[uid],60);
		console.log(res);
		return res;
	}

	updateUser(uid)
	{
		var res = this.myUpdate('Update user SET name="zs1" where uid=?',[uid]);
		// console.log(res);
		return res;
	}
}

//you can use uid as cacheId
var uid = 1;
var user = new User(enigine,1,true);
// user.getUser(1);
// user.getUser(1);
// user.updateUser(1);
user.getUser(1);
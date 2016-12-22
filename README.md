# node-db-cache
		for nodejs db cache module

#require
		node -v >7.10
		need open --harmony

#what is?
		Separation based on mysql and redis database, 
		reading and writing of distributed and the second level cache function


#How To Use?
## for example
-first
		open your mysql and your redis;
		sql into mysql:
```sql
create database `test`;
DROP TABLE IF EXISTS `test`.`user`;
CREATE TABLE `test`.`user` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
INSERT INTO `user` VALUES ('1', 'zs');
INSERT INTO `user` VALUES ('2', 'ls');
INSERT INTO `user` VALUES ('3', 'ww');
INSERT INTO `user` VALUES ('4', 'hehe');
```
-second
		mkdir test
		npm install db-cache
		vim test.js
		input:
```js
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

var dbCache = require('db-cache');
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
```
-third
		node --harmony test.js

		you can see(first):
		[ RowDataPacket { uid: 1, name: 'zs1' } ]

		then command+c,double time to exit,then run "node --harmony test.js" again:

		you can see(again,now in cache):
		[ { uid: 1, name: 'zs1' } ]







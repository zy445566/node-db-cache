const mysql = require('mysql');
var instance =null;
class MysqlEngine{
	constructor(dbConfig) 
	{
		this.poolCluster = mysql.createPoolCluster();
    	this.poolCluster.add('MASTER', dbConfig['master']);
    	var i=0;
		for (var slave of dbConfig['slaves']) {
			this.poolCluster.add('SLAVE'+i, slave);
			i++;
		}
	}
	static getInstance(dbConfig)
	{
		if (instance==null)
		{
			instance = new MysqlEngine(dbConfig);
		}
		return instance;
	}
	getMasterConnect()
	{
		var poolCluster = this.poolCluster;
		return new Promise(function (resolve,reject) {
			poolCluster.getConnection('MASTER',function(err, connection){
				if (err) throw err;
				resolve(connection);
			})
		});
	}

	getSalveConnect()
	{
		var poolCluster = this.poolCluster;
		return new Promise(function (resolve,reject) {
			poolCluster.getConnection(function(err, connection){
				if (err) throw err;
				resolve(connection);
			});
		});
	}

	beginTransaction (connection) {
		return new Promise(function (resolve,reject) {
			connection.beginTransaction(function(err){
				if (err) throw err;
				resolve();	
			});
		});
	};

	rollback (connection) {
		return new Promise(function (resolve,reject) {
			connection.rollback(function(err){
				if (err) throw err;
				resolve();
			});
		});
	};

	commit (connection) {
		return new Promise(function (resolve,reject) {
			connection.commit(function(err){
				if (err) throw err;
				resolve();
			});
		});
	};

	dbQuery(connection,sql, bind)
	{
		return new Promise(function (resolve,reject) {
			connection.query(sql, bind,function(err,row){
				if (err) throw err;
				resolve(row);
			});
		});
	}

	dbSelect(connection,sql, bind)
	{
		return this.dbQuery(connection,sql, bind);
	}

	dbUpdate(connection,sql, bind)
	{
		return this.dbQuery(connection,sql, bind);
	}

	dbDelete(connection,sql, bind)
	{
		return this.dbQuery(connection,sql, bind);
	}

	dbInsert(connection,sql, bind)
	{
		return this.dbQuery(connection,sql, bind);
	}
}
module.exports = MysqlEngine;
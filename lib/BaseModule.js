var crypto = require('crypto');
class BaseModule{
	constructor(engine,table,cacheId,isCache)
	{
		this.engine=engine;
		this.table=table;
		this.cacheId=cacheId;
		this.isCache=isCache;
	}

	getTableCacheIdSetKey()
	{
		return 'TableCacheIdSet.'+this.table+':'+this.cacheId;
	}

	getSqlMd5Key(sql,bind)
	{
		var sqlDateStr = sql + ' <- ';
		sqlDateStr += JSON.stringify(bind);
		var md5 = crypto.createHash('md5');
		md5.update(sqlDateStr);
		var sqlMd5 = md5.digest('hex');
		return 'SqlMd5Key.'+this.table+':'+this.cacheId+':'+sqlMd5;
	}

	getDBConnect(master)
	{
		if (master)
		{
			return this.engine.db.getMasterConnect();
		} else {
			return this.engine.db.getSalveConnect();
		}
	}

	getCacheConnect()
	{
		return this.engine.cache.getConnect();
	}

	async getCache(sql,bind)
	{
		var setKey = this.getTableCacheIdSetKey();
		var sqlKey = this.getSqlMd5Key(sql,bind);
		var isin = await this.engine.cache.Command(
			this.getCacheConnect(),
			'sismember',
			[setKey,sqlKey]
		);
		if (isin==1)
		{
			var sqlData = await this.engine.cache.Command(
				this.getCacheConnect(),
				'get',
				[sqlKey]
			);
			if (sqlData==null)
			{
				return false;
			} else {
				return JSON.parse(sqlData);
			}
		} else {
			return false;
		}
	}

	setCache(sql,bind,expire,data)
	{
		var setKey = this.getTableCacheIdSetKey();
		var sqlKey = this.getSqlMd5Key(sql,bind);
		var setRes = this.engine.cache.Command(
			this.getCacheConnect(),
			'sadd',
			[setKey,sqlKey]
		);
		var sqlRes = this.engine.cache.Command(
			this.getCacheConnect(),
			'setex',
			[sqlKey,expire,JSON.stringify(data)]
		);
	}

	delCache(sql,bind)
	{
		var setKey = this.getTableCacheIdSetKey();
		var setRes = this.engine.cache.Command(
			this.getCacheConnect(),
			'del',
			[setKey]
		);
	}

	async mySelect(sql,bind,expire)
	{
		var bind = bind?bind:[];
		var expire = expire?expire:10800;

		var cahce = await this.getCache(sql,bind);
		if (cahce!=false)
		{
			return cahce;
		}
		var connection = await this.getDBConnect(false);
		var data = await this.engine.db.dbSelect(connection,sql, bind);
		this.setCache(sql,bind,expire,data);
		return data;

	}

	async myUpdate(sql,bind)
	{
		var connection = await this.getDBConnect(true);
		var res = await this.engine.db.dbUpdate(connection,sql,bind);
		this.delCache(sql,bind);
		return res;
	}

	async myDelete(sql,bind)
	{
		var connection = await this.getDBConnect(true);
		var res = await this.engine.db.dbDelete(connection,sql,bind);
		this.delCache(sql,bind);
		return res;
	}

	async myInsert(sql,bind)
	{
		var connection = await this.getDBConnect(true);
		var res = await this.engine.db.dbInsert(connection,sql,bind);
		this.delCache(sql,bind);
		return res;
	}
}
module.exports = BaseModule;
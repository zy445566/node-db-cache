class DBCacheEngine{
	static getEngine(config)
	{
		var engine ={};
		switch(config['db']['use'])
		{
			case 'mysql':
				var MysqlEngine = require('./MysqlEngine');
				engine.db = MysqlEngine.getInstance(config['db']['mysql']);
			break;
			default:
			break;
		}
		switch(config['cache']['use'])
		{
			case 'redis':
				var RedisEngine = require('./RedisEngine');
				engine.cache = RedisEngine.getInstance(config['cache']['redis']);
			break;
			default:
			break;
		}
		return engine;
	}
}
module.exports = DBCacheEngine;
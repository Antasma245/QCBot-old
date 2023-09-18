const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Tags1 = sequelize.define('tags1', {
	dbsubid: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		unique: true,
	},
	dbuserid: Sequelize.STRING,
	dbdslink: Sequelize.STRING,
});

const Tags2 = sequelize.define('tags2', {
	dbqcid: {
		type: Sequelize.STRING,
		primaryKey: true,
		unique: true,
	},
	dbcount: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	dbqcname: Sequelize.STRING,
});

module.exports = {
    Tags1,
    Tags2,
  };
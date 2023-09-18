const { Events } = require('discord.js');
const { Tags1, Tags2 } = require('../sequelcode');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		Tags1.sync();
		Tags2.sync();
	},
};
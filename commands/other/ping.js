const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription("Check the bot's ping"),
	async execute(interaction) {
		await interaction.reply('Dunno :3');
	},
};
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription("Check the bot's ping"),
	async execute(interaction) {
		await interaction.reply({ embeds: [new EmbedBuilder().setColor(`ffc0cb`).setDescription(`## Dunno :3`)] });
	},
};

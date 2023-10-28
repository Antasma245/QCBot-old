const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('submitkits')
		.setDescription("Submit a model you've trained with Kits for validation"),
	async execute(interaction) {
		await interaction.reply({content:"Sorry, we do not accept Kits.ai models anymore. If you're trying to submit a model that has NOT been trained with Kits.ai, please use the `/submit` command instead.", ephemeral: true });
	},
};

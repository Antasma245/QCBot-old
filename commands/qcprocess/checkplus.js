const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Tags1 } = require('../../sequelcode');
const env = require('dotenv').config();
const qcRoleId = process.env.qcRoleId;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('checkplus')
		.setDescription(`Get a list of all submissions in queue`),
	async execute(interaction) {
        if (!interaction.member.roles.cache.has(qcRoleId)) {
            return interaction.reply({content:"You do not have permission to review submissions. If you want to become a Model QC, you can apply for the role using the `/jointeam` command of the AI HUB bot.", ephemeral: true });
        }

        const sublistraw = await Tags1.findAll({ attributes: ['dbsubid', 'dbdslink'], order: [['createdAt', 'ASC']] });
        const sublist = sublistraw.map(t => `**${t.dbsubid}**: ${t.dbdslink}`).join('\n') || 'Database is empty.';

        await interaction.reply({embeds: [new EmbedBuilder().setColor(`e74c3c`).setDescription(`${sublist}`)], ephemeral: true });

        }
    };
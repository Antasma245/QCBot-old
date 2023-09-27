const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Tags2 } = require('../../sequelcode');
const env = require('dotenv').config();
const modRoleId = process.env.modRoleId;
const adminRoleId = process.env.adminRoleId;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('qcstats')
		.setDescription(`Check the QCs activity`),
	async execute(interaction) {

        if (!interaction.member.roles.cache.has(modRoleId) && !interaction.member.roles.cache.has(adminRoleId)) {
            return interaction.reply({content:"You do not have permission to use this command.", ephemeral: true });
        }

        const qclistraw = await Tags2.findAll({ attributes: ['dbqcid', 'dbcount', 'dbqcname'], order: [['dbcount', 'DESC']] });
        const qclist = qclistraw.map(t => `**${t.dbqcname}** (${t.dbqcid}): **${t.dbcount}**`).join('\n') || 'Database is empty.';

        await interaction.reply({embeds: [new EmbedBuilder().setColor(`e74c3c`).setDescription(`${qclist}`)], ephemeral: true });

        }
    };

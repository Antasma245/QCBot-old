const { SlashCommandBuilder } = require('discord.js');
const { Tags1 } = require('../../sequelcode');
const env = require('dotenv').config();
const qcRoleId = process.env.qcRoleId;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cancel')
		.setDescription('Cancel your submission')
        .addIntegerOption(option =>
            option.setName('id')
                .setDescription('Your submission ID')
                .setRequired(true)
                .setMaxValue(999)),
	async execute(interaction) {
        const inputsubid = interaction.options.getInteger('id');
        const userid = interaction.user.id;
        
        const tag = await Tags1.findOne({ where: { dbsubid: inputsubid } });

        if (!tag) {
            return interaction.reply({content:`No submission found with ID: ${inputsubid}. Please check if your submission ID is correct.`, ephemeral: true });
        }

        const usercheck = tag.get('dbuserid')
    
        if (userid!=usercheck && !interaction.member.roles.cache.has(qcRoleId)) {
            return interaction.reply({content:`You do not have permission to cancel this submission.`, ephemeral: true });
        }
    
        await Tags1.destroy({ where: { dbsubid: inputsubid } });
        return interaction.reply(`<@${interaction.user.id}> Your submission (ID: ${inputsubid}) has been successfully removed from queue.`);

        }
    };
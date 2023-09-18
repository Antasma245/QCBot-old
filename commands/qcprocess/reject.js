const { SlashCommandBuilder } = require('discord.js');
const { Tags1, Tags2 } = require('../../sequelcode');
const env = require('dotenv').config();
const qcRoleId = process.env.qcRoleId;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reject')
		.setDescription('Reject a submission')
        .addIntegerOption(option =>
            option.setName('id')
                .setDescription('The submission ID')
                .setRequired(true)
                .setMaxValue(999))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Why did you reject the submission?')
                .setRequired(true)
                .setMaxLength(500)),
    async execute(interaction) {
        const inputsubid = interaction.options.getInteger('id');
        const reason = interaction.options.getString('reason');
        
        const tag = await Tags1.findOne({ where: { dbsubid: inputsubid } });

        if (!tag) {
            return interaction.reply({content:`No submission found with ID: ${inputsubid}. Please check if your submission ID is correct.`, ephemeral: true });
        }

        const subuserid = tag.get('dbuserid');

        if (!interaction.member.roles.cache.has(qcRoleId)) {
            return interaction.reply({content:"You do not have permission to reject submissions. If you want to become a Model QC, you can apply for the role using the `/jointeam` command of the AI HUB bot.", ephemeral: true });
        }
    
        await Tags1.destroy({ where: { dbsubid: inputsubid } });

        const tag2 = await Tags2.findOne({ where: { dbqcid: interaction.user.id } });

        const membername = interaction.member.nickname ?? interaction.member.displayName

        if (!tag2) {
            await Tags2.create({
				dbqcid: interaction.user.id,
				dbcount: 1,
                dbqcname: membername,
			});
        } else {
            const currentcount = tag2.get('dbcount');
            await Tags2.update({ dbcount: currentcount+1, dbqcname: membername }, { where: { dbqcid: interaction.user.id } });
        }

        return interaction.reply(`<@${subuserid}> Your submission (ID: ${inputsubid}) has been rejected by **${membername}**.\nReason: *${reason}*.\nPlease apply these changes and try again.`);

        } 
    };
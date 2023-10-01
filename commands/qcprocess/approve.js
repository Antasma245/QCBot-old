const { SlashCommandBuilder } = require('discord.js');
const { Tags1, Tags2 } = require('../../sequelcode');
const env = require('dotenv').config();
const qcRoleId = process.env.qcRoleId;
const modelRoleId = process.env.modelRoleId;
const modelsChannelId = process.env.modelsChannelId;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('approve')
		.setDescription('Approve a submission')
        .addIntegerOption(option =>
            option.setName('id')
                .setDescription('The submission ID')
                .setRequired(true)
                .setMaxValue(999))
        .addStringOption(option =>
            option.setName('comment')
                .setDescription('Anything to add?')
                .setMaxLength(500)),
	async execute(interaction) {
        const inputsubid = interaction.options.getInteger('id');
        const comment = interaction.options.getString('comment') ?? 'N/A';

        const tag = await Tags1.findOne({ where: { dbsubid: inputsubid } });

        if (!tag) {
            return interaction.reply({content:`No submission found with ID: ${inputsubid}. Please check if your submission ID is correct.`, ephemeral: true });
        }
    
        const subuserid = tag.get('dbuserid');

        if (!interaction.member.roles.cache.has(qcRoleId)) {
            return interaction.reply({content:"You do not have permission to approve submissions. If you want to become a Model QC, you can apply for the role using the `/jointeam` command of the AI HUB bot.", ephemeral: true });
        }

        let member = await interaction.guild.members.fetch(subuserid);
        let role = await interaction.guild.roles.fetch(modelRoleId);
        let countmember = 0
        let countrole = 0

        while (!member) {
            if (countmember <=4) {
                member = await interaction.guild.members.fetch(subuserid),
                countmember = countmember+1
            } else {
                return interaction.reply({content:"An error occured while using `/approve`. Please try again.", ephemeral: true });
            }
        }

        while (!role) {
            if (countrole <=4) {
                role = await interaction.guild.roles.fetch(modelRoleId),
                countrole = countrole+1
            } else {
                return interaction.reply({content:"An error occured while using `/approve`. Please try again.", ephemeral: true });
            }
        }

        await member.roles.add(role);

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

        return interaction.reply(`<@${subuserid}> Your submission (ID: ${inputsubid}) has been approved by **${membername}**.\nComment: *${comment}*\nYou've been granted the Model Maker role and can now post in the https://discord.com/channels/${interaction.guild.id}/${modelsChannelId} channel.`);

        }
    };

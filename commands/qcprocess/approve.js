const { SlashCommandBuilder } = require('discord.js');
const { Tags1, Tags2 } = require('../../sequelcode');
const env = require('dotenv').config();
const guildId = process.env.guildId;
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

        const member = interaction.guild.members.cache.get(subuserid);
        const role = interaction.guild.roles.cache.get(modelRoleId);
        await member.roles.add(role)

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

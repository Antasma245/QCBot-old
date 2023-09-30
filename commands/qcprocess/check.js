const { SlashCommandBuilder } = require('discord.js');
const { Tags1 } = require('../../sequelcode');
const env = require('dotenv').config();
const qcRoleId = process.env.qcRoleId;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('check')
		.setDescription(`Review a submission`),
	async execute(interaction) {
        if (!interaction.member.roles.cache.has(qcRoleId)) {
            return interaction.reply({content:"You do not have permission to review submissions. If you want to become a Model QC, you can apply for the role using the `/jointeam` command of the AI HUB bot.", ephemeral: true });
        }
        
        let dbsubidlist = []

        const dbsubidrawlist = await Tags1.findAll({ attributes: ['dbsubid'], order: [['createdAt', 'ASC']] });
        dbsubidlist.push(...dbsubidrawlist.map((tag) => tag.dbsubid));

        const length = dbsubidlist.length
        
        if (length==0) {
            return interaction.reply({content:`No new submissions to check. Queue is empty.`, ephemeral: true });
        }

        const tag = await Tags1.findOne({ where: { dbsubid: dbsubidlist[0] } });
        const dbdslink = tag.get('dbdslink')

        if (length==1) {
            return interaction.reply({content:`${length} submission is awaiting to be reviewed.\n**ID:** ${dbsubidlist[0]}\n**Link:** ${dbdslink}`, ephemeral: true });
        } else {
            return interaction.reply({content:`${length} submissions are awaiting to be reviewed. Here's the least recent one:\n**ID:** ${dbsubidlist[0]}\n**Link:** ${dbdslink}`, ephemeral: true });
        }}
    };

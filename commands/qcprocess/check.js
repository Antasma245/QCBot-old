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
        
        let dbsubidlast = []
        let dbsubidlist = []

        const dbsubidrawlast = await Tags1.findAll({ attributes: ['dbsubid'], order: [['createdAt', 'ASC']], limit: 1 });
        dbsubidlast.push(...dbsubidrawlast.map((tag) => tag.dbsubid));

        const dbsubidrawlist = await Tags1.findAll({ attributes: ['dbsubid'], order: [['createdAt', 'ASC']] });
        dbsubidlist.push(...dbsubidrawlist.map((tag) => tag.dbsubid));

        const length = dbsubidlist.length
        
        if (length==0) {
            return interaction.reply(`No new submissions to check. Queue is empty.`);
        }

        const tag = await Tags1.findOne({ where: { dbsubid: dbsubidlist[0] } });
        const dbdslink = tag.get('dbdslink')

        if (length==1) {
            return interaction.reply(`${length} submission is awaiting to be reviewed.\n**ID:** ${dbsubidlist[0]}\n**Link:** ${dbdslink}`);
        } else {
            return interaction.reply(`${length} submissions are awaiting to be reviewed. Here's the least recent one:\n**ID:** ${dbsubidlist[0]}\n**Link:** ${dbdslink}`);
        }}
    };
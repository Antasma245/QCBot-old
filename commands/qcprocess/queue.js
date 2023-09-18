const { SlashCommandBuilder } = require('discord.js');
const { Tags1 } = require('../../sequelcode');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription(`Check your submission's number in queue.`)
        .addIntegerOption(option =>
            option.setName('id')
                .setDescription('Your submission ID')
                .setRequired(true)
                .setMaxValue(999)),
	async execute(interaction) {
        const inputsubid = interaction.options.getInteger('id');
        
        let dbsubidlist = []

        const dbsubidraw = await Tags1.findAll({ attributes: ['dbsubid'], order: [['createdAt', 'ASC']] });
        dbsubidlist.push(...dbsubidraw.map((tag) => tag.dbsubid));

        const length = dbsubidlist.length

        if (!dbsubidlist.includes(inputsubid)) {
            return interaction.reply({content:`No submission found with ID: ${inputsubid}. Please check if your submission ID is correct.`, ephemeral: true });
        }

        const preindex = dbsubidlist.indexOf(inputsubid);
        const index = preindex+1

        await interaction.reply(`<@${interaction.user.id}> Your submission (ID: ${inputsubid}) is number ${index} out of ${length} in queue. It'll be reviewed shortly.`);

        }
    };
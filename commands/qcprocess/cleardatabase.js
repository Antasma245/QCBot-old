const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const { Tags1 } = require('../../sequelcode');
const env = require('dotenv').config();
const myUserId = process.env.myUserId;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cleardatabase')
		.setDescription('Clear the submission database'),
	async execute(interaction) {

        if (interaction.user.id!=myUserId) {
            return interaction.reply({content:`You do not have permission to use this command.`, ephemeral: true });
        }

        let dbsubidlist = []
        const dbsubidraw = await Tags1.findAll({ attributes: ['dbsubid'] });
        dbsubidlist.push(...dbsubidraw.map((tag) => tag.dbsubid));
        const length = dbsubidlist.length

        if (length==0) {
            return interaction.reply({content:`Database is already empty.`, ephemeral: true });
        }
        
        const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Confirm')
			.setStyle(ButtonStyle.Danger);

		const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder()
		    .addComponents(cancel, confirm);

		const click = await interaction.reply({
			content: `Confirm database wipe-off? This action cannot be undone.`,
			components: [row],
            ephemeral: true,

        })

        try {
            const confirmation = await click.awaitMessageComponent({ time: 30_000 });

            if (confirmation.customId === 'confirm') {
                await Tags1.destroy({ where: {}, truncate: true })
                .then(() => {
                    confirmation.update({ content: `Successfully removed all submissions in the dabatase.`, components: [] });
                })
                .catch((error) => {
                  console.error('Error deleting entries:', error);
                });
            } else if (confirmation.customId === 'cancel') {
                await confirmation.update({ content: 'Action cancelled.', components: [] });
            }

        } catch (e) {
            await interaction.editReply({ content: 'Confirmation not received within 30 seconds, cancelling.', components: [] });
        }

    }};
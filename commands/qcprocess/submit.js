const { SlashCommandBuilder } = require('discord.js');
const { Tags1 } = require('../../sequelcode');
const { bannedwords } = require('../../wordCheckFunction');
const env = require('dotenv').config();
const qcChannelId = process.env.qcChannelId;
const modelRoleId = process.env.modelRoleId;
const modelsChannelId = process.env.modelsChannelId;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('submit')
		.setDescription('Submit your model for validation to get the Model Maker role')
        .addStringOption(option =>
            option.setName('modelname')
                .setDescription('The name of your model')
                .setRequired(true)
                .setMaxLength(100))
        .addStringOption(option =>
            option.setName('rvc')
                .setDescription('The RVC version used for training (v1 or v2)')
                .setRequired(true)
                .addChoices(
                    { name: 'v1', value: 'v1' },
                    { name: 'v2', value: 'v2' },
                ))
        .addStringOption(option =>
            option.setName('extraction')
                .setDescription('The extraction method used for training')
                .setRequired(true)
                .addChoices(
                    { name: 'pm', value: 'pm' },
                    { name: 'harvest', value: 'harvest' },
                    { name: 'dio', value: 'dio' },
                    { name: 'crepe', value: 'crepe' },
                    { name: 'crepe-tiny', value: 'crepe-tiny' },
                    { name: 'mangio-crepe', value: 'mangio-crepe' },
                    { name: 'mangio-crepe-tiny', value: 'mangio-crepe-tiny' },
                    { name: 'rmvpe', value: 'rmvpe' },
                    { name: 'rmvpe_onnx', value: 'rmvpe_onnx' },
                    { name: 'rmvpe+', value: 'rmvpe+' },
                ))
        .addStringOption(option =>
            option.setName('epochs')
                .setDescription('The number of epochs of your model')
                .setRequired(true)
                .setMaxLength(10))
        .addStringOption(option =>
            option.setName('link')
                .setDescription('The link of your model (Huggingface only!)')
                .setRequired(true)
                .setMaxLength(150))
        .addAttachmentOption(option =>
            option.setName('image')
                .setDescription('An image for your model')
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('demo')
                .setDescription('An audio file containing a demo of your model')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('note')
                .setDescription('Anything else?')
                .setMaxLength(500)),
	async execute(interaction) {
		if (interaction.channel.id!=qcChannelId) {
            return interaction.reply({content:`This command can only be used in the https://discord.com/channels/${interaction.guild.id}/${qcChannelId} channel.`, ephemeral: true });
        }
        
        const name = interaction.options.getString('modelname');
		const rvc = interaction.options.getString('rvc');
        const extraction = interaction.options.getString('extraction');
		const epochs = interaction.options.getString('epochs');
		const link = interaction.options.getString('link');
        const note = interaction.options.getString('note') ?? 'N/A';
        const userid = interaction.user.id;
        const image = interaction.options.getAttachment('image');
        const demo = interaction.options.getAttachment('demo');

        if (interaction.member.roles.cache.has(modelRoleId)) {
            return interaction.reply({content:`You already have the Model Maker role. You can post your models in the https://discord.com/channels/${interaction.guild.id}/${modelsChannelId} channel.`, ephemeral: true });
        }

        const namecheck = name.toLowerCase();
        const epochscheck = epochs.toLowerCase();
        const linkcheck = link.toLowerCase();
        const notecheck = note.toLowerCase();

        for (const word of bannedwords) {
            if (namecheck.includes(word)) {
                return interaction.reply({content:`Your submission contains a banned word. Unable to proceed.`, ephemeral: true });
            } else if (epochscheck.includes(word)) {
                return interaction.reply({content:`Your submission contains a banned word. Unable to proceed.`, ephemeral: true });
            } else if (linkcheck.includes(word)) {
                return interaction.reply({content:`Your submission contains a banned word. Unable to proceed.`, ephemeral: true });
            } else if (notecheck.includes(word)) {
                return interaction.reply({content:`Your submission contains a banned word. Unable to proceed.`, ephemeral: true });
            }
        }

        if (link.includes("https://huggingface.co/")) {
            if (link.includes("/blob/")) {
                return interaction.reply({content:`Invalid Huggingface link. Please make sure to get the "resolve" link and not the "blob" one. Follow this tutorial to make sure you get the correct Huggingface link: <https://rentry.org/fdg_guide>.`, ephemeral: true });
            } else if (!link.includes("/resolve/")) {
                return interaction.reply({content:`Invalid Huggingface link. Please make your link is a "resolve" one. Follow this tutorial to make sure you get the correct Huggingface link: <https://rentry.org/fdg_guide>.`, ephemeral: true });
            }
        } else if (link.includes("https://drive.google.com/") || link.includes("https://mega.nz/")) {
            return interaction.reply({content:`Looks like you entered a Google Drive / Mega link. Please note that all models are required to have a Huggingface link. Follow this tutorial to make sure you get the correct Huggingface link: <https://rentry.org/fdg_guide>.`, ephemeral: true });
        } else {
            return interaction.reply({content:`Invalid link. Please note that all models are required to have a Huggingface link. Follow this tutorial to make sure you get the correct Huggingface link: <https://rentry.org/fdg_guide>.`, ephemeral: true });
        }

        const imageType = image.contentType.toLowerCase();
        const demoType = demo.contentType.toLowerCase();
        const imageSize = demo.size
        const demoSize = image.size

        if (!imageType.includes("png") && !imageType.includes("jpg") && !imageType.includes("jpeg") && !imageType.includes("gif") && !imageType.includes("webp")) {
            return interaction.reply({content:`Invalid file type for "image". Please attach a file with a supported extension. Supported file types: png, jpg, jpeg, gif, webp.`, ephemeral: true });
        }
        if (!demoType.includes("wav") && !demoType.includes("flac") && !demoType.includes("mp3") && !demoType.includes("m4a")) {
            return interaction.reply({content:`Invalid file type for "demo". Please attach a file with a supported extension. Supported file types: wav, flac, mp3, m4a.`, ephemeral: true });
        }

        if (imageSize>=250000000) {
            return interaction.reply({content:`Invalid file size for "image". Please attach a file that's under 25 MB.`, ephemeral: true });
        }
        if (demoSize>=250000000) {
            return interaction.reply({content:`Invalid file size for "demo". Please attach a file that's under 25 MB.`, ephemeral: true });
        }

        const botresponse = await interaction.reply({content:`<@${interaction.user.id}> Your submission is being processed... Please wait...`});
        const dslink = `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${botresponse.id}`

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
          }

        let subid = getRandomInt(1, 999);
        let state = 0
        let dbsubidlist = []

        const dbsubidraw = await Tags1.findAll({ attributes: ['dbsubid'] });
        dbsubidlist.push(...dbsubidraw.map((tag) => tag.dbsubid));

        while (state == 0) {
            if (dbsubidlist.includes(subid)) {
                subid = getRandomInt(1, 999)
            } else {
                state = 1;
            }
        }

        try {
			await Tags1.create({
				dbsubid: subid,
				dbuserid: userid,
				dbdslink: dslink,
			});
            return interaction.editReply({content:`<@${interaction.user.id}> Your model has been successfully submitted with infos:\n**Name:** ${name}\n**RVC:** ${rvc}\n**Extraction type:** ${extraction}\n**Number of epochs:** ${epochs}\n**Link:** <${link}>\n**Note:** ${note}\n**Your submission ID:** ${subid}\nPlease wait until a Model QC reviews your model. You'll be notified once it has been reviewed.`, files:[image, demo]});
		}
		catch (error) {
			return interaction.editReply({content:`Something went wrong... Please try again and see if it works. If the error still persists, consider pinging <@antasma245>.`, ephemeral: true });
		}
	},
};
// bot by szvy
// discord.gg/szvy
// check example.json for an example on how to format your json files
// please dont skid/remove credit
// luv yall <3

const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');
const fs = require('fs');

const jason1 = JSON.parse(fs.readFileSync('./put-a-json-file-name-here.json', 'utf8'));
const jason2 = JSON.parse(fs.readFileSync('./put-a-json-file-name-here.json', 'utf8'));
const jason3 = JSON.parse(fs.readFileSync('./put-a-json-file-name-here.json', 'utf8'));
const jason4 = JSON.parse(fs.readFileSync('./put-a-json-file-name-here.json', 'utf8'));

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent], // this is the intents it requires, set this up on your discord bot
  partials: [Partials.Channel]
});

const OWNER_ID = 'put your discord id here';
const MAX_USES_PER_DAY = 2; // max amount of times each button can be used
const usageData = {};

function checkAndResetUsage(userId, buttonId) {
  const today = new Date().toISOString().slice(0, 10); // checks the date
  if (!usageData[userId]) {
    usageData[userId] = {};
  }

  if (!usageData[userId][buttonId] || usageData[userId][buttonId].date !== today) {
    usageData[userId][buttonId] = { count: 0, date: today };
  }
}

client.once(Events.ClientReady, () => {
  console.log(`your now hackered inside of ${client.user.tag}!`);
});

client.on(Events.MessageCreate, async (message) => {
  if (!message.guild) return;
  if (message.author.bot) return;
  
  if (message.content.trim() === '--panel' && message.author.id === OWNER_ID) {
    const embed = new EmbedBuilder()
      .setTitle('Link Generator')
      .setDescription('click a button below to generate a link!!')
      .setColor('DarkerGrey');
      .setFooter({ text: 'bot by szvy - discord.gg/szvy' });
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder().setCustomId('genjason1').setLabel('link type 1').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('genjason2').setLabel('link type 2').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('genjason3').setLabel('link type 3').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('genjason4').setLabel('link type 4').setStyle(ButtonStyle.Secondary),
      );

    await message.channel.send({ embeds: [embed], components: [row] });
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  const { user, customId } = interaction;
  checkAndResetUsage(user.id, customId);
  if (usageData[user.id][customId].count >= MAX_USES_PER_DAY) {
    return interaction.reply({ content: 'youve reached your daily usage for this type of link! try another type or wait until tomorrow for 2 more!', ephemeral: true });
  }

  usageData[user.id][customId].count += 1;

  let chosenLinks;
  switch (customId) {
    case 'genjason1':
      chosenLinks = jason1;
      break;
    case 'genjason2':
      chosenLinks = jason2;
      break;
    case 'genjason3':
      chosenLinks = jason3;
      break;
    case 'genjason4':
      chosenLinks = jason4;
      break;
    default:
      return interaction.reply({ content: 'idk what button you pressed', ephemeral: true });
  }

  const randomLink = chosenLinks[Math.floor(Math.random() * chosenLinks.length)];

  try {
    await user.send(`here is your link! ${randomLink}`);
    await interaction.reply({ content: 'check your DMs for your link! :D', ephemeral: true });
  } catch (error) {
    usageData[user.id][customId].count -= 1;
    await interaction.reply({ content: 'yo dms are off or some shit idk man', ephemeral: true });
  }
});

client.login('put your discord bot token here');

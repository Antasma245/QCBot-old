const slurs = ['YOUR_BANNED_EXPRESSIONS'];
const scamlinks = ['YOUR_BANNED_EXPRESSIONS'];
const noinvites = ['YOUR_BANNED_EXPRESSIONS'];
const pings = ['YOUR_BANNED_EXPRESSIONS'];
const foreignlanguages = ['YOUR_BANNED_EXPRESSIONS'];

const bannedwords = slurs.concat(scamlinks, noinvites, pings, foreignlanguages);

const placeholder = ['YOUR_CUSTOM_REMINDER'];

module.exports = {
    bannedwords,
};
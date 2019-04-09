const { promisify } = require('util');
const spotify = require('spotify-node-applescript');
const Genius = require('genius-api');
const opn = require('opn');
const inquirer = require('inquirer');

const genius = new Genius(process.env.GENIUS_CLIENT_ACCESS_TOKEN);

const log = console.log;

/**
 * get results from genius
 * @param {object} track - spotify track object
 * @return {Promise<*>}
 */
const search = async (track) => {
  if (!track) {
    throw new Error('no track playing I guess');
  }
  const keywords = [track.artist, track.name].join` `;
  log(`searching for "${ keywords }"`);
  const { hits } = await genius.search(keywords);
  return hits.reduce((acc, { result: { full_title, url } }) => ({
    ...acc,
    [full_title]: url
  }), {});
};

/**
 * prompt for choices
 * @param results
 * @return {Promise<Api.song>}
 */
const promptSong = async (results) => {
  const choices = await inquirer
    .prompt([
      {
        type: 'list',
        name: 'song',
        message: 'Which song exactly are you looking for?',
        choices: Object.keys(results)
      }
    ]);

  return choices.song;
};

const run = async () => {
  const track = await promisify(spotify.getTrack)();
  const results = await search(track);
  if (!results) {
    throw new Error('no results');
  }
  const choice = await promptSong(results);
  const url = results[choice.song];
  await opn(url);
};

run()
  .catch(console.error);

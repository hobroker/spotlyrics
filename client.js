const { promisify } = require('util');
const spotify = require('spotify-node-applescript');
const Genius = require('genius-api');
const cheerio = require('cheerio');
const axios = require('axios');

const genius = new Genius('token');

/**
 * @param url
 * @return {Promise<string>}
 */
const getSongLyrics = async (url) => {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const $lyrics = $('.lyrics');
  return $lyrics.html();
};

/**
 * get results from genius
 * @param {object} track - spotify track object
 * @return {Promise<object>}
 */
const search = async (track) => {
  const keywords = [track.artist, track.name].join` `;
  const { hits } = await genius.search(keywords);
  return hits[0].result;
};

const getCurrentLyrics = async () => {
  const track = await promisify(spotify.getTrack)();
  const result = await search(track);
  const lyrics = await getSongLyrics(result.url);
  return lyrics;
};

async function run() {
  const $root = document.getElementById('root');
  $root.innerText = 'loading...';
  const lyrics = await getCurrentLyrics();
  $root.innerHTML = lyrics;
}

window.onload = run;
window.onclick = run;

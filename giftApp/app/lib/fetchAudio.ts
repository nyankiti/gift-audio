// import * as rssParser from "react-native-rss-parser";
const rssParser = require('react-native-rss-parser');

const fetchAudio = async (setSongs: React.Dispatch<React.SetStateAction<any>>) => {
  const data = await fetch('https://anchor.fm/s/67fb36c0/podcast/rss')
    .then(response => response.text())
    .then(responseData => rssParser.parse(responseData))
    .then(rss => {
      return rss;
    });
  // console.log(data.items[0]);
  setSongs(data.items);
  return data.items;
};

export default fetchAudio;

let Parser = require("rss-parser");
import { existsSync, mkdirSync, writeFileSync } from "fs";
import axios from "axios";
let FolderName = "Downloaded_Podcasts";

let parser = new Parser();

try {
  if (!existsSync(FolderName)) {
    mkdirSync(FolderName);
  }
} catch (err) {
  console.error(err);
}

interface podObject {
  title: string;
  url: string;
  enclosure: {
    url: string;
  };
}

function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

let response = async (url: any, title: string) => {
  console.log("runing");

  await axios({ url, method: "get", responseType: "arraybuffer" }).then(
    (response) => {
      sleep(1000);
      let titelName = title.split(":")[1];
      const stream = response.data;
      writeFileSync(`./${FolderName}/${titelName}.mp3/`, stream);
      return "done";
    }
  );
};

const getPodcastList = async (feedUrl: string) => {
  let feed = await parser.parseURL(feedUrl);
  return feed.items.map(async (item: podObject, i: number) => {
    return {
      title: item.title,
      url: item.enclosure.url,
    };
  });
};

async function run() {
  let list: [Promise<object>] = await getPodcastList(
    "https://www.relay.fm/radar/feed"
  ).catch((error) => console.error(`List ${error}`));
  list.forEach((e) => {
    e.then(async (a: podObject) => {
      await response(a.url, a.title).catch((error) => console.error(error));
    });
  });
}

run();
// const downloadPodcast = async () => {
//   try {
//     let feed = await parser.parseURL("https://www.relay.fm/radar/feed");
//     console.log(feed.title);
//     feed.items.map(async (item: podObject, i: number) => {
//       if (i != 5) {
//         let url = item.enclosure.url;
//         console.log(url);
//         try {
//           await response(url, `${item.title}.mp3`);
//         } catch (e) {
//           console.log(e);
//         }
//       } else {
//         throw 0;
//       }
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };

// try {
//   downloadPodcast();
// } catch (error) {
//   console.error(error);
// }

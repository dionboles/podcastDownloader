let Parser = require('rss-parser');
let parser = new Parser();
let fs = require('fs');
let request = require('request');
let proceess = require("process").chdir;
let FolderName = "Dowloaded_Podcasts"
try {
    if (!fs.existsSync(FolderName)){
      fs.mkdirSync(FolderName)
    }
  } catch (err) {
    console.error(err)
  }
  proceess("./"+FolderName);
(async () => {
 try{
    let feed = await parser.parseURL('https://www.relay.fm/radar/feed');
    console.log(feed.title);
        
    feed.items.forEach((item,i) => {
        let file = fs.createWriteStream(`${item.title}`+".mp3");
        console.log(i)
        if( i != 5){
            request.get(item.enclosure.url).on('error', function(err) {
                // handle error
            }).pipe(file)
        }else{
            throw 0;
        }
    });
}catch (error){
    console.error(error);
}
})();

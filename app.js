let Parser = require('rss-parser');
let parser = new Parser();
var fs = require('fs');
var request = require('request');
let FolderName = "Dowloaded_Podcasts"
try {
    if (!fs.existsSync(FolderName)){
      fs.mkdirSync(FolderName)
    }
  } catch (err) {
    console.error(err)
  }
(async () => {
 try{
    let feed = await parser.parseURL('http://atp.fm/episodes?format=rss');
    console.log(feed.title);
        
    feed.items.forEach((item,i) => {
        var file = fs.createWriteStream("."+FolderName+`${item.title}`+".mp3");
        console.log(i)
        if( i != 5){
            request.get(item.enclosure.url).on('error', function(err) {
                // handle error
            }).pipe(file)
        }else{
            throw BreakException;
        }
    });
}catch (error){
    console.error(error);
}
})();

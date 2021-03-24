const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
//npm install puppeteer puppeteer-extra puppeteer-extra-plugin-stealth
puppeteer.use(StealthPlugin())
console.log('Replier Bot Starting!')

var Twit = require('twit');
var config = require('./configTwit');
var T = new Twit(config);
//npm twit

const myAccount = '1369045150907858946' || '1354887782737580033' || '936495688434696192' || '871067546807672832'; //Ur account ID
var totalTweets = 1;

startScan();
async function startScan() {
    //Setting up a user stream
    var stream = T.stream('statuses/filter', { track: 'google' });
    stream.on('tweet', async function (tweet) {
        const id = tweet.id_str;
        const text = tweet.text;

        if (tweet.user.id != myAccount && (text.includes('google it') || text.includes('google this') || text.includes('google that'))) {
            console.log(text);
            //Get Keyword
            var keyword = undefined;
            if (text.includes('google it') && text.includes('"')) {
                try {
                    keyword = text.split('"')[1];
                    if (keyword.includes(' ')) { keyword = keyword.replace(/ /g,'+'); }
                } catch { keyword = undefined }
            }
            else if (text.includes('google this') && text.includes('"')) {
                try {
                    keyword = text.split('"')[1];
                    if (keyword.includes(' ')) { keyword = keyword.replace(/ /g,'+'); }
                } catch { keyword = undefined }
            }
            else if (text.includes('google that') && text.includes('"')) {
                try {
                    keyword = text.split('"')[1];
                    if (keyword.includes(' ')) { keyword = keyword.replace(/ /g,'+'); }
                } catch { keyword = undefined }
            }

                if (keyword != undefined) {
                    console.log('TWEET: ' + tweet.text);
                    console.log('KEYWORD: ' + keyword);
                    var username = tweet.user.screen_name;
                    var statusTweet = "Hey @" + username + ", maybe try Presearching it instead? Here is your search on Presearch..."; //EDIT YOUR TWEET TEXT HERE
                    //var presearchResult = await getResult(keyword);
                    //console.log('PRESEARCH: '+presearchResult);
                    //statusTweet = statusTweet+' '+presearchResult;
                    statusTweet = statusTweet + ' https://engine.presearch.org/search?q=' + keyword + "&rid=109792";
                    console.log('TWEET REPLY: ' + statusTweet);
                }

                const params = {
                    in_reply_to_status_id: id,
                    status: statusTweet,
                    auto_populate_reply_metadata: true
                }

                T.post('statuses/update', params, tweeted);
                function tweeted(err, data, response) {
                    console.log('Tweet Attempt');
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('Tweet Sent!');
                        // if (totalTweets == 500) { stream.stop(); } else { totalTweets += 1; } //EDIT TWEET LIMIT HERE DEFAULT 5
                    }
                }
            }
        })
}

async function getResult(keyword) {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null
    });

    const page = await browser.newPage();

    await page.setRequestInterception(true)
    page.on('request', (request) => {
        if (['image', 'stylesheet', 'font', 'other'].includes(request.resourceType())) {
            request.abort();
        } else {
            request.continue();
        }
    });

    try { await page.goto('https://engine.presearch.org/search?q=' + keyword, { waitUntil: 'networkidle2' }); } catch { console.log('Presearch Load Issues!') }
    const searchLinkSelector = 'h3 > a';


    try {
        await page.waitForSelector(searchLinkSelector);
        var link = await page.$eval(searchLinkSelector, anchor => anchor.getAttribute('href'));
        await browser.close();
        return link;
    }
    catch
    {
        await browser.close();
        console.log('ERROR!')
        return 0;
    };

}
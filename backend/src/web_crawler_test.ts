// import https from 'https'
// import http from 'http'
// import scrapeBibleChapterFromBibleHubPage from './helpers/scrape_verses_from_bible_gateway_page'

// const args = process.argv.slice(2)
// if (!args.length)
//   process.exit(1)

// console.log(args)

// const options: http.RequestOptions = {
//   hostname: 'www.biblegateway.com',
//   path: encodeURI(`/passage/?search=${args[0]} ${args[1]}&version=NKJV`),
//   method: 'GET',
//   headers: {
//     'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:97.0) Gecko/20100101 Firefox/97.0',
//     'Accept':
//       'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
//     'Accept-Language': 'en-US,en;q=0.5',
//     'Referer': 'https://www.google.co.za',
//     'Upgrade-Insecure-Requests': '1',
//   }
// }

// const req = https.request(options, res => {
//   console.log('here')
//   let b = Buffer.alloc(0)
//   res.on('data', chunk => {
//     console.log('chunk: ', chunk)
//     b = Buffer.concat([b, chunk])
//   })

//   res.on('close', () => {
//     const html = b.toString()
//     const verses = scrapeBibleChapterFromBibleHubPage(html)
//     // verses.forEach((v, i) => console.log(`${i}: ${v.verse}`))
//   })

//   res.on('error', err => {
//     console.log(err)
//   })
// })

// req.end()

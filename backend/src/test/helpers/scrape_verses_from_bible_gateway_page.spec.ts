// import { expect, assert } from 'chai'
// import fs from 'fs'
// import scrapeVersesFromPage from '../../helpers/scrape_verses_from_bible_gateway_page'
// import { option as O } from 'fp-ts'
// import { pipe } from 'fp-ts/function'

// describe('scrapeVersesFromPage', () => {
//   const dir = __dirname
//   const testPage = fs.readFileSync(dir + '/bible_gateway_test_page.html').toString()

//   it('returns the correct verse', () => {
//     // Arrange
//     pipe(
//       // Act
//       scrapeVersesFromPage(testPage),
//       O.match(
//         () => assert.fail('Did not return a result'),
//         // Assert
//         verses => {
//           expect(verses).to.have.length(5)
//           expect(verses[0]).to.eql('Shout with joy to the Lord, all the earth!')
//         }
//       )
//     )
//   })
// })

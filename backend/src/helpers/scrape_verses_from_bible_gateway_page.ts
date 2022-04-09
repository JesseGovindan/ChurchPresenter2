// import parseHtml, { HTMLElement, valid } from 'node-html-parser'
// import { option as O, boolean as B } from 'fp-ts'
// import { pipe } from 'fp-ts/lib/function'

// const scrapeVersesFromPage = (page: string) => pipe(
//   valid(page),
//   B.match(
//     () => O.none,
//     () => pipe(
//       parseHtml(page),
//       findPassageContent,
//       O.map(passage => pipe(
//         removeSuperflousTags(passage),
//         extractVerses
//       ))
//     )
//   )
// )

// const findPassageContent = (dom: HTMLElement) =>
//   O.fromNullable(dom.querySelector('.passage-content'))

// const removeSuperflousTags = (dom: HTMLElement) => {
//   ['h1', 'h2', 'h3', 'h4', 'sup', '.chapternum'].forEach(removeTags(dom))

//   return dom.querySelectorAll('.text').filter(d => {
//     return /text.*\d/.test(d.classNames)
//   })
// }

// const removeTags = (dom: HTMLElement) => (tagName: string) => {
//   dom.querySelectorAll(tagName).forEach(element => element.remove())
// }

// const extractVerses = (verseElements: HTMLElement[]) => {
//   const result: string[] = []
//   verseElements.forEach(verse => {
//     const verseNum = parseInt(verse.classNames.substring(verse.classNames.lastIndexOf('-') + 1)) - 1
//     if (result[verseNum]) {
//       result[verseNum] = (result[verseNum] + ' ' + verse.text).trim()
//     } else {
//       result[verseNum] = verse.text
//     }
//   })
//   return result
// }

// export default scrapeVersesFromPage

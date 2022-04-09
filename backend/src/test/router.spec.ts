// import { test } from 'mocha'
// import { expect } from 'chai'
// import http from 'http'
// import { io as IO, identity as I, option as O } from 'fp-ts'
// import supertest from 'supertest'

// import { 
//   asJsonResponse,
//   createRouter,
//   getField,
//   asNumber,
//   addToRouter,
// } from '../router'
// import { pipe } from 'fp-ts/lib/function'


// describe('router', () => {
//   const router = pipe(
//     createRouter,
//     IO.chainFirst(addToRouter('get')('/api/jsonResponse')((_, res) => pipe(
//       ['a', 'b'],
//       asJsonResponse(res)
//     ))),
//     IO.chainFirst(addToRouter('get')('/api/returnsHeaders')((req, res) => pipe(
//       req.headers,
//       asJsonResponse<http.IncomingHttpHeaders>(res)
//     )))
//   )()

//   it('creates GET route', async () => {
//     // Arange
//     // Act
//     const response = await supertest(router).get('/api/jsonResponse')

//     // Assert
//     expect(response.status).to.eql(200)
//     expect(response.body).to.eql(['a', 'b'])
//   })

//   it('passes headers to handler', async () => {
//     // Arange
//     // Act
//     const response = await supertest(router)
//       .get('/api/returnsHeaders')
//       .set('x-test-header', 'feefiefoe')
    
//     // Assert
//     expect(response.status).to.eql(200)
//     expect(response.body['x-test-header']).to.eql('feefiefoe')
//   })
// })

// test('getField extracts the parameter by name and type', () => {
//   // Arrange
//   const query: Record<string, string> = { a: '1', b: 'false' }
//   // Act
//   const result = pipe(
//     I.Do,
//     I.bind('a', _ => pipe(getField('a')(query), O.chain(asNumber))),
//     I.bind('b', _ => pipe(getField('b')(query), O.chain(asNumber))),
//     I.bind('c', _ => pipe(getField('c')(query), O.chain(asNumber))),
//   )
//   // Assert
//   expect(result).to.deep.eq({ 
//     a: O.of(1),
//     b: O.none,
//     c: O.none,
//   })
// })

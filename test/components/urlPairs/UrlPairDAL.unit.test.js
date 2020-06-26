const {
  SHORTENED_PATH_SPACE,
  SHORTENED_PATH_LENGTH
} = require('../../../config').shortenConfig
const UrlPairDAL = require('../../../src/components/urlPairs/UrlPairDAL')

describe('[Unit][Component] UrlPairDAL', () => {
  const testCount = 50
  describe('[Function] getShortenedPath', () => {
    test(`Call ${testCount} times and validate format`, () => {
      for (let i = 0; i < testCount; i++) {
        // Act
        const shortenedPath = UrlPairDAL.getShortenedPath()
        // Assert
        expect(shortenedPath.length).toBe(SHORTENED_PATH_LENGTH)
        for (const char of shortenedPath) {
          expect(SHORTENED_PATH_SPACE.includes(char)).toBe(true)
        }
      }
    })
  })
})

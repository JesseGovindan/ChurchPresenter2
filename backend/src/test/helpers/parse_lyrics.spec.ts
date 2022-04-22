import { expect } from 'chai'
import _ from 'lodash'

import { parseLyrics } from '../../helpers/parse_lyrics'

describe('parseLyrics', () => {
  /* eslint-disable */
  const lyrics = `<?xml version='1.0' encoding='UTF-8'?>
  <song version="1.0"><lyrics><verse label="1" type="v"><![CDATA[You came to the world You created  
    Trading Your crown for a cross ]]></verse><verse label="1" type="v"><![CDATA[You willingly died  
      Your innocent life paid the cost]]></verse><verse label="2" type="v"><![CDATA[Counting Your status as nothing  
    The King of all kings came to serve  ]]></verse><verse label="2" type="v"><![CDATA[Washing my feet  
    Covering me with Your love]]></verse><verse label="1" type="c"><![CDATA[If more of You means less of me  
    Take everything  ]]></verse><verse label="1" type="c"><![CDATA[Yes, all of You is all I need  
    Take everything]]></verse><verse label="3" type="v"><![CDATA[You are my life and my treasure  
    The One that I can’t live without  ]]></verse><verse label="3" type="v"><![CDATA[Here at Your feet 
    My desires and dreams, I lay down  ]]></verse><verse label="3" type="v"><![CDATA[Here at Your feet  
    My desires and dreams, I lay down]]></verse><verse label="1" type="c"><![CDATA[If more of You means less of me  
    Take everything  ]]></verse><verse label="1" type="c"><![CDATA[Yes, all of You is all I need  
    Take everything]]></verse><verse label="1" type="c"><![CDATA[If more of You means less of me  
    Take everything  ]]></verse><verse label="1" type="c"><![CDATA[Yes, all of You is all I need  
    Take everything]]></verse><verse label="1" type="b"><![CDATA[Oh Lord  
    Change me like only You can ]]></verse><verse label="1" type="b"><![CDATA[Here with my heart in Your hands  
    Father, I pray make me more like Jesus  ]]></verse><verse label="1" type="b"><![CDATA[This world 
    Is dying to know who You are  ]]></verse><verse label="1" type="b"><![CDATA[You’ve shown us the way to Your heart  
    Father, I pray make me more like Jesus  ]]></verse><verse label="1" type="b"><![CDATA[Oh Lord  
    Change me like only You can ]]></verse><verse label="1" type="b"><![CDATA[Here with my heart in Your hands  
    Father, I pray make me more like Jesus  ]]></verse><verse label="1" type="b"><![CDATA[This world 
    Is dying to know who You are  ]]></verse><verse label="1" type="b"><![CDATA[You’ve shown us the way to Your heart  
    Father, I pray make me more like Jesus  ]]></verse>
    <verse label="1" type="e"><![CDATA[More like Jesus]]></verse>
    <verse label="1" type="c"><![CDATA[If more of You means less of me  
    Take everything  ]]></verse><verse label="1" type="c"><![CDATA[Yes, all of You is all I need  
    Take everything]]></verse><verse label="1" type="c"><![CDATA[If more of You means less of me  
    Take everything  ]]></verse><verse label="1" type="c"><![CDATA[Yes, all of You is all I need  
    Take everything]]></verse></lyrics></song>`;
  /* eslint-enable */

  const singleVerseLyrics = 
      `<?xml version='1.0' encoding='UTF-8'?>
    <song version="1.0"><lyrics><verse label="1" type="v"><![CDATA[Let it rain
      Let it rain
      Open the floodgates
      Of heaven]]></verse></lyrics></song>`

  it('parses the correct number of slides', () => {
    // Arrange - Act
    const slides = parseLyrics(lyrics)
    // Assert
    expect(slides).to.have.length(26)
  })

  it('parses the correct number of slides', () => {
    // Arrange - Act
    const slides = parseLyrics(lyrics)
    // Assert
    expect(slides[0].text).to.eql(
      `You came to the world You created\nTrading Your crown for a cross`)
    expect(slides[10].text).to.eql(`Yes, all of You is all I need\nTake everything`)
  })

  it('sets the heading to the correct song section', () => {
    // Arrange - Act
    const slides = parseLyrics(lyrics)
    // Assert
    expect(slides[0].sectionName).to.eql('V1')
    expect(slides[19].sectionName).to.eql('B1')
  })

  it('parses single verse lyrics', () => {
    // Arrange - Act
    const slides = parseLyrics(singleVerseLyrics)
    // Assert
    expect(slides).to.have.length(1)
  })
})

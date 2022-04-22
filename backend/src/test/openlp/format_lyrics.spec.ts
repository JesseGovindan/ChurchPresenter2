import { expect } from 'chai'
import { formatLyrics, LyricSlide } from '../../openlp/format_lyrics'
import { getFileName } from '../get_file_name'

describe(getFileName(__filename), () => {
  it('converts lyrics to correct openlp xml format', () => {
    // Arrange
    const lyrics: LyricSlide[] = [{
      lyrics: `Akekho o fana no Jesu
Akekho o fana naye`,
      type: 'v',
      label: '1',
    }, {
      lyrics: `Siya hamba, hamba
Lutho, lutho`,
      type: 'c',
      label: '2',
    }]
    // Act
    const { xml } = formatLyrics(lyrics)
    // Assert
    // eslint-disable-next-line
    expect(xml).to.eql(`<?xml version='1.0' encoding='UTF-8'?><song version="1.0"><lyrics><verse label="1" type="v"><![CDATA[Akekho o fana no Jesu
Akekho o fana naye]]></verse><verse label="2" type="c"><![CDATA[Siya hamba, hamba
Lutho, lutho]]></verse></lyrics></song>`)
  })

  it('converts lyrics to correct search lyrics', () => {
    // Arrange
    const lyrics: LyricSlide[] = [{
      lyrics: `Akekho o fana no Jesu
Akekho o fana naye`,
      type: 'v',
      label: '1',
    }, {
      lyrics: `Siya hamba, hamba
Lutho, lutho`,
      type: 'c',
      label: '2',
    }]
    // Act
    const { searchLyrics } = formatLyrics(lyrics)
    // Assert
    // eslint-disable-next-line
    expect(searchLyrics).to.eql('akekho o fana no jesu akekho o fana naye siya hamba hamba lutho lutho')
  })
})

import React from 'react'
import PropTypes from 'prop-types'

const YoutubeEmbed = ({ embedId }) => (
  <div className='youtube-video overflow-hidden pb-56% relative h-0'>
    <iframe
      width='853'
      height='480'
      src={`https://www.youtube.com/embed/${embedId}`}
      frameBorder='0'
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      allowFullScreen
      title='Embedded youtube'
      className='left-0 top-0 h-full w-full absolute'
    />
    <style jsx>{`
      .youtube-video {
        padding-bottom: 56.25%;
      }
    `}</style>
  </div>
)

YoutubeEmbed.propTypes = {
  embedId: PropTypes.string.isRequired,
}

export default YoutubeEmbed

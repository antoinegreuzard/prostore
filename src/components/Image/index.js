import React from 'react'
import Image from 'next/image'
import useDarkMode from 'use-dark-mode'
import PropTypes from 'prop-types'

function ImageApp({
  className,
  src,
  srcDark,
  alt,
  size,
  priority,
}) {
  const darkMode = useDarkMode(false)
  const newSize = {
    width: size.width.replace('px', ''),
    height: size.height.replace('px', ''),
  }

  if (!Number.isInteger(newSize.width)) {
    newSize.width = '1000'
  }
  if (!Number.isInteger(newSize.height)) {
    newSize.height = '1000'
  }

  return (
    <div className={className} style={{ ...size, position: 'relative' }}>
      <Image
        src={darkMode.value && srcDark ? srcDark : src}
        alt={alt}
        width={newSize.width} // Replace with actual width
        height={newSize.height} // Replace with actual height
        style={{
          objectFit: 'cover',
          width: size.width,
          height: size.height,
        }}
        {...priority}
      />
    </div>
  )
}

ImageApp.propTypes = {
  className: PropTypes.string,
  src: PropTypes.string,
  srcDark: PropTypes.string,
  alt: PropTypes.string,
  priority: PropTypes.string,
  size: PropTypes.shape({
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
}

ImageApp.defaultProps = {
  className: '',
  src: '',
  srcDark: '',
  alt: '',
  priority: '',
  size: { width: 'auto', height: 'auto' },
}

export default ImageApp

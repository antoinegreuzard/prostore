import React from 'react';
import Image from 'next/image';
import useDarkMode from 'use-dark-mode';
import PropTypes from 'prop-types';

function ImageApp({
  className,
  src,
  srcDark,
  alt,
  size,
  priority,
  objectFit = 'contain',
}) {
  const darkMode = useDarkMode(false);

  return (
    <div className={className} style={{ ...size, position: 'relative' }}>
      <Image
        src={darkMode.value && srcDark ? srcDark : src}
        alt={alt}
        layout="fill"
        quality={60}
        objectFit={objectFit}
        placeholder="blur"
        blurDataURL={`${src}?auto=format,compress&q=1&blur=500&w=2`}
        priority={priority}
      />
    </div>
  );
}

ImageApp.propTypes = {
  className: PropTypes.string,
  src: PropTypes.string,
  srcDark: PropTypes.string,
  alt: PropTypes.string,
  priority: PropTypes.string,
  objectFit: PropTypes.string.isRequired,
  size: PropTypes.shape({
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
};

ImageApp.defaultProps = {
  className: '',
  src: '',
  srcDark: '',
  alt: '',
  priority: '',
  size: { width: 'auto', height: 'auto' },
};

export default ImageApp;

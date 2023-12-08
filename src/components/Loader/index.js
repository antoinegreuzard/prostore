import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './Loader.module.sass';

function Loader({ className, color }) {
  return (
    <div
      className={cn(styles.loader, className, {
        [styles.loaderWhite]: color === 'white',
      })}
    />
  );
}

Loader.propTypes = {
  className: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default Loader;

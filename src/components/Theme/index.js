import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import useDarkMode from 'use-dark-mode';
import styles from './Theme.module.sass';

function Theme({ className }) {
  const darkMode = useDarkMode(false);

  return (
    <label
      htmlFor="toggle-dark-mode"
      className={cn(styles.theme, {
        [styles.theme]: className === 'theme',
        [styles.themeBig]: className === 'theme-big',
      })}
    >
      <input
        className={styles.input}
        id="toggle-dark-mode"
        checked={darkMode.value}
        onChange={darkMode.toggle}
        type="checkbox"
      />
      <span className={styles.inner}>
        <span className={styles.box} />
      </span>
    </label>
  );
}

Theme.propTypes = {
  className: PropTypes.string,
};

Theme.defaultProps = {
  className: '',
};

export default Theme;

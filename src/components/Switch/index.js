import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './Switch.module.sass';

function Switch({ className, value, setValue }) {
  return (
    <label className={cn(styles.switch, className)} htmlFor="switch-input">
      <input
        id="switch-input" // add an id to the input
        className={styles.input}
        type="checkbox"
        checked={value}
        onChange={() => setValue(!value)}
      />
      <span className={styles.inner}>
        <span className={styles.box} />
      </span>
    </label>
  );
}

Switch.propTypes = {
  className: PropTypes.string,
  value: PropTypes.bool,
  setValue: PropTypes.func,
};

Switch.defaultProps = {
  className: '',
  value: false,
  setValue: PropTypes.func,
};

export default Switch;

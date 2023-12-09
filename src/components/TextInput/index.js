import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './TextInput.module.sass';

function TextInput({ className, label, ...props }) {
  return (
    <div className={cn(styles.field, className)}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.wrap}>
        <input className={styles.input} {...props} />
      </div>
    </div>
  );
}

TextInput.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
};

TextInput.defaultProps = {
  className: '',
  label: '',
};

export default TextInput;

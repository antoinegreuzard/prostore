import React, { useState } from 'react';
import cn from 'classnames';
import OutsideClickHandler from 'react-outside-click-handler';
import PropTypes from 'prop-types';
import styles from './Dropdown.module.sass';
import Icon from '../Icon';

function Dropdown({
  className, value, setValue, options,
}) {
  const [visible, setVisible] = useState(false);

  const handleClick = (valueClick) => {
    setValue(valueClick);
    setVisible(false);
  };

  return (
    <OutsideClickHandler onOutsideClick={() => setVisible(false)}>
      <div
        className={cn(styles.dropdown, className, { [styles.active]: visible })}
      >
        <div
          className={styles.head}
          onClick={() => setVisible(!visible)}
          onKeyPress={() => setVisible(!visible)}
          role="button"
          tabIndex={0}
        >
          <div className={styles.selection}>{value}</div>
          <div className={styles.arrow}>
            <Icon name="arrow-bottom" size="10" />
          </div>
        </div>
        <div className={styles.body}>
          {options.map((x, index) => (
            <div
              className={cn(styles.option, {
                [styles.selectioned]: x === value,
              })}
              onClick={() => handleClick(x, index)}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  handleClick(x, index); // to satisfy jsx-a11y/click-events-have-key-events
                }
              }}
              key={x}
              tabIndex={0}
              role="button"
            >
              {x}
            </div>
          ))}
        </div>
      </div>
    </OutsideClickHandler>
  );
}

Dropdown.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  setValue: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.string),
};

Dropdown.defaultProps = {
  className: '',
  value: '',
  setValue: '',
  options: PropTypes.arrayOf(''),
};

export default Dropdown;

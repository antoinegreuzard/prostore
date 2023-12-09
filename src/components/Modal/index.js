import React, { useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import OutsideClickHandler from 'react-outside-click-handler';
import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './Modal.module.sass';
import Icon from '../Icon';

function Modal({
  outerClassName,
  containerClassName,
  visible,
  onClose,
  children,
  disable,
}) {
  const escFunction = useCallback(
    (e) => {
      if (e.keyCode === 27) {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (typeof window === 'object' && !disable) {
      document.addEventListener('keydown', escFunction, false);
    }

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [escFunction, disable]);

  return typeof window !== 'undefined' && visible
    ? createPortal(
      <div className={styles.modal}>
        <div className={cn(styles.outer, outerClassName)}>
          <OutsideClickHandler onOutsideClick={disable ? () => {} : onClose}>
            <div className={cn(styles.container, containerClassName)}>
              {children}
              {!disable && (
              <button className={styles.close} onClick={onClose} type="button">
                <Icon name="close" size="14" />
              </button>
              )}
            </div>
          </OutsideClickHandler>
        </div>
      </div>,
      typeof window === 'object' && document.body,
    )
    : null;
}

Modal.propTypes = {
  outerClassName: PropTypes.string,
  containerClassName: PropTypes.string,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node.isRequired,
  disable: PropTypes.bool,
};

Modal.defaultProps = {
  outerClassName: '',
  containerClassName: '',
  visible: false,
  onClose: () => {},
  disable: false,
};

export default Modal;

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { useRouter } from 'next/router';
import OutsideClickHandler from 'react-outside-click-handler';
import Image from '../../Image';
import styles from './User.module.sass';
import Icon from '../../Icon';
import { removeToken } from '../../../utils/token';
import { useStateContext } from '../../../utils/context/StateContext';

function User({ className, user }) {
  const { setCosmicUser } = useStateContext();

  const [visible, setVisible] = useState(false);
  const { push } = useRouter();

  const items = [
    {
      title: 'Déconnexion',
      icon: 'exit',
      callback: () => {
        setCosmicUser({});
        push('/');
        removeToken();
      },
    },
  ];

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setVisible(!visible);
    }
  };

  return (
    <OutsideClickHandler onOutsideClick={() => setVisible(false)}>
      <div className={cn(styles.user, className)}>
        <div
          className={styles.head}
          onClick={() => setVisible(!visible)}
          role="button"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          <Image
            className={styles.avatar}
            size={{ width: '32px', height: '32px' }}
            src={user?.avatar_url || '/images/content/avatar.png'}
            alt="Avatar"
            objectFit="cover"
          />
          <div className={styles.wallet}>{user?.first_name || 'User'}</div>
        </div>
        {visible && (
          <div className={styles.body}>
            <div className={styles.menu}>
              {items.map((x) => (
                <div
                  className={styles.item}
                  key={x.title}
                  onClick={x.callback ? x.callback : () => {}}
                  role="button"
                  tabIndex={0}
                  onKeyDown={handleKeyDown}
                >
                  <div className={styles.icon}>
                    <Icon name={x.icon} size="20" />
                  </div>
                  <div className={styles.text}>{x.title}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
}

User.propTypes = {
  className: PropTypes.string,
  user: PropTypes.shape({
    avatar_url: PropTypes.string,
    first_name: PropTypes.string,
  }),
};

User.defaultProps = {
  className: '',
  user: PropTypes.shape({
    avatar_url: '',
    first_name: '',
  }),
};

export default User;

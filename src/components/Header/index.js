import React, { useState, useEffect, useCallback } from 'react';
import cn from 'classnames';
import Image from 'next/image';
import PropTypes from 'prop-types';
import AppLink from '../AppLink';
import Icon from '../Icon';
import User from './User';
import Modal from '../Modal';
import OAuth from '../OAuth';
import { useStateContext } from '../../utils/context/StateContext';
import { getToken } from '../../utils/token';

import styles from './Header.module.sass';

function Headers({ navigation }) {
  const [visibleNav, setVisibleNav] = useState(false);
  const [visibleAuthModal, setVisibleAuthModal] = useState(false);

  const { cosmicUser, setCosmicUser } = useStateContext();

  const handleOAuth = useCallback(
    (user) => {
      if (!cosmicUser.hasOwnProperty('id') && user?.hasOwnProperty('id')) {
        setCosmicUser(user);
      }
    },
    [cosmicUser, setCosmicUser],
  );

  useEffect(() => {
    let isMounted = true;
    const uNFTUser = getToken();

    if (
      isMounted
      && !cosmicUser?.hasOwnProperty('id')
      && uNFTUser?.hasOwnProperty('id')
    ) {
      setCosmicUser(uNFTUser);
    }

    return () => {
      isMounted = false;
    };
  }, [cosmicUser, setCosmicUser]);

  return (
    <>
      <header className={styles.header}>
        <div className={cn('container', styles.container)} aria-hidden="true">
          <AppLink className={styles.logo} href="/">
            <Image
              width={50}
              height={50}
              className={styles.pic}
              src={navigation.logo?.imgix_url}
              alt="Logo"
              priority
            />
          </AppLink>
          <div className={cn(styles.wrapper, { [styles.active]: visibleNav })}>
            <nav className={styles.nav}>
              {navigation.menu?.map((x, index) => (
                <AppLink
                  aria-label="navigation"
                  className={styles.link}
                  href={x?.url || '/search'}
                  key={x.id || index}
                >
                  {x.title}
                </AppLink>
              ))}
            </nav>
          </div>
          <AppLink
            aria-label="search"
            aria-hidden="true"
            className={cn('button-small', styles.button)}
            href="/search"
          >
            <Icon name="search" size="20" />
            Rechercher
          </AppLink>
          {cosmicUser?.id ? (
            <User className={styles.user} user={cosmicUser} />
          ) : (
            <button
              aria-label="login"
              aria-hidden="true"
              type="button"
              className={cn('button-small', styles.button, styles.login)}
              onClick={() => setVisibleAuthModal(true)}
            >
              Se connecter pour vendre
            </button>
          )}
          <button
            aria-label="user-information"
            aria-hidden="true"
            type="button"
            className={cn(styles.burger, { [styles.active]: visibleNav })}
            onClick={() => setVisibleNav(!visibleNav)}
          />
        </div>
      </header>
      <Modal
        visible={visibleAuthModal}
        onClose={() => setVisibleAuthModal(false)}
      >
        <OAuth
          className={styles.steps}
          handleOAuth={handleOAuth}
          handleClose={() => setVisibleAuthModal(false)}
        />
      </Modal>
    </>
  );
}

Headers.propTypes = {
  navigation: PropTypes.shape({
    logo: PropTypes.shape({
      imgix_url: PropTypes.string,
    }),
    menu: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
    })),
  }),
};

Headers.defaultProps = {
  navigation: PropTypes.shape({
    logo: PropTypes.shape({
      imgix_url: '',
    }),
    menu: PropTypes.arrayOf(PropTypes.shape({
      title: '',
      url: '',
    })),
  }),
};

export default Headers;

import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import AppLink from '../AppLink';
import Group from './Group';
import Theme from '../Theme';
import Image from '../Image';
import SocialMedia from '../SocialMedia';

import styles from './Footer.module.sass';

function Footers({ navigation }) {
  return (
    <footer className={styles.footer}>
      <div className={cn('container', styles.container)}>
        <div className={styles.row}>
          <div className={styles.col} aria-hidden="true">
            <AppLink className={styles.logo} href="/">
              <Image
                size={{ width: '92px', height: '92px' }}
                className={styles.pic}
                src={navigation.logo?.imgix_url}
                srcDark={navigation.logo?.imgix_url}
                alt="Logo"
                objectFit="contain"
              />
            </AppLink>
            <div className={styles.info}>Marché de Noël EDS du campus de Lyon</div>
            <div className={styles.version}>
              <div className={styles.details}>Mode sombre</div>
              <Theme className="theme-big" />
            </div>
          </div>
          <div className={styles.col}>
            <Group className={styles.group} />
          </div>
          <div className={styles.col}>
            <p className={styles.category}>Réseaux : Les Clampins</p>
            <SocialMedia className={styles.form} />
          </div>
        </div>
      </div>
    </footer>
  );
}

Footers.propTypes = {
  navigation: PropTypes.shape({
    logo: PropTypes.shape({
      imgix_url: PropTypes.string,
    }),
  }),
};

Footers.defaultProps = {
  navigation: PropTypes.shape({
    logo: PropTypes.shape({
      imgix_url: '',
    }),
  }),
};

export default Footers;

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Header from '../Header';
import Footer from '../Footer';
import { useStateContext } from '../../utils/context/StateContext';

import styles from './Layout.module.sass';
import { Meta, PageMeta } from '../Meta';

function Layout({ children, navigationPaths }) {
  const { navigation, setNavigation } = useStateContext();

  useEffect(() => {
    let isMounted = true;

    if (
      !navigation?.hasOwnProperty('menu')
      && navigationPaths?.hasOwnProperty('menu')
      && isMounted
    ) {
      setNavigation(navigationPaths);
    }

    return () => {
      isMounted = false;
    };
  }, [navigation, navigationPaths, setNavigation]);

  return (
    <>
      <Meta />
      <PageMeta
        title="Marché de Noël EDS du campus de Lyon"
        description="Marché de Noël EDS du campus de Lyon"
      />
      <div className={styles.page}>
        <Header navigation={navigationPaths || navigation} />
        <main className={styles.inner}>{children}</main>
        <Footer navigation={navigationPaths || navigation} />
      </div>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  navigationPaths: PropTypes.shape({
    menu: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })),
  }),
};

Layout.defaultProps = {
  navigationPaths: {},
};

export default Layout;

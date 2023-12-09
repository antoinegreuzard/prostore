import { Toaster } from 'react-hot-toast';
import PropTypes from 'prop-types';
import { StateContext } from '../utils/context/StateContext';

import '../styles/app.sass';

function MyApp({ Component, pageProps }) {
  return (
    <StateContext>
      <Toaster />
      <Component {...pageProps} />
    </StateContext>
  );
}

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.shape({
  }).isRequired,
};

export default MyApp;

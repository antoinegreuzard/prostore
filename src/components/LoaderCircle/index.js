import React from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import styles from './LoaderCircle.module.sass'

function Loader({ className }) {
  return <div className={cn(styles.loader, className)} />
}

Loader.propTypes = {
  className: PropTypes.string,
}

Loader.defaultProps = {
  className: '',
}

export default Loader

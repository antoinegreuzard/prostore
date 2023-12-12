import PropTypes from 'prop-types'

function Error({ statusCode }) {
  let message
  if (statusCode) {
    message = `Une erreur ${statusCode} s'est produite sur le serveur`
  } else {
    message = 'Une erreur s’est produite sur le client'
  }

  return <p>{message}</p>
}

Error.getInitialProps = ({ res, err }) => {
  let codeStatut
  if (res) {
    codeStatut = res.statusCode
  } else if (err) {
    codeStatut = err.statusCode
  } else {
    codeStatut = 404
  }
  return { codeStatut }
}

Error.propTypes = {
  statusCode: PropTypes.number,
}

Error.defaultProps = {
  statusCode: null,
}

export default Error

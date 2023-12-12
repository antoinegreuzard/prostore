import Link from 'next/link'
import PropTypes from 'prop-types'

function AppLink({ href, className, children }) {
  const isExternalLink = href?.startsWith('http')

  if (isExternalLink) {
    // Pour les liens externes, utilisez directement une balise <a>
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-hidden="true"
      >
        {children}
      </a>
    )
  }
  // Pour les liens internes, utilisez le composant <Link> de Next.js
  return (
    <Link href={href} className={className} aria-hidden="true">
      {children}
    </Link>
  )
}

AppLink.propTypes = {
  href: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
}

AppLink.defaultProps = {
  className: '',
}

export default AppLink

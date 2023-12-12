import React from 'react'
import { useRouter } from 'next/router'
import cn from 'classnames'
import Image from 'next/image'
import PropTypes from 'prop-types'
import Layout from '../components/Layout'
import chooseBySlug from '../utils/chooseBySlug'
import { getAllDataByType } from '../lib/cosmic'

import styles from '../styles/pages/NotFound.module.sass'
import { PageMeta } from '../components/Meta'

function AboutUs({ navigationItems, landing }) {
  const { push } = useRouter()

  const handleClick = (href) => {
    push(href)
  }

  const infoAbout = chooseBySlug(landing, 'about')

  return (
    <Layout navigationPaths={navigationItems[0]?.metadata}>
      <PageMeta
        title="Présentation | Marché de Noël EDS du campus de Lyon"
        description="Marché de Noël EDS du campus de Lyon"
      />
      <div className={cn('section', styles.section)}>
        <div className={cn('container', styles.container)}>
          <div className={styles.wrap}>
            <div className={styles.heroWrapper}>
              <Image
                width={400}
                height={400}
                src={infoAbout?.metadata?.image?.imgix_url}
                alt="Figures"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                priority
              />
            </div>
            <h2 className={cn('h2', styles.title)}>
              {infoAbout?.metadata?.title}
            </h2>
            <h3 className={styles.info}>{infoAbout?.metadata?.subtitle}</h3>
            <p className={styles.info}>{infoAbout?.metadata?.description}</p>
            <button
              type="button"
              onClick={() => handleClick('/search')}
              className={cn('button-stroke', styles.form)}
            >
              Rechercher un cadeau
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

AboutUs.propTypes = {
  navigationItems: PropTypes.arrayOf(PropTypes.shape({
    metadata: PropTypes.shape({
    }),
  })),
  landing: PropTypes.arrayOf(PropTypes.shape({
  })),
}

AboutUs.defaultProps = {
  navigationItems: [],
  landing: [],
}

export default AboutUs

export async function getServerSideProps() {
  const navigationItems = (await getAllDataByType('navigation')) || []
  const landing = (await getAllDataByType('landings')) || []

  return {
    props: { navigationItems, landing },
  }
}

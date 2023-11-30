import React, { useState } from 'react'
import cn from 'classnames'
import AppLink from '../AppLink'
import Group from './Group'
import Theme from '../Theme'
import Image from '../Image'
import SocialMedia from '../SocialMedia'

import styles from './Footer.module.sass'

const Footers = ({ navigation }) => {
  return (
    <footer className={styles.footer}>
      <div className={cn('container', styles.container)}>
        <div className={styles.row}>
          <div className={styles.col} aria-hidden="true">
            <AppLink className={styles.logo} href="/">
              <Image
                size={{ width: '92px', height: '92px' }}
                className={styles.pic}
                src={navigation['logo']?.imgix_url}
                srcDark={navigation['logo']?.imgix_url}
                alt="Logo"
                objectFit="cntain"
              />
            </AppLink>
            <div className={styles.info}>Marché de Noël EDS du campus de Lyon</div>
            <div className={styles.version}>
              <div className={styles.details}>Mode sombre</div>
              <Theme className="theme-big" />
            </div>
          </div>
          <div className={styles.col}>
            <Group className={styles.group} item={navigation?.['menu']} />
          </div>
          <div className={styles.col}>
            <AppLink href={`https://www.cosmicjs.com/features`}>
              <p className={styles.category}>Réseaux Epitech Digital School</p>
            </AppLink>
            <SocialMedia className={styles.form} />
          </div>
        </div>
      </div>  
    </footer>
  )
}

export default Footers

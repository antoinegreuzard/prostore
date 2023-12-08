import React from 'react';
import cn from 'classnames';
import Image from '../../../components/Image';
import styles from './Preview.module.sass';
import Icon from '../../../components/Icon';

function Preview({
  className, onClose, info, image,
}) {
  return (
    <div className={cn(className, styles.wrap)}>
      <div className={styles.inner}>
        <button className={styles.close} onClick={onClose}>
          <Icon name="close" size="14" />
        </button>
        <div className={styles.info}>Prévisualiser</div>
        <div className={styles.card}>
          <div className={styles.preview}>
            <Image
              size={{ width: '100%', height: '100%' }}
              srcSet={image || '/images/content/upload-pic.jpg'}
              src={image || '/images/content/upload-pic.jpg'}
              alt="Card"
              objectFit="cover"
            />
          </div>
          <div className={styles.link}>
            <div className={styles.body}>
              <div className={styles.line}>
                <div className={styles.title}>{info?.title}</div>
                <div className={styles.price}>
                  {info?.price}
                  {' '}
                  €
                </div>
              </div>
              <div className={styles.line}>
                <div className={styles.counter}>
                  {info?.count}
                  {' '}
                  en stock
                </div>
              </div>
            </div>
            <div className={styles.foot}>
              <div className={styles.status}>
                <Icon name="candlesticks-up" size="20" />
                Prix
                {' '}
                <span>
                  {info?.price}
                  {' '}
                  €
                </span>
              </div>
              <div className={styles.bid}>
                Nouveau cadeau
                <span role="img" aria-label="fire">
                  🔥
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preview;

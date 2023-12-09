import React from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';
import Image from 'next/image';

import styles from './Description.module.sass';

function Description({ info }) {
  const { push } = useRouter();

  const handleClick = (href) => {
    push(href);
  };

  return (
    <div className={styles.section}>
      <div className={cn('container', styles.container)}>
        <div className={styles.wrap}>
          <div className={styles.stage}>{info?.metadata?.subtitle}</div>
          <h1 className={cn('h1', styles.title)}>{info?.metadata?.title}</h1>
          <div className={styles.text}>{info?.metadata?.description}</div>
          <div className={styles.btns}>
            <button
              aria-hidden="true"
              type="button"
              onClick={() => handleClick('/search')}
              className={cn('button-stroke', styles.button)}
            >
              Rechercher un cadeau
            </button>
            <button
              type="button"
              aria-hidden="true"
              onClick={() => handleClick('/upload-details')}
              className={cn('button', styles.button)}
            >
              Publier un cadeau
            </button>
          </div>
        </div>
        <div className={styles.gallery}>
          <div className={styles.heroWrapper}>
            <Image
              quality={60}
              className={styles.preview}
              layout="fill"
              src={info?.metadata?.image?.imgix_url}
              placeholder="blur"
              blurDataURL={`${info?.metadata?.image?.imgix_url}?auto=format,compress&q=1&blur=500&w=2`}
              objectFit="cover"
              alt={info?.metadata?.title}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Description;

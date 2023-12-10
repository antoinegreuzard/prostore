import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import AppLink from '../AppLink';
import styles from './Card.module.sass';
import Icon from '../Icon';
import Image from '../Image';

function Card({ className, item }) {
  return (
    <div className={cn(styles.card, className)} aria-hidden="true">
      <AppLink className={styles.link} href={`/item/${item?.slug}` || '/'}>
        <div className={styles.preview}>
          <Image
            size={{ width: '100%', height: '360px' }}
            src={item?.metadata?.image?.imgix_url}
            alt="Card"
          />
          <div className={styles.control}>
            <div className={styles.category}>{item?.title}</div>
            <button type="button" className={cn('button-small', styles.button)}>
              <span>{item?.metadata?.categories && item.metadata.categories.length > 0 ? `${item.metadata.categories[0].title}` : ''}</span>
              <Icon name="scatter-up" size="16" />
            </button>
          </div>
        </div>
        <div className={styles.foot}>
          <div className={styles.status}>
            <p>{item?.title}</p>
            <p className={styles.count}>
              {item?.metadata?.count > 0
                ? `${item?.metadata?.count} cadeau(x)`
                : 'Non disponible'}
            </p>
          </div>
          <div
            className={styles.bid}
          />
          <span className={styles.price}>{`${item?.metadata?.price} €`}</span>
        </div>
      </AppLink>
    </div>
  );
}

Card.propTypes = {
  className: PropTypes.string,
  item: PropTypes.shape({
    slug: PropTypes.string,
    metadata: PropTypes.shape({
      image: PropTypes.shape({
        imgix_url: PropTypes.string,
      }),
      categories: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string,
        }),
      ),
      count: PropTypes.number,
      price: PropTypes.number,
    }),
    title: PropTypes.string,
    count: PropTypes.string,
  }),
};

Card.defaultProps = {
  className: '',
  item: PropTypes.shape({
    slug: '',
    metadata: PropTypes.shape({
      image: PropTypes.shape({
        imgix_url: '',
      }),
      categories: PropTypes.arrayOf(
        PropTypes.shape({
          title: '',
        }),
      ),
      count: '',
      price: '',
    }),
    title: '',
    count: '',
  }),
};

export default Card;

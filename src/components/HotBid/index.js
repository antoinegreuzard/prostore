import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Slider from 'react-slick';
import Icon from '../Icon';
import Card from '../Card';

import styles from './HotBid.module.sass';

function SlickArrow({
  currentSlide, slideCount, children, ...props
}) {
  // Explicitly passing down necessary props
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <button type="button" aria-label="arrow" aria-hidden="true" {...props}>
      {children}
    </button>
  );
}

const settings = {
  infinite: true,
  speed: 700,
  slidesToShow: 4,
  slidesToScroll: 1,
  nextArrow: (
    <SlickArrow>
      <Icon name="arrow-next" size="14" />
    </SlickArrow>
  ),
  prevArrow: (
    <SlickArrow>
      <Icon name="arrow-prev" size="14" />
    </SlickArrow>
  ),
  responsive: [
    {
      breakpoint: 1179,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 1023,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 2,
        infinite: true,
      },
    },
  ],
};

function Hot({ classSection, info }) {
  return (
    <div className={cn(classSection, styles.section)}>
      <div className={cn('container', styles.container)}>
        <div className={styles.wrapper}>
          <h2 className={cn('h3', styles.title)}>Nos meilleurs cadeaux</h2>
          <div className={styles.inner}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Slider className="bid-slider" {...settings}>
              {info && info.length > 0 && info.map((item, index) => (
                // Replaced index with item.id or a unique identifier
                <Card key={item.id || index} className={styles.card} item={item} />
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
}

Hot.propTypes = {
  classSection: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  info: PropTypes.arrayOf(PropTypes.object),
};

Hot.defaultProps = {
  classSection: '',
  info: PropTypes.arrayOf(PropTypes.object),
};

export default Hot;

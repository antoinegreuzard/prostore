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
    <button type="button" aria-label="arrow" aria-hidden="true" {...props}>
      {children}
    </button>
  );
}

SlickArrow.propTypes = {
  currentSlide: PropTypes.number,
  slideCount: PropTypes.number,
  children: PropTypes.node,
};

SlickArrow.defaultProps = {
  currentSlide: 0,
  slideCount: 0,
  children: 0,
};

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
  info: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })),
};

Hot.defaultProps = {
  classSection: '',
  info: [],
};

export default Hot;

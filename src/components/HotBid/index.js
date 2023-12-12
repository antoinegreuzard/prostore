import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import Slider from 'react-slick'
import Icon from '../Icon'
import Card from '../Card'

import styles from './HotBid.module.sass'

function SlickArrow({
  currentSlide, slideCount, children, ...props
}) {
  return (
    <button type="button" aria-label="arrow" aria-hidden="true" {...props}>
      {children}
    </button>
  )
}

SlickArrow.propTypes = {
  currentSlide: PropTypes.number,
  slideCount: PropTypes.number,
  children: PropTypes.node,
}

SlickArrow.defaultProps = {
  currentSlide: 0,
  slideCount: 0,
  children: null,
}

function Hot({ classSection, info }) {
  // Filtrer les éléments dont le titre est 'Exemple'
  const filteredInfo = info.filter((item) => item.title !== 'Exemple')

  const isDuplicateNeeded = filteredInfo.length > 4
  const settings = {
    infinite: isDuplicateNeeded,
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 1,
    swipe: true,
    touchMove: true,
    swipeToSlide: true,
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
          infinite: isDuplicateNeeded,
        },
      },
    ],
  }

  return (
    <div className={cn(classSection, styles.section)}>
      <div className={cn('container', styles.container)}>
        <div className={styles.wrapper}>
          <h2 className={cn('h3', styles.title)}>Nos meilleurs cadeaux</h2>
          <div className={styles.inner}>
            <Slider className="bid-slider" {...settings}>
              {filteredInfo.length > 0 && filteredInfo.map((item, index) => (
                <Card key={item.id || index} className={styles.card} item={item} />
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  )
}

Hot.propTypes = {
  classSection: PropTypes.string,
  info: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
  })),
}

Hot.defaultProps = {
  classSection: '',
  info: [],
}

export default Hot

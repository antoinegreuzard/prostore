import React, { useState, useCallback, useEffect } from 'react'
import cn from 'classnames'
import { useRouter } from 'next/router'
import Slider from 'react-slick'
import useFetchData from '../../../utils/hooks/useFetchData'
import Icon from '../../../components/Icon'
import Card from '../../../components/Card'
import priceRange from '../../../utils/constants/priceRange'

import styles from './Discover.module.sass'

function SlickArrow({
  currentSlide, slideCount, children, ...props
}) {
  return (
    <button aria-label="arrow" aria-hidden="true" {...props} type="button">
      {children}
    </button>
  )
}

const settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 2,
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
      breakpoint: 767,
      settings: {
        slidesToShow: 1,
      },
    },
    {
      breakpoint: 100000,
      settings: 'unslick',
    },
  ],
}

function Discover({ info, type }) {
  const { push } = useRouter()
  const { fetchData } = useFetchData([])

  const [activeIndex] = useState(
    type ? Object.entries(type)[0]?.[0] : '',
  )
  const [visible] = useState(false)
  const [isLoad, setLoading] = useState(false)

  const [{ min, max }, setRangeValues] = useState(() => priceRange)

  const handleClick = (href) => {
    push(href)
  }

  const handleFilterDataByParams = useCallback(
    async () => {
      await fetchData('/api/filter')
    },
    [fetchData],
  )

  const handleChange = ({ target: { name, value } }) => {
    setRangeValues((prevFields) => ({
      ...prevFields,
      [name]: value,
    }))
  }

  const allProducts = info.reduce((acc, group) => {
    const products = Object.values(group)[0]
    return [...acc, ...products]
  }, [])

  const uniqueProductMap = {}
  const uniqueProducts = allProducts.filter((product) => {
    if (uniqueProductMap.hasOwnProperty(product.id)) {
      return false
    }
    uniqueProductMap[product.id] = true
    return true
  })

  useEffect(() => {
    if (!isLoad) {
      handleFilterDataByParams()
      setLoading(true)
    }
  }, [handleFilterDataByParams, isLoad])

  return (
    <div className={cn('section', styles.section)}>
      <div className={cn('container', styles.container)}>
        <div className={styles.head}>
          <div className={styles.stage}>
            Le marché de Noël des étudiants de Epitech Digital School Lyon
          </div>
          <div className={styles.header}>
            <h3 className={cn('h3', styles.title)}>Cadeaux disponibles</h3>
            <button
              type="button"
              onClick={() => handleClick(`/search?category=${activeIndex}`)}
              className={cn('button-stroke', styles.button)}
            >
              Rechercher un cadeau
            </button>
          </div>
        </div>
        <div className={cn(styles.filters, { [styles.active]: visible })}>
          <div className={styles.sorting}>
            <div className={styles.cell}>
              <div className={styles.label}>Price range</div>
              <div className={styles.prices}>
                <input
                  className={styles.input}
                  type="text"
                  value={min}
                  onChange={handleChange}
                  name="min"
                  placeholder="MIN"
                  required
                />
                <p className={styles.separator}>to</p>
                <input
                  className={styles.input}
                  type="text"
                  value={max}
                  onChange={handleChange}
                  name="max"
                  placeholder="MAX"
                  required
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.list}>
          <Slider
            aria-hidden="true"
            className={cn('discover-slider', styles.slider)}
            {...settings}
          >
            {uniqueProducts?.filter((product) => product.title !== 'Exemple').length ? (
              uniqueProducts?.filter((product) => product.title !== 'Exemple').map((product, index) => (
                <Card className={styles.card} item={product} key={index} />
              ))
            ) : (
              <p className={styles.inform}>Aucun produit disponible</p>
            )}
          </Slider>
        </div>
      </div>
    </div>
  )
}

export default Discover

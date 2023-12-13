import React from 'react'
import cn from 'classnames'
import Slider from 'react-slick'
import Link from 'next/link'
import styles from './Categories.module.sass'
import Icon from '../../../components/Icon'
import Image from '../../../components/Image'

function SlickArrow({
  currentSlide, slideCount, children, ...props
}) {
  return (
    <button aria-label="arrow" {...props} type="button">
      {children}
    </button>
  )
}

const settings = {
  infinite: false,
  speed: 500,
  slidesToShow: 3,
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
      breakpoint: 1023,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
}

function Categories({ info, type }) {
  return (
    <section className="section-bg">
      <div className={styles.section}>
        <div className={cn('container', styles.container)}>
          <div className={styles.wrapper}>
            <h3 className={cn('h3', styles.title)}>Nos meilleures catégories</h3>
            <div className={styles.inner}>
              <Slider className="collection-slider" {...settings}>
                {info?.length && info?.map((category) => (
                  Object.keys(category)
                    .filter((key) => !(category[key]?.length === 1 && category[key][0].title === 'Exemple'))
                    .map((key, index) => (
                      <Link
                        className={styles.item}
                        href={`/search?category=${key}` || '/'}
                        key={index}
                      >
                        <div className={styles.cart}>
                          <div className={styles.gallery}>
                            {category[key]
                              ?.filter((product) => product.title !== 'Exemple')
                              .slice(0, 7)
                              .map((intro, indexCat) => (
                                <div className={styles.preview} key={indexCat}>
                                  <Image
                                    size={{ width: '100%', height: '98px' }}
                                    src={intro?.metadata?.image?.imgix_url}
                                    alt="Catégorie"
                                  />
                                </div>
                              ))}
                          </div>
                          <div className={styles.subtitle}>
                            {type[key] || ''}
                          </div>
                          <div className={styles.line}>
                            <div
                              className={cn(
                                'status-stroke-black',
                                styles.counter,
                              )}
                            >
                              <span>{category[key]?.length}</span>
                              {' '}
                              cadeau(x)
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Categories

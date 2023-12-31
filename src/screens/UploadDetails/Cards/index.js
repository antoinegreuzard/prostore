import React from 'react'
import cn from 'classnames'
import styles from './Cards.module.sass'
import Icon from '../../../components/Icon'

function Cards({
  className, items, handleChoose, category,
}) {
  return (
    <div className={cn(className, styles.cards)}>
      {items && Object.entries(items)?.map((x, index) => (
        <div
          className={cn(styles.card, x[0] === category && styles.active)}
          key={index}
          onClick={() => handleChoose(x[0])}
          onKeyPress={() => handleChoose(x[0])}
          role="button"
          tabIndex={0}
        >
          <div className={styles.plus}>
            <Icon name="plus" size="24" />
          </div>
          <div className={styles.subtitle}>{x[1]}</div>
        </div>
      ))}
    </div>
  )
}

export default Cards

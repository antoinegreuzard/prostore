import React, { useState, useEffect } from 'react';
import { getAllDataByType } from '../../../lib/cosmic'

import AppLink from '../../AppLink';
import Icon from '../../Icon';
import cn from 'classnames';
import styles from './Group.module.sass';

const Group = ({ className }) => {
  const [categories, setCategories] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllDataByType('categories'); // Assurez-vous que 'categories' est le type correct
        setCategories(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
      }
    };

    fetchCategories();
    }, []);

  console.log(categories)

  return (
    <div className={cn(className, styles.group, { [styles.active]: visible })}>
      <div className={styles.head} onClick={() => setVisible(!visible)}>
        {'Catégories de cadeau'}
        <Icon name="arrow-bottom" size="10" />
      </div>
      <div className={styles.menu}>
        {categories.map((category, index) => (
          <AppLink className={styles.link} href={`/search?category=${category.id}`} key={index}>
            {category.title}
          </AppLink>
          ))}
      </div>
    </div>
    );
};

export default Group;

import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { getAllDataByType } from '../../../lib/cosmic';

import AppLink from '../../AppLink';
import Icon from '../../Icon';
import styles from './Group.module.sass';

function Group({ className }) {
  const [categories, setCategories] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllDataByType('categories');
        setCategories(data);
      } catch (error) {
        throw new Error(error.status);
      }
    };

    fetchCategories();
  }, []);

  const toggleVisible = () => {
    setVisible(!visible);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      toggleVisible();
    }
  };

  return (
    <div className={cn(className, styles.group, { [styles.active]: visible })}>
      <div
        className={styles.head}
        onClick={toggleVisible}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
      >
        Catégories de cadeau
        <Icon name="arrow-bottom" size="10" />
      </div>
      <div className={styles.menu}>
        {categories.map((category) => (
          <AppLink className={styles.link} href={`/search?category=${category.id}`} key={category.id}>
            {category.title}
          </AppLink>
        ))}
      </div>
    </div>
  );
}

Group.propTypes = {
  className: PropTypes.string,
};

Group.defaultProps = {
  className: '',
};

export default Group;

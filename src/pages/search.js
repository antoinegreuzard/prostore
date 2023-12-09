import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { useStateContext } from '../utils/context/StateContext';
import useDebounce from '../utils/hooks/useDebounce';
import useFetchData from '../utils/hooks/useFetchData';
import { getAllDataByType, getDataByCategory } from '../lib/cosmic';

import Layout from '../components/Layout';
import Icon from '../components/Icon';
import Card from '../components/Card';
import priceRange from '../utils/constants/priceRange';
import handleQueryParams from '../utils/queryParams';

import styles from '../styles/pages/Search.module.sass';
import { PageMeta } from '../components/Meta';

function Search({ categoriesGroup, navigationItems, categoryData }) {
  const { query, push } = useRouter();
  const { categories } = useStateContext();

  const { data: searchResult, fetchData } = useFetchData(
    categoryData?.length ? categoryData : [],
  );

  const categoriesTypeData = categoriesGroup.type || categories.type;

  const [search, setSearch] = useState(query.search || '');
  const debouncedSearchTerm = useDebounce(search, 600);

  const [{ min, max }, setRangeValues] = useState(
    query.min || query.max
      ? { min: query.min || 1, max: query.max || 100 }
      : priceRange,
  );
  const debouncedMinTerm = useDebounce(min, 600);
  const debouncedMaxTerm = useDebounce(max, 600);

  const [activeIndex, setActiveIndex] = useState(query.category || '');

  const handleChange = ({ target: { name, value } }) => {
    setRangeValues((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const [lastSearchParams, setLastSearchParams] = useState({
    lastSearch: '',
    lastMin: 1,
    lastMax: 100,
    lastCategory: '',
  });

  const handleFilterDataByParams = useCallback(
    async ({
      categoryParam = activeIndex,
      minParam = debouncedMinTerm,
      maxParam = debouncedMaxTerm,
      searchTerm = debouncedSearchTerm,
    }) => {
      if (
        categoryParam === lastSearchParams.lastCategory
        && minParam === lastSearchParams.lastMin
        && maxParam === lastSearchParams.lastMax
        && searchTerm === lastSearchParams.lastSearch
      ) {
        return;
      }
      setLastSearchParams({
        lastCategory: categoryParam,
        lastMin: minParam,
        lastMax: maxParam,
        lastSearch: searchTerm,
      });

      const params = handleQueryParams({
        category: categoryParam,
        min: minParam.toString().trim(),
        max: maxParam.toString().trim(),
        search: searchTerm.toLowerCase().trim(),
      });

      push(
        {
          pathname: '/search',
          query: params,
        },
        undefined,
        { shallow: true },
      );

      const filterParam = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');

      await fetchData(`/api/filter?${filterParam}`);
    },
    [
      lastSearchParams,
      activeIndex,
      debouncedSearchTerm,
      debouncedMinTerm,
      debouncedMaxTerm,
      fetchData,
      push,
    ],
  );

  const handleCategoryChange = useCallback(
    async (category) => {
      setActiveIndex(category);
      handleFilterDataByParams({ categoryParam: category });
    },
    [handleFilterDataByParams],
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFilterDataByParams({ searchTerm: debouncedSearchTerm });
  };

  useEffect(() => {
    let isMount = true;

    if (
      isMount
      && (debouncedSearchTerm?.length || debouncedMinTerm?.length || debouncedMaxTerm?.length)
    ) {
      handleFilterDataByParams({
        minParam: debouncedMinTerm,
        maxParam: debouncedMaxTerm,
        searchTerm: debouncedSearchTerm,
      });
    } else if (!categoryData?.length) {
      handleFilterDataByParams({ categoryParam: activeIndex });
    }

    return () => {
      isMount = false;
    };
  }, [
    debouncedSearchTerm,
    debouncedMinTerm,
    debouncedMaxTerm,
    categoryData?.length,
    activeIndex,
    handleFilterDataByParams]);

  return (
    <Layout navigationPaths={navigationItems[0]?.metadata}>
      <PageMeta
        title="Rechercher un cadeau | Marché de Noël EDS du campus de Lyon"
        description="Marché de Noël EDS du campus de Lyon"
      />
      <div className={cn('section-pt80 section-pb80', styles.section)}>
        <div className={cn('container', styles.container)}>
          <div className={styles.row}>
            <div className={styles.filters}>
              <div className={styles.top}>
                <div className={styles.title}>Recherche</div>
              </div>
              <div className={styles.form}>
                <div className={styles.label}>Mots clés</div>
                <form
                  className={styles.search}
                  action=""
                  onSubmit={handleSubmit}
                >
                  <input
                    className={styles.input}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    name="search"
                    placeholder="Mots clés"
                    required
                  />
                  <button className={styles.result} type="submit">
                    <Icon name="search" size="16" />
                  </button>
                </form>
              </div>
              <div className={styles.range}>
                <div className={styles.label}>échelle de prix</div>
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
                  <p className={styles.separator}>à</p>
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
            <div className={styles.wrapper}>
              <div className={styles.nav}>
                <button
                  className={cn(styles.link, {
                    [styles.active]: activeIndex === '',
                  })}
                  onClick={() => handleCategoryChange('')}
                  type="button"
                >
                  Tous
                </button>
                {categoriesTypeData
                  && Object.entries(categoriesTypeData)?.map((item, index) => (
                    <button
                      className={cn(styles.link, {
                        [styles.active]: item[0] === activeIndex,
                      })}
                      onClick={() => handleCategoryChange(item[0])}
                      key={index}
                      type="button"
                    >
                      {item[1]}
                    </button>
                  ))}
              </div>
              <div className={styles.list}>
                {searchResult?.length ? (
                  searchResult?.map((x, index) => (
                    <Card className={styles.card} item={x} key={index} />
                  ))
                ) : (
                  <p className={styles.inform}>
                    Merci de sélectionner d&apos;autres filtres
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

Search.propTypes = {
  categoriesGroup: PropTypes.shape({
    groups: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    type: PropTypes.objectOf(PropTypes.string),
  }).isRequired,
  navigationItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      metadata: PropTypes.shape({
        id: PropTypes.number,
        menu: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string,
            link: PropTypes.string,
          }),
        ),
      }),
    }),
  ),
  categoryData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
    }),
  ),
};

Search.defaultProps = {
  categoryData: [],
  navigationItems: [
    {
      metadata: {
        menu: [{ name: '' }], // Option 3: Fournir une valeur par défaut pour 'name'
      },
    },
  ],
};

export default Search;

export async function getServerSideProps({ query }) {
  const navigationItems = (await getAllDataByType('navigation')) || [];

  const categoryTypes = (await getAllDataByType('categories')) || [];
  const categoriesData = await Promise.all(
    categoryTypes?.map((category) => getDataByCategory(category?.id)),
  );

  const categoryData = query?.hasOwnProperty('category')
    ? await getDataByCategory(query.category)
    : [];

  const categoriesGroups = categoryTypes?.map(({ id }, index) => ({ [id]: categoriesData[index] }));

  const categoriesType = categoryTypes?.reduce((arr, { title, id }) => (
    {
      ...arr,
      [id]: title,
    }
  ), {});

  const categoriesGroup = { groups: categoriesGroups, type: categoriesType };

  return {
    props: { navigationItems, categoriesGroup, categoryData },
  };
}

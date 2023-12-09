import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useStateContext } from '../utils/context/StateContext';
import Layout from '../components/Layout';
import { Categories, Description, HotBid } from '../screens/Home';
import chooseBySlug from '../utils/chooseBySlug';
import { getAllDataByType, getDataByCategory } from '../lib/cosmic';

function Home({
  landing, categoriesGroup, categoryTypes, navigationItems,
}) {
  const { categories, onCategoriesChange, setNavigation } = useStateContext();

  const handleContextAdd = useCallback(
    (category, data, navigation) => {
      onCategoriesChange({ groups: category, type: data });
      setNavigation(navigation);
    },
    [onCategoriesChange, setNavigation],
  );

  useEffect(() => {
    let isMounted = true;

    if (!categories.groups?.length && isMounted) {
      handleContextAdd(
        categoriesGroup?.groups,
        categoriesGroup?.type,
        navigationItems[0]?.metadata,
      );
    }

    return () => {
      isMounted = false;
    };
  }, [
    categories,
    categoriesGroup,
    categoryTypes,
    handleContextAdd,
    navigationItems,
  ]);

  const allProducts = categoriesGroup.groups.reduce((acc, group) => {
    const products = Object.values(group)[0];
    return [...acc, ...products];
  }, []);

  return (
    <Layout navigationPaths={navigationItems[0]?.metadata}>
      <Description info={chooseBySlug(landing, 'marketing')} />
      <HotBid classSection="section" info={allProducts} />
      <Categories
        info={categoriesGroup.groups}
        type={categoriesGroup.type}
      />
    </Layout>
  );
}

Home.propTypes = {
  landing: PropTypes.arrayOf(PropTypes.shape({
  })),
  categoriesGroup: PropTypes.shape({
    groups: PropTypes.arrayOf(PropTypes.shape({
    })),
    type: PropTypes.objectOf(PropTypes.string),
  }),
  categoryTypes: PropTypes.arrayOf(PropTypes.shape({
  })),
  navigationItems: PropTypes.arrayOf(PropTypes.shape({
    metadata: PropTypes.shape({
    }),
  })),
};

Home.defaultProps = {
  landing: [],
  categoriesGroup: {
    groups: [],
    type: {},
  },
  categoryTypes: [],
  navigationItems: [],
};

export default Home;

export async function getServerSideProps() {
  const landing = (await getAllDataByType('landings')) || [];
  const categoryTypes = (await getAllDataByType('categories')) || [];
  const categoriesData = await Promise.all(
    categoryTypes?.map((category) => getDataByCategory(category?.id)),
  );
  const navigationItems = (await getAllDataByType('navigation')) || [];

  const categoriesGroups = categoryTypes?.map(({ id }, index) => ({ [id]: categoriesData[index] }));

  const categoriesType = categoryTypes?.reduce(
    (arr, { title, id }) => ({ ...arr, [id]: title }),
    {},
  );

  const categoriesGroup = { groups: categoriesGroups, type: categoriesType };

  return {
    props: {
      landing,
      categoriesGroup,
      categoryTypes,
      navigationItems,
    },
  };
}

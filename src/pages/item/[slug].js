import React, { useCallback, useEffect, useState } from 'react';
import cn from 'classnames';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Layout from '../../components/Layout';
import Discover from '../../screens/Home/Discover';
import Modal from '../../components/Modal';
import OAuth from '../../components/OAuth';
import Image from '../../components/Image';
import { PageMeta } from '../../components/Meta';
import { getDataByCategory, getDataBySlug, getAllDataByType } from '../../lib/cosmic';
import styles from '../../styles/pages/Item.module.sass';
import { getToken } from '../../utils/token';
import { useStateContext } from '../../utils/context/StateContext';

function Item({ itemInfo, categoriesGroup, navigationItems }) {
  const { cosmicUser } = useStateContext();
  const { push } = useRouter();

  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleAuthModal, setVisibleAuthModal] = useState(false);
  const [fillFiledMessage, setFillFiledMessage] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  const idProduct = itemInfo[0].id;

  const handleOAuth = useCallback(
    async (user) => {
      if (!cosmicUser.id) {
        setVisibleAuthModal(true);
      }

      return !(!user || !user.id);
    },
    [cosmicUser],
  );

  useEffect(() => {
    if (cosmicUser.id && itemInfo && cosmicUser.email === itemInfo[0].metadata.email) {
      setShowDeleteButton(true);
    }
  }, [cosmicUser, itemInfo]);

  const deleteProduct = useCallback(
    async (e) => {
      e.preventDefault();

      if (!cosmicUser.id) {
        handleOAuth();
      }

      if (fillFiledMessage) {
        setFillFiledMessage(false);
      }

      if (!cosmicUser || !idProduct) {
        setFillFiledMessage(true);
        return;
      }

      const token = getToken()?.token;

      const response = await fetch('/api/delete', {
        method: 'DELETE',
        body: JSON.stringify({ idProduct }),
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const deleteItem = await response.json();

      if (deleteItem.message) {
        toast.success('Le cadeau a bien été supprimé', { position: 'bottom-right' });
        setTimeout(() => { push('/search'); }, 3000);
      }
    },
    [fillFiledMessage, setFillFiledMessage, push, handleOAuth, cosmicUser, idProduct],
  );

  const handleMailto = () => {
    window.location.href = `mailto:${itemInfo[0].metadata.email}`;
  };

  return (
    <Layout navigationPaths={navigationItems[0].metadata}>
      <PageMeta
        title={`${itemInfo[0].title} | Marché de Noël EDS du campus de Lyon`}
        description="Marché de Noël EDS du campus de Lyon"
      />
      <div className={cn('section', styles.section)}>
        <div className={cn('container', styles.container)}>
          <div className={styles.bg}>
            <div className={styles.preview}>
              <div className={styles.image}>
                <Image
                  size={{ width: '100%', height: '100%' }}
                  srcSet={`${itemInfo[0].metadata.image.imgix_url}`}
                  src={itemInfo[0].metadata.image.imgix_url}
                  alt="Item"
                  objectFit="cover"
                />
              </div>
            </div>
          </div>
          <div className={styles.details}>
            <h1 className={cn('h3', styles.title)}>{itemInfo[0].title}</h1>
            <div className={styles.cost}>
              <div className={cn('status-stroke-green', styles.price)}>
                {`${itemInfo[0].metadata.price} €`}
              </div>
              <div className={styles.counter}>
                {itemInfo[0].metadata.count > 0
                  ? `${itemInfo[0].metadata.count} en stock`
                  : 'Non disponible'}
              </div>
            </div>
            <div className={styles.info}>
              {itemInfo[0].metadata.description}
            </div>
            <div className={styles.nav}>
              {itemInfo[0].metadata.categories.map((x, index) => (
                <button
                  type="button"
                  className={cn({ [styles.active]: index === activeIndex }, styles.link)}
                  onClick={() => setActiveIndex(index)}
                  key={index}
                >
                  {x.title}
                </button>
              ))}
            </div>
            <div className={styles.actions}>
              {!showDeleteButton && (
                <div className={styles.btns}>
                  <button
                    type="button"
                    className={cn('button', styles.button)}
                    onClick={handleMailto}
                  >
                    Contacter le vendeur
                  </button>
                </div>
              )}
              {showDeleteButton && (
                <div className={styles.btns}>
                  <button
                    type="button"
                    className={cn('button button-red', styles.button)}
                    onClick={deleteProduct}
                  >
                    Supprimer le cadeau
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <Discover
          info={categoriesGroup.groups}
          type={categoriesGroup.type}
        />
      </div>
      <Modal
        visible={visibleAuthModal}
        onClose={() => setVisibleAuthModal(false)}
      >
        <OAuth
          className={styles.steps}
          handleOAuth={handleOAuth}
          handleClose={() => setVisibleAuthModal(false)}
        />
      </Modal>
    </Layout>
  );
}

Item.propTypes = {
  itemInfo: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    metadata: PropTypes.shape({
      email: PropTypes.string,
      image: PropTypes.shape({
        imgix_url: PropTypes.string,
      }),
      price: PropTypes.number,
      count: PropTypes.number,
      description: PropTypes.string,
      categories: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
      })),
    }),
  })).isRequired,
  categoriesGroup: PropTypes.shape({
    groups: PropTypes.arrayOf(PropTypes.shape({
    })),
    type: PropTypes.objectOf(PropTypes.string),
  }).isRequired,
  navigationItems: PropTypes.arrayOf(PropTypes.shape({
    metadata: PropTypes.shape({
    }),
  })).isRequired,
};

export default Item;

export async function getServerSideProps({ params }) {
  const itemInfo = await getDataBySlug(params.slug);

  const navigationItems = (await getAllDataByType('navigation')) || [];
  const categoryTypes = (await getAllDataByType('categories')) || [];
  const categoriesData = await Promise.all(
    categoryTypes.map((category) => getDataByCategory(category.id)),
  );

  const categoriesGroups = categoryTypes.map(({ id }, index) => ({ [id]: categoriesData[index] }));

  const categoriesType = categoryTypes.reduce((
    arr,
    { title, id },
  ) => ({
    ...arr,
    [id]:
       title,
  }
  ), {});

  const categoriesGroup = { groups: categoriesGroups, type: categoriesType };

  if (!itemInfo) {
    return {
      notFound: true,
    };
  }

  return {
    props: { itemInfo, navigationItems, categoriesGroup },
  };
}

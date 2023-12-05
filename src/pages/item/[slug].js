import React, { useState, useCallback, useEffect } from 'react'
import cn from 'classnames'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router';
import { createBucketClient } from '@cosmicjs/sdk'
import { useStateContext } from '../../utils/context/StateContext'
import Layout from '../../components/Layout'
import Discover from '../../screens/Home/Discover'
import Dropdown from '../../components/Dropdown'
import Modal from '../../components/Modal'
import OAuth from '../../components/OAuth'
import Image from '../../components/Image'
import { PageMeta } from '../../components/Meta'
import {
  getDataBySlug,
  getAllDataByType,
  getDataByCategory,
} from '../../lib/cosmic'

import styles from '../../styles/pages/Item.module.sass'

const cosmic = createBucketClient({
  bucketSlug: process.env.NEXT_PUBLIC_COSMIC_BUCKET_SLUG,
  readKey: process.env.NEXT_PUBLIC_COSMIC_READ_KEY,
})

const Item = ({ itemInfo, categoriesGroup, navigationItems }) => {
  const { cosmicUser } = useStateContext()
  const { push } = useRouter()

  const [activeIndex, setActiveIndex] = useState(0)
  const [visibleAuthModal, setVisibleAuthModal] = useState(false)
  const [fillFiledMessage, setFillFiledMessage] = useState(false)
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [vendorEmail, setVendorEmail] = useState('');

  const idProduct = itemInfo[0].id

  const counts = itemInfo?.[0]?.metadata?.count
    ? Array(itemInfo[0]?.metadata?.count)
        .fill(1)
        .map((_, index) => index + 1)
    : ['Non disponible']
  const [option, setOption] = useState(counts[0])

  const handleOAuth = useCallback(
    async user => {
      !cosmicUser.hasOwnProperty('id') && setVisibleAuthModal(true)

      if (!user && !user?.hasOwnProperty('id')) return false
    },
    [cosmicUser]
  )

  useEffect(() => {
    let email = '';
    if (cosmicUser.id && itemInfo && cosmicUser?.id === itemInfo[0]?.modified_by) {
      setShowDeleteButton(true);
      email = ''
    } else {
      email = cosmicUser?.email;
    }
    setVendorEmail(email); // Mise à jour de vendorEmail
  }, [cosmicUser, itemInfo]);

  const deleteProduct = useCallback(
    async e => {
      e.preventDefault();
      // Vérifiez si l'utilisateur est connecté
      !cosmicUser.hasOwnProperty('id') && handleOAuth()

      fillFiledMessage && setFillFiledMessage(false)

      // Vérifiez si l'ID du produit est disponible
      if (!cosmicUser && !idProduct) {
        setFillFiledMessage(true);
        return;
      }

      // Appel API pour supprimer le produit
      const response = await fetch('/api/delete', {
        method: 'DELETE',
        body: idProduct,
      });

      // Gérer la réponse de l'API
      let deleteItem;
      deleteItem = await response.json();

      if (deleteItem.message) {
        toast.success(`Le cadeau a bien été supprimé`, { position: 'bottom-right' });
        setTimeout(() => {push('/search')}, 3000)
      }
    },
    [fillFiledMessage, setFillFiledMessage, push, handleOAuth, cosmicUser, idProduct]
    );

  const handleMailto = async () => {
    window.location.href = `mailto:${vendorEmail}`;
  }

  return (
    <Layout navigationPaths={navigationItems[0]?.metadata}>
      <PageMeta
        title={itemInfo[0]?.title + ' | Marché de Noël EDS du campus de Lyon'}
        description={
          'Marché de Noël EDS du campus de Lyon'
        }
      />
      <div className={cn('section', styles.section)}>
        <div className={cn('container', styles.container)}>
          <div className={styles.bg}>
            <div className={styles.preview}>
              <div className={styles.image}>
                <Image
                  size={{ width: '100%', height: '100%' }}
                  srcSet={`${itemInfo[0]?.metadata?.image?.imgix_url}`}
                  src={itemInfo[0]?.metadata?.image?.imgix_url}
                  alt="Item"
                  objectFit="cover"
                />
              </div>
            </div>
          </div>
          <div className={styles.details}>
            <h1 className={cn('h3', styles.title)}>{itemInfo[0]?.title}</h1>
            <div className={styles.cost}>
              <div className={cn('status-stroke-green', styles.price)}>
                {`${itemInfo[0]?.metadata?.price} €`}
              </div>
              <div className={styles.counter}>
                {itemInfo[0]?.metadata?.count > 0
                  ? `${itemInfo[0]?.metadata?.count} en stock`
                  : 'Non disponible'}
              </div>
            </div>
            <div className={styles.info}>
              {itemInfo[0]?.metadata?.description}
            </div>
            <div className={styles.nav}>
              {itemInfo[0]?.metadata?.categories?.map((x, index) => (
                <button
                  className={cn(
                    { [styles.active]: index === activeIndex },
                    styles.link
                  )}
                  onClick={() => setActiveIndex(index)}
                  key={index}
                >
                  {x?.title}
                </button>
              ))}
            </div>
            <div className={styles.actions}>
              <div className={styles.dropdown}>
                <Dropdown
                  className={styles.dropdown}
                  value={option}
                  setValue={setOption}
                  options={counts}
                />
              </div>
              {!showDeleteButton && (
                <div className={styles.btns}>
                  <button
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
          info={categoriesGroup['groups']}
          type={categoriesGroup['type']}
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
  )
}

export default Item

export async function getServerSideProps({ params }) {
  const itemInfo = await getDataBySlug(params.slug)

  const navigationItems = (await getAllDataByType('navigation')) || []
  const categoryTypes = (await getAllDataByType('categories')) || []
  const categoriesData = await Promise.all(
    categoryTypes?.map(category => {
      return getDataByCategory(category?.id)
    })
  )

  const categoriesGroups = categoryTypes?.map(({ id }, index) => {
    return { [id]: categoriesData[index] }
  })

  const categoriesType = categoryTypes?.reduce((arr, { title, id }) => {
    return { ...arr, [id]: title }
  }, {})

  const categoriesGroup = { groups: categoriesGroups, type: categoriesType }

  if (!itemInfo) {
    return {
      notFound: true,
    }
  }

  return {
    props: { itemInfo, navigationItems, categoriesGroup },
  }
}

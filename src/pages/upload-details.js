import React, { useState, useCallback, useEffect } from 'react'
import cn from 'classnames'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { useStateContext } from '../utils/context/StateContext'
import Layout from '../components/Layout'
import Icon from '../components/Icon'
import TextInput from '../components/TextInput'
import Loader from '../components/Loader'
import Modal from '../components/Modal'
import OAuth from '../components/OAuth'
import Preview from '../screens/UploadDetails/Preview'
import Cards from '../screens/UploadDetails/Cards'
import { getAllDataByType } from '../lib/cosmic'
import createFields from '../utils/constants/createFields'
import { getToken } from '../utils/token'

import styles from '../styles/pages/UploadDetails.module.sass'
import { PageMeta } from '../components/Meta'

const Upload = ({ navigationItems, categoriesType }) => {
  const { categories, navigation, cosmicUser } = useStateContext()
  const { push } = useRouter()

  const [uploadMedia, setUploadMedia] = useState('')
  const [uploadFile, setUploadFile] = useState('')
  const [chooseCategory, setChooseCategory] = useState('')
  const [fillFiledMessage, setFillFiledMessage] = useState(false)
  const [{ title, count, description, email, price }, setFields] = useState(
    () => createFields
  )

  const [visibleAuthModal, setVisibleAuthModal] = useState(false)
  const [visiblePreview, setVisiblePreview] = useState(false)
  const [jwtToken, setJwtToken] = useState(false)

  useEffect(() => {
    let isMounted = true;
    const uNFTUser = getToken();
    const edsLyoItem = localStorage.getItem('EDS-LYO');
    const token = edsLyoItem ? JSON.parse(edsLyoItem).token : null;

    if (isMounted && !cosmicUser?.hasOwnProperty('id') && !uNFTUser?.hasOwnProperty('id')) {
      setVisibleAuthModal(true);
    }

    if (token) {
      setJwtToken(token)
    }

    return () => {
      isMounted = false;
    };
    }, [cosmicUser]);

  const handleUploadFile = useCallback(async (uploadFile) => {
    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      const uploadResult = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        },
      });

      const mediaData = await uploadResult.json();
      setUploadMedia(mediaData?.['media']);
    } catch (error) {
      console.error('Erreur lors du téléversement du fichier:', error);
    }
  }, [jwtToken]);

  const handleOAuth = useCallback(
    async user => {
      !cosmicUser.hasOwnProperty('id') && setVisibleAuthModal(true)

      if (!user && !user?.hasOwnProperty('id')) return
      user && uploadFile && (await handleUploadFile(uploadFile))
    },
    [cosmicUser, uploadFile, handleUploadFile]
  )

  const handleUpload = async e => {
    setUploadFile(e.target.files[0])

    cosmicUser?.hasOwnProperty('id')
      ? await handleUploadFile(e.target.files[0])
      : await handleOAuth()
  }

  const handleChange = ({ target: { name, value } }) =>
    setFields(prevFields => ({
      ...prevFields,
      [name]: value,
    }))

  const handleChooseCategory = useCallback(index => {
    setChooseCategory(index)
  }, [])

  const previewForm = useCallback(() => {
    if (title && count && price && email && uploadMedia) {
      fillFiledMessage && setFillFiledMessage(false)
      setVisiblePreview(true)
    } else {
      setFillFiledMessage(true)
    }
  }, [count, fillFiledMessage, price, email, title, uploadMedia])

  const submitForm = useCallback(
    async e => {
      e.preventDefault()
      !cosmicUser.hasOwnProperty('id') && await handleOAuth()

      if (cosmicUser && title && count && price && email && uploadMedia) {
        fillFiledMessage && setFillFiledMessage(false)

        const token = getToken()?.hasOwnProperty('token');

        const response = await fetch('/api/create', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            headers: {
              'Authorization': `Bearer ${token}`
            },
          },
          body: JSON.stringify({
            title,
            description,
            email,
            price,
            count,
            categories: [chooseCategory],
            image: uploadMedia['name'],
          }),
        })

        const createdItem = await response.json()

        if (createdItem['object']) {
          toast.success(
            `Le cadeau ${createdItem['object']['title']} a bien été créé`,
            {
              position: 'bottom-right',
            }
          )

          await push(`item/${createdItem['object']['slug']}`)
        }
      } else {
        setFillFiledMessage(true)
      }
    },
    [
      chooseCategory,
      cosmicUser,
      count,
      description,
      fillFiledMessage,
      handleOAuth,
      price,
      email,
      push,
      title,
      uploadMedia,
    ]
  )

  return (
    <Layout navigationPaths={navigationItems[0]?.metadata || navigation}>
      <PageMeta
        title={'Publier un cadeau | Marché de Noël EDS du campus de Lyon'}
        description={
          'Marché de Noël EDS du campus de Lyon'
        }
      />
      <div className={cn('section', styles.section)}>
        <div className={cn('container', styles.container)}>
          <div className={styles.wrapper}>
            <div className={styles.head}>
              <div className={cn('h2', styles.title)}>
                Publier un cadeau
              </div>
            </div>
            <form className={styles.form} action="" onSubmit={submitForm}>
              <div className={styles.list}>
                <div className={styles.item}>
                  <div className={styles.category}>Téléverser un fichier</div>
                  <div className={styles.note}>
                    Choisir ou glisser-déposer un fichier à upload
                  </div>
                  <div className={styles.file}>
                    <input
                      className={styles.load}
                      type="file"
                      onChange={handleUpload}
                    />
                    <div className={styles.icon}>
                      <Icon name="upload-file" size="24" />
                    </div>
                    <div className={styles.format}>
                      PNG, GIF, WEBP, MP4 or MP3. Max 1Gb.
                    </div>
                  </div>
                </div>
                <div className={styles.item}>
                  <div className={styles.category}>Informations sur la cadeau</div>
                  <div className={styles.fieldset}>
                    <TextInput
                      className={styles.field}
                      label="Item title"
                      name="title"
                      type="text"
                      placeholder="e. g. Titre du cadeau"
                      onChange={handleChange}
                      value={title}
                      required
                    />
                    <TextInput
                      className={styles.field}
                      label="Description"
                      name="description"
                      type="text"
                      placeholder="e. g. Description"
                      onChange={handleChange}
                      value={description}
                      required
                    />
                    <TextInput
                      className={styles.field}
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="e. g. E-mail du vendeur"
                      onChange={handleChange}
                      value={email}
                      required
                    />
                    <div className={styles.row}>
                      <div className={styles.col}>
                        <TextInput
                          className={styles.field}
                          label="Price"
                          name="price"
                          type="text"
                          placeholder="e. g. Prix"
                          onChange={handleChange}
                          value={price}
                          required
                        />
                      </div>
                      <div className={styles.col}>
                        <TextInput
                          className={styles.field}
                          label="Count"
                          name="count"
                          type="text"
                          placeholder="e. g. Stock"
                          onChange={handleChange}
                          value={count}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.options}>
                <div className={styles.category}>Choisir une catégorie</div>
                <div className={styles.text}>Choisir une catégorie parmis celles qui existent</div>
                <Cards
                  className={styles.cards}
                  category={chooseCategory}
                  handleChoose={handleChooseCategory}
                  items={categoriesType || categories['type']}
                />
              </div>
              <div className={styles.foot}>
                <button
                  className={cn('button-stroke tablet-show', styles.button)}
                  onClick={previewForm}
                  type="button"
                >
                  Prévisualiser
                </button>
                <button
                  className={cn('button', styles.button)}
                  onClick={submitForm}
                  type="submit"
                >
                  <span>Publier le cadeau</span>
                  <Icon name="arrow-next" size="10" />
                </button>
                {fillFiledMessage && (
                  <div className={styles.saving}>
                    <span>Merci de remplir tous les champs obligatoires</span>
                    <Loader className={styles.loader} />
                  </div>
                )}
              </div>
            </form>
          </div>
          <Preview
            className={cn(styles.preview, { [styles.active]: visiblePreview })}
            info={{ title, count, description, price, email }}
            image={uploadMedia?.['imgix_url']}
            onClose={() => setVisiblePreview(false)}
          />
        </div>
      </div>
      <Modal
        visible={visibleAuthModal}
        disable={!cosmicUser?.hasOwnProperty('id')}
        onClose={() => setVisibleAuthModal(false)}
      >
        <OAuth
          className={styles.steps}
          handleOAuth={handleOAuth}
          handleClose={() => setVisibleAuthModal(false)}
          disable={!cosmicUser?.hasOwnProperty('id')}
        />
      </Modal>
    </Layout>
  )
}

export default Upload

export async function getServerSideProps() {
  const navigationItems = (await getAllDataByType('navigation')) || []
  const categoryTypes = (await getAllDataByType('categories')) || []

  const categoriesType = categoryTypes?.reduce((arr, { title, id }) => {
    return { ...arr, [id]: title }
  }, {})

  return {
    props: { navigationItems, categoriesType },
  }
}

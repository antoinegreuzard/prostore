import React, { useState, useCallback, useEffect, useRef } from 'react'
import cn from 'classnames'
import { useRouter } from 'next/router'
import AppLink from '../AppLink'
import Loader from '../Loader'
import registerFields from '../../utils/constants/registerFields'
import { useStateContext } from '../../utils/context/StateContext'
import { setToken } from '../../utils/token'

import styles from './OAuth.module.sass'

const OAuth = ({ className, handleClose, handleOAuth, disable }) => {
  const { setCosmicUser } = useStateContext()
  const { push } = useRouter()

  const [{ email, password }, setFields] = useState(() => registerFields)
  const [fillFiledMessage, setFillFiledMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const inputElement = useRef(null)

  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus()
    }
  }, [disable])

  const handleGoHome = () => {
    push('/')
  }

  const handleChange = ({ target: { name, value } }) =>
    setFields(prevFields => ({
      ...prevFields,
      [name]: value,
    }))

  const submitForm = useCallback(
    async e => {
      e.preventDefault()
      fillFiledMessage?.length && setFillFiledMessage('')
      setLoading(true)
      if ((email, password)) {
        const auth = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        })
        const cosmicUser = await auth.json()
        if (cosmicUser?.hasOwnProperty('user')) {
          setCosmicUser(cosmicUser['user'])
          setToken({
            id: cosmicUser['user']['id'],
            first_name: cosmicUser['user']['first_name'],
            avatar_url: cosmicUser['user']['avatar_url'],
          })

          setFillFiledMessage('Félécitations !')
          handleOAuth(cosmicUser['user'])
          setFields(registerFields)
          handleClose()
        } else {
          setFillFiledMessage('Merci de s\'enregistrer sur CosmicJS')
        }
      } else {
        setFillFiledMessage('Merci de remplir tous les champs')
      }
      setLoading(false)
    },
    [
      fillFiledMessage?.length,
      email,
      password,
      setCosmicUser,
      handleOAuth,
      handleClose,
    ]
  )

  return (
    <div className={cn(className, styles.transfer)}>
      <div className={cn('h4', styles.title)}>
        Se connecter avec{' '}
        <AppLink target="_blank" href={`https://www.cosmicjs.com`}>
          CosmicJS
        </AppLink>
      </div>
      <div className={styles.text}>
        Pour publier un article, vous devez vous créer préalablement un compte sur la plateforme{' '}
        <AppLink target="_blank" href={`https://www.cosmicjs.com`}>
          CosmicJS
        </AppLink>
      </div>
      <div className={styles.error}>{fillFiledMessage}</div>
      <form className={styles.form} action="submit" onSubmit={submitForm}>
        <div className={styles.field}>
          <input
            ref={inputElement}
            className={styles.input}
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={email}
            required
          />
        </div>
        <div className={styles.field}>
          <input
            className={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={password}
            required
          />
        </div>
        <div className={styles.btns}>
          <button type="submit" className={cn('button', styles.button)}>
            {loading ? <Loader /> : 'Se connecter'}
          </button>
          <button
            onClick={disable ? handleGoHome : handleClose}
            className={cn('button-stroke', styles.button)}
          >
            {disable ? 'Retourner sur la page d\'accueil' : 'Annuler'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default OAuth

import React, { useEffect, useReducer, useState } from 'react'
import { browser } from 'webextension-polyfill-ts'

import Context, {
  preloadedState,
  preloadedContext,
  reducer,
  View,
} from '@popup/store/store'
import { Channel, Theme } from '@src/shared/types'
import styled, { ThemeProvider, css } from 'styled-components'
import { GlobalStyle, themes, utils } from '@popup/styles'
import { Container, Header, Manager } from '@popup/components'
import { Copyrights } from '@popup/components/common/Copyrights'

import { ChannelsView, SettingsView } from '@popup/components/views'

const Content = styled.div<{ settings: boolean }>`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 200%;
  overflow: hidden;
  height: 100%;
  background-color: ${(props) => props.theme.color.custom.content.background};
  ${(props) =>
    props.theme.transition('background-color', 'transform', 'height')};

  > *:first-child {
    ${(props) => props.theme.transition('opacity')};
  }

  ${(props) =>
    props.settings &&
    css`
      transform: translateX(-50%);

      > *:first-child {
        opacity: 0;
      }
    `}
`

const Footer = styled.div<{ settings: boolean }>`
  position: relative;
  overflow: hidden;
  border-top: 1px solid ${(props) => props.theme.color.border.normal};
  padding: 16px;
  ${(props) => props.theme.transition('border-color', 'height')};

  > div {
    ${(props) => props.theme.transition('transform')};
    transform: translateY(-31px);
  }

  ${(props) =>
    props.settings &&
    css`
      > div {
        transform: translateY(-2px);
      }
    `}
`

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, preloadedState)
  const [prepare, setPrepare] = useState(false)

  useEffect(() => {
    browser.storage.local
      .get(['channels', 'theme'])
      .then(({ channels, theme }) => {
        if (Array.isArray(channels)) {
          dispatch({ type: 'INSERT_CHANNELS', payload: channels })
        }

        if (theme) {
          dispatch({ type: 'SET_THEME', payload: theme })
        }

        setPrepare(true)
      })
  }, [])

  const addChannel = (payload: Channel) => {
    dispatch({ type: 'ADD_CHANNEL', payload })
  }

  const removeChannel = (payload: Channel) => {
    dispatch({ type: 'REMOVE_CHANNEL', payload })
  }

  const activeChannel = (payload: Channel | null) => {
    dispatch({ type: 'ACTIVE_CHANNEL', payload })
  }

  const updateChannel = (payload: Channel) => {
    dispatch({ type: 'UPDATE_CHANNEL', payload })
  }

  const setTheme = (payload: Theme) => {
    dispatch({ type: 'SET_THEME', payload })
  }

  const setQuickBlock = (payload: boolean) => {
    dispatch({ type: 'SET_QUICKBLOCK', payload })
  }

  const setView = (payload: View) => {
    dispatch({ type: 'SET_VIEW', payload })
  }

  return (
    <Context.Provider
      value={{
        ...preloadedContext,
        ...state,
        addChannel,
        removeChannel,
        activeChannel,
        updateChannel,
        setTheme,
        setQuickBlock,
        setView,
      }}
    >
      <GlobalStyle />

      <ThemeProvider theme={{ ...themes[state.theme as Theme], ...utils }}>
        <Container settings={state.view === 'settings'}>
          <Header />
          <Content settings={state.view === 'settings'}>
            <ChannelsView prepared={prepare} />
            <SettingsView />
          </Content>
          <Footer settings={state.view === 'settings'}>
            <div>
              <Copyrights />
              <Manager />
            </div>
          </Footer>
        </Container>
      </ThemeProvider>
    </Context.Provider>
  )
}

export default App

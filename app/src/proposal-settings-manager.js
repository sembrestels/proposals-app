// This file is separated from proposal-settings.js to ensure React
// doesn’t get included into the background script.
import React, { useContext } from 'react'
import { useAppState } from '@aragon/api-react'

const SettingsContext = React.createContext({
  dummy: 0,
})

export const useSettings = () => useContext(SettingsContext)

export function SettingsProvider({ children }) {
  const { dummy } = useAppState()
  return (
    <SettingsContext.Provider value={{ dummy }}>
      {children}
    </SettingsContext.Provider>
  )
}

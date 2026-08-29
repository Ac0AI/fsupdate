'use client'

import { useSyncExternalStore } from 'react'
import { DEMO_SESSION_EVENT, DEMO_SESSION_KEY, getDemoUser } from './demoPersona'

const subscribe = (onChange: () => void) => {
  window.addEventListener(DEMO_SESSION_EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(DEMO_SESSION_EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}
const snapshot = () => window.sessionStorage.getItem(DEMO_SESSION_KEY) ?? ''
const serverSnapshot = () => ''

// Servern renderar köparen, klienten byter till sessionens persona efter
// hydreringen utan att React klagar på skillnaden.
export const useDemoUser = () => {
  useSyncExternalStore(subscribe, snapshot, serverSnapshot)
  return getDemoUser()
}

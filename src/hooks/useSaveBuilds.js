import { useState, useEffect } from 'react'
import { api } from '../api/client'
import { useAuth } from './useAuth'

const LOCAL_KEY = 'pcsensei_saved_builds'

const getLocal = () => {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY)) ?? [] }
  catch { return [] }
}
const setLocal = (builds) => localStorage.setItem(LOCAL_KEY, JSON.stringify(builds))

export function useSaveBuilds() {
  const { user } = useAuth()
  const [savedIds, setSavedIds] = useState([])

  // Load saved IDs on mount / auth change
  useEffect(() => {
    if (user) {
      api.get('/api/builds/my')
        .then((data) => setSavedIds((data ?? []).map((b) => b.buildId)))
        .catch(() => {})
    } else {
      setSavedIds(getLocal().map((b) => b.buildId))
    }
  }, [user])

  const isSaved = (buildId) => savedIds.includes(buildId)

  const saveBuild = async ({ buildId, title, parts, totalPrice, useCase }) => {
    const payload = { buildId, title, parts, totalPrice, useCase }

    if (user) {
      await api.post('/api/builds/save', payload)
      setSavedIds((prev) => [...new Set([...prev, buildId])])
    } else {
      const local = getLocal()
      const updated = [...local.filter((b) => b.buildId !== buildId), { ...payload, savedAt: new Date().toISOString() }]
      setLocal(updated)
      setSavedIds(updated.map((b) => b.buildId))
    }
  }

  const deleteBuild = async (buildId) => {
    if (user) {
      await api.delete(`/api/builds/${buildId}`)
      setSavedIds((prev) => prev.filter((id) => id !== buildId))
    } else {
      const updated = getLocal().filter((b) => b.buildId !== buildId)
      setLocal(updated)
      setSavedIds(updated.map((b) => b.buildId))
    }
  }

  const getAllSaved = async () => {
    if (user) {
      return api.get('/api/builds/my')
    }
    return getLocal()
  }

  return { isSaved, saveBuild, deleteBuild, getAllSaved }
}
import { useCallback, useState } from 'react'

export function useAsyncState(initialValue = null) {
  const [data, setData] = useState(initialValue)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const run = useCallback(async (task) => {
    setLoading(true)
    setError(null)
    try {
      const result = await task()
      setData(result)
      return result
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, setData, run }
}

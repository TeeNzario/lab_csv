'use client'

import { useState } from 'react'

export default function ImportUsersPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return

    const selectedFile = e.target.files[0]

    if (selectedFile.type !== 'text/csv') {
      setMessage('Please upload a CSV file')
      return
    }

    setFile(selectedFile)
    setMessage(null)
  }

  const handleImport = async () => {
    if (!file) {
      setMessage('Please select a file first')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      setLoading(true)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/players/import-csv`,
        {
          method: 'POST',
          body: formData,
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Import failed')
      }

      setMessage(`✅ Imported ${data.count} users successfully`)
      setFile(null)
    } catch (err: any) {
      setMessage(`❌ ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-xl font-bold">Import Users (CSV)</h1>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
      />

      <button
        onClick={handleImport}
        disabled={loading}
        className="px-4 py-2 bg-black text-white rounded"
      >
        {loading ? 'Importing...' : 'Import Users'}
      </button>

      {message && <p>{message}</p>}
    </div>
  )
}

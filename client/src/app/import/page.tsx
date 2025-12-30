'use client'

import { useEffect, useState } from 'react'

type ImportPlayer = {
  id: number
  playerName?: string
  riotId?: string
  rank?: string
  isValid: boolean
  errorMessage?: string
  selected?: boolean
}

export default function ImportPreviewPage() {
  const [data, setData] = useState<ImportPlayer[]>([])
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const fetchPreview = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/players/import-csv`
    )
    const result = await res.json()

    setData(
      result.map((row: ImportPlayer) => ({
        ...row,
        selected: row.isValid,
      }))
    )
  }

  useEffect(() => {
    fetchPreview()
  }, [])

  const toggleSelect = (id: number) => {
    setData((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, selected: !row.selected } : row
      )
    )
  }

  const handleCommit = async () => {
    const ids = data
      .filter((row) => row.selected && row.isValid)
      .map((row) => row.id)

    if (ids.length === 0) return

    setLoading(true)

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/players/import-csv/commit`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      }
    )

    setLoading(false)
    fetchPreview()
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Upload */}
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm file:mr-4 file:rounded file:border-0
                     file:bg-gray-100 file:px-4 file:py-2 file:text-sm
                     hover:file:bg-gray-200"
        />

        <button
          disabled={!file}
          onClick={async () => {
            if (!file) return

            const formData = new FormData()
            formData.append('file', file)

            await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/players/import-csv`,
              {
                method: 'POST',
                body: formData,
              }
            )

            fetchPreview()
          }}
          className="px-4 py-2 rounded bg-black text-white
                     disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Upload CSV
        </button>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-semibold">
        Preview Valorant Players
      </h1>

      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Select</th>
              <th className="p-3 text-left">Player</th>
              <th className="p-3 text-left">Riot ID</th>
              <th className="p-3 text-left">Rank</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row) => (
              <tr
                key={row.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    disabled={!row.isValid}
                    checked={row.selected}
                    onChange={() => toggleSelect(row.id)}
                    className="h-4 w-4"
                  />
                </td>

                <td className="p-3">
                  {row.playerName || '-'}
                </td>

                <td className="p-3">
                  {row.riotId || '-'}
                </td>

                <td className="p-3">
                  {row.rank || '-'}
                </td>

                <td className="p-3">
                  {row.isValid ? (
                    <span className="text-green-600 font-medium">
                      OK
                    </span>
                  ) : (
                    <span className="text-red-600">
                      {row.errorMessage}
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-6 text-center text-gray-500"
                >
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Commit */}
      <div className="flex justify-end">
        <button
          onClick={handleCommit}
          disabled={loading}
          className="px-6 py-2 rounded bg-green-600 text-white
                     hover:bg-green-700
                     disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? 'Importing...' : 'Accept Selected'}
        </button>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '../../utils/supabase'

export default function PrepDetail() {
  const { id } = useParams()
  const [prep, setPrep] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const getPrep = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/'
        return
      }
      const { data } = await supabase
        .from('preps')
        .select('*')
        .eq('id', id)
        .single()
      setPrep(data)
    }
    getPrep()
  }, [id])

  if (!prep) return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">{prep.company_name}</h1>
            <p className="text-gray-400">{prep.meeting_type} &middot; {new Date(prep.created_at).toLocaleDateString()}</p>
          </div>
          <a href="/dashboard" className="text-blue-400 hover:text-blue-300">Back to Dashboard</a>
        </div>
        <div className="space-y-6">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-3">Research Brief</h2>
            <p className="text-gray-300 whitespace-pre-wrap">{prep.research_brief}</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-3">Talk Tracks</h2>
            <p className="text-gray-300 whitespace-pre-wrap">{prep.talk_tracks}</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-3">Questions to Ask</h2>
            <p className="text-gray-300 whitespace-pre-wrap">{prep.questions}</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-3">Competitive Intel</h2>
            <p className="text-gray-300 whitespace-pre-wrap">{prep.competitive_intel}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { createClient } from '../../utils/supabase'

export default function NewPrep() {
  const [companyName, setCompanyName] = useState('')
  const [meetingType, setMeetingType] = useState('Discovery Call')
  const [attendees, setAttendees] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const supabase = createClient()

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/generate-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          meetingType,
          attendees,
        }),
      })
      const data = await res.json()

      const { data: { user } } = await supabase.auth.getUser()

      await supabase.from('preps').insert({
        user_id: user?.id,
        company_name: companyName,
        meeting_type: meetingType,
        attendees,
        research_brief: data.research_brief,
        talk_tracks: data.talk_tracks,
        questions: data.questions,
        competitive_intel: data.competitive_intel,
      })

      setResult(data)
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gray-950 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">{companyName}</h1>
            <a href="/dashboard" className="text-blue-400 hover:text-blue-300">Back to Dashboard</a>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-3">Research Brief</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{result.research_brief}</p>
            </div>

            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-3">Talk Tracks</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{result.talk_tracks}</p>
            </div>

            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-3">Questions to Ask</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{result.questions}</p>
            </div>

            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-3">Competitive Intel</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{result.competitive_intel}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">New Prep</h1>
          <a href="/dashboard" className="text-gray-400 hover:text-white">Cancel</a>
        </div>

        <label className="block text-gray-400 text-sm mb-1">Company Name</label>
        <input
          type="text"
          placeholder="e.g. Spotify"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
        />

        <label className="block text-gray-400 text-sm mb-1">Meeting Type</label>
        <select
          value={meetingType}
          onChange={(e) => setMeetingType(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
        >
          <option>Discovery Call</option>
          <option>Demo</option>
          <option>QBR</option>
          <option>Negotiation</option>
          <option>Executive Briefing</option>
        </select>

        <label className="block text-gray-400 text-sm mb-1">Attendees (optional)</label>
        <input
          type="text"
          placeholder="e.g. VP of Sales, CTO"
          value={attendees}
          onChange={(e) => setAttendees(e.target.value)}
          className="w-full p-3 mb-6 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
        />

        <button
          onClick={handleGenerate}
          disabled={loading || !companyName}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white py-3 rounded-lg font-medium"
        >
          {loading ? 'Generating...' : 'Generate Prep'}
        </button>
      </div>
    </div>
  )
}

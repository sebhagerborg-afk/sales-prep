'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../utils/supabase'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [preps, setPreps] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/'
        return
      }
      setUser(user)
      const { data } = await supabase
        .from('preps')
        .select('*')
        .order('created_at', { ascending: false })
      setPreps(data || [])
    }
    getUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Sales Prep AI</h1>
            <p className="text-gray-400">{user.email}</p>
          </div>
          <div className="flex gap-3">
            <a href="/dashboard/new" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">+ New Prep</a>
            <button onClick={handleSignOut} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">Sign Out</button>
          </div>
        </div>
        {preps.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No preps yet</p>
            <p className="text-gray-600 mt-2">Click &quot;+ New Prep&quot; to prepare for your next meeting</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {preps.map((prep) => (
              <a href={`/dashboard/${prep.id}`} key={prep.id} className="bg-gray-900 p-6 rounded-xl border border-gray-800 block hover:border-gray-600 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{prep.company_name}</h2>
                    <p className="text-gray-400">{prep.meeting_type}</p>
                  </div>
                  <span className="text-gray-500 text-sm">{new Date(prep.created_at).toLocaleDateString()}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

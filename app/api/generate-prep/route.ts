import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { companyName, meetingType, attendees } = await req.json()

    const prompt = `You are an elite sales strategist. Prepare a comprehensive meeting prep for a ${meetingType} with ${companyName}.
${attendees ? `Attendees: ${attendees}` : ''}

Provide your response in EXACTLY this JSON format (no markdown, no code blocks, just pure JSON):
{
  "research_brief": "2-3 paragraphs about the company: what they do, recent news, market position, key challenges, and opportunities. Be specific and actionable.",
  "talk_tracks": "3-4 specific talk tracks tailored to this ${meetingType}. Each should have a hook, key points, and transition. Format as numbered items.",
  "questions": "5-7 strategic questions to ask during the meeting. Mix of discovery, pain-point, and value questions. Format as numbered items.",
  "competitive_intel": "Key competitors, how they compare, and positioning angles to use. Be specific about strengths and weaknesses."
}`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    const data = JSON.parse(content.text)
    return NextResponse.json(data)

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate prep' },
      { status: 500 }
    )
  }
}
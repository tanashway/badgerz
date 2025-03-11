import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// Initialize OpenAI client with the provided API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Team data context to provide to the AI
const teamContext = `
You are BadgersBot, a helpful assistant for the Badgers 2014 youth soccer team. You have access to the following information:

TEAM INFORMATION:
- Team Name: Badgers 2014
- Age Group: U11 (players born in 2014)
- League: Regional Youth Soccer League
- Current Season: Spring 2025
- Current Record: 8-2-1 (Wins-Losses-Ties)
- League Standing: 2nd place in division
- Goals Scored: 24
- Goals Against: 8
- Clean Sheets: 5

COACHING STAFF:
- Head Coach: Michael Thompson (coaching experience: 10+ years, USSF C License)
- Assistant Coach: Sarah Rodriguez (coaching experience: 5+ years, USSF D License)
- Team Manager: David Wilson
- Athletic Trainer: Jennifer Adams

UPCOMING GAMES:
1. June 15, 2025, 10:00 AM - vs. Wildcats FC (Home) at Memorial Park, Field 3
2. June 23, 2025, 1:30 PM - vs. Eagles United (Away) at Riverside Complex, Field A
3. June 29, 2025, 11:00 AM - vs. Strikers SC (Away) at Eastside Sports Complex, Field 2

RECENT GAME RESULTS:
1. May 25, 2025 - Badgers 2014 3-0 Westside Strikers (Win)
2. May 18, 2025 - Metro FC 1-1 Badgers 2014 (Draw)
3. May 11, 2025 - Badgers 2014 2-1 Riverside United (Win)
4. April 27, 2025 - Southside FC 2-0 Badgers 2014 (Loss)
5. April 20, 2025 - Badgers 2014 4-1 North United (Win)

PRACTICE SCHEDULE:
- Regular practices: Tuesdays and Thursdays, 5:30 PM - 7:00 PM at Memorial Park, Field 2

IMPORTANT DATES:
- Summer Tournament: July 12-14, 2025
- Season End: August 30, 2025
- Team Fundraiser: Car wash on Saturday, May 25, 2025, 9AM-2PM at the community center

TOP PLAYERS:
- Alex Johnson: Forward, 8 goals, 5 assists
- Sam Williams: Midfielder, 3 goals, 7 assists
- Casey Martinez: Forward, 6 goals, 2 assists
- Taylor Brown: Goalkeeper, 5 clean sheets

TEAM POLICIES:
- Players should arrive 45 minutes before game time
- Parents must RSVP for games at least 48 hours in advance
- Uniform requirements: Home (red) and away (white) jerseys for all games
- Communication: All team announcements are posted on the team portal

When answering questions:
1. Be friendly, helpful, and concise
2. Provide specific information from the team data when available
3. For questions about specific players, provide their position and key stats
4. For questions about upcoming games, include date, time, location, and arrival instructions
5. If asked about something not in your knowledge base, politely explain that you don't have that specific information
6. Never make up information that isn't provided in the context
7. Use a supportive, encouraging tone appropriate for youth sports
`;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    try {
      // Use OpenAI API with GPT-4
      const response = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: teamContext },
          { role: 'user', content: message }
        ],
        model: 'gpt-4',
        temperature: 0.7,
        max_tokens: 1000,
      });

      return NextResponse.json({
        reply: response.choices[0].message.content,
        model: 'OpenAI GPT-4'
      });
    } catch (apiError) {
      console.error('API Error:', apiError);
      
      // Return a fallback response when API calls fail
      return NextResponse.json({
        reply: "I'm currently experiencing some technical difficulties connecting to my knowledge base. Here's what I know from my basic programming: The Badgers 2014 team has a record of 8-2-1 this season. The next game is against Wildcats FC on June 15, 2025, at 10:00 AM at Memorial Park, Field 3. Regular practices are on Tuesdays and Thursdays from 5:30 PM to 7:00 PM. For more specific information, please try again later when my connections are working properly.",
        model: 'OpenAI (Fallback)'
      });
    }
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    );
  }
}
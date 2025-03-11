Here's the fixed file with the missing closing brackets and parentheses:

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Activity, Clock, MapPin, Trophy, Users } from "lucide-react";

// Custom wrapper components to avoid defaultProps warnings
const CustomXAxis = (props) => <XAxis {...props} />;
const CustomYAxis = (props) => <YAxis {...props} />;

export default function GameDayPage() {
  const [activeGame, setActiveGame] = useState<string>("upcoming");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Game Day</h1>
          <p className="text-muted-foreground">Live updates, stats, and match analysis</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Match History</Button>
          <Button>Live Updates</Button>
        </div>
      </div>

      <Tabs defaultValue="upcoming" onValueChange={setActiveGame} className="mb-8">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="upcoming">Upcoming Game</TabsTrigger>
          <TabsTrigger value="live">Live Game</TabsTrigger>
          <TabsTrigger value="recent">Recent Games</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <UpcomingGameView />
        </TabsContent>
        
        <TabsContent value="live">
          {activeGame === "live" ? (
            <LiveGameView />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Activity className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No Live Game</h3>
              <p className="text-muted-foreground max-w-md">
                There is no game currently in progress. Check back during our next scheduled match.
              </p>
              <Button variant="outline" className="mt-4">
                View Upcoming Games
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="recent">
          <RecentGamesView />
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
            <CardDescription>Season statistics and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <CustomXAxis dataKey="name" />
                <CustomYAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--chart-1))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Goal Distribution</CardTitle>
            <CardDescription>Goals by position</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={goalDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {goalDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${index + 1}))`} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Player Stats Leaders</CardTitle>
          <CardDescription>Top performers this season</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-4">Goals</h3>
              <div className="space-y-4">
                {topScorers.map((player, index) => (
                  <div key={player.id} className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{player.name}</span>
                        <span className="font-bold">{player.value}</span>
                      </div>
                      <Progress value={player.value * 10} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-4">Assists</h3>
              <div className="space-y-4">
                {topAssists.map((player, index) => (
                  <div key={player.id} className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{player.name}</span>
                        <span className="font-bold">{player.value}</span>
                      </div>
                      <Progress value={player.value * 10} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-4">Minutes Played</h3>
              <div className="space-y-4">
                {topMinutes.map((player, index) => (
                  <div key={player.id} className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{player.name}</span>
                        <span className="font-bold">{player.value}</span>
                      </div>
                      <Progress value={(player.value / 1000) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function UpcomingGameView() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <Badge>League Game #8</Badge>
              <CardTitle className="mt-2">Badgers 2014 vs. Wildcats FC</CardTitle>
              <CardDescription>Saturday, June 15, 2025 • 10:00 AM</CardDescription>
            </div>
            <Badge variant="outline">Home</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4" />
              <span>Memorial Park, Field 3 • 123 Sports Drive</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              <span>Arrival Time: 9:15 AM (45 minutes before kickoff)</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Users className="mr-2 h-4 w-4" />
              <span>14 players confirmed • 2 pending • 2 unavailable</span>
            </div>
            <div className="bg-muted p-4 rounded-md mt-2">
              <p className="font-medium mb-2">Coach's Notes:</p>
              <p className="text-sm">
                Wildcats FC has a strong defense but struggles with high pressure. We'll focus on quick transitions and pressing high up the field. Please remember to bring both home and away jerseys, and make sure to hydrate well before the game.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">View Opponent</Button>
          <Button>RSVP</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Head-to-Head</CardTitle>
          <CardDescription>Previous matches vs. Wildcats FC</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-center flex-1">
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-muted-foreground">Wins</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">Draws</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">Losses</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="font-medium mb-2">Previous Results:</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Apr 12, 2025</span>
                  <span className="font-medium">W 2-1</span>
                </div>
                <div className="flex justify-between">
                  <span>Mar 8, 2025</span>
                  <span className="font-medium">D 1-1</span>
                </div>
                <div className="flex justify-between">
                  <span>Feb 15, 2025</span>
                  <span className="font-medium">L 0-2</span>
                </div>
                <div className="flex justify-between">
                  <span>Jan 22, 2025</span>
                  <span className="font-medium">W 3-0</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="font-medium mb-2">Key Stats:</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Goals Scored:</span>
                  <span className="font-medium">6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Goals Against:</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Clean Sheets:</span>
                  <span className="font-medium">1</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LiveGameView() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <Badge>League Game #7</Badge>
            <Badge variant="secondary">Live • 65'</Badge>
          </div>
          <div className="mt-4 flex justify-center items-center">
            <div className="text-center flex-1">
              <p className="text-lg font-medium">Badgers 2014</p>
              <p className="text-4xl font-bold mt-2">2</p>
            </div>
            <div className="text-center px-4">
              <p className="text-sm text-muted-foreground">vs</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-lg font-medium">Riverside United</p>
              <p className="text-4xl font-bold mt-2">1</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-medium">Latest Updates</p>
              <div className="space-y-2 mt-2">
                <div className="flex items-start">
                  <Badge variant="outline" className="mr-2 mt-0.5">65'</Badge>
                  <p className="text-sm">Substitution: Riley Davis comes on for Jordan Smith</p>
                </div>
                <div className="flex items-start">
                  <Badge variant="outline" className="mr-2 mt-0.5">58'</Badge>
                  <p className="text-sm">Yellow Card: Sam Williams (Badgers 2014)</p>
                </div>
                <div className="flex items-start">
                  <Badge variant="outline" className="mr-2 mt-0.5">52'</Badge>
                  <p className="text-sm">GOAL! Alex Johnson scores for Badgers 2014! (2-1)</p>
                </div>
                <div className="flex items-start">
                  <Badge variant="outline" className="mr-2 mt-0.5">46'</Badge>
                  <p className="text-sm">Second half begins</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-2">Badgers 2014 Goals</p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">52'</Badge>
                    <span className="text-sm">Alex Johnson</span>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">23'</Badge>
                    <span className="text-sm">Casey Martinez</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Riverside United Goals</p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">37'</Badge>
                    <span className="text-sm">J. Thompson</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm font-medium mb-2">Match Stats</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Possession:</span>
                    <span>58%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shots:</span>
                    <span>12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shots on Target:</span>
                    <span>5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Corners:</span>
                    <span>6</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Starting XI</p>
                <div className="space-y-1 text-sm">
                  <p>GK: Taylor Brown</p>
                  <p>DEF: Jordan Smith, Jamie Lee, Pat Quinn</p>
                  <p>MID: Sam Williams, Riley Davis, Morgan Clark</p>
                  <p>FWD: Alex Johnson, Casey Martinez</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Full Match Details</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Live Stats</CardTitle>
          <CardDescription>Real-time performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Possession</span>
                <span className="text-sm font-medium">58%</span>
              </div>
              <Progress value={58} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Shots</span>
                <span className="text-sm font-medium">12</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Passes Completed</span>
                <span className="text-sm font-medium">187</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Tackles Won</span>
                <span className="text-sm font-medium">14</span>
              </div>
              <Progress value={70} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Corners</span>
                <span className="text-sm font-medium">6</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            
            <div className="pt-4 border-t">
              <p className="font-medium mb-3">Top Performers</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Alex Johnson</p>
                    <p className="text-sm text-muted-foreground">1 goal, 3 shots</p>
                  </div>
                  <Badge>8.4</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Sam Williams</p>
                    <p className="text-sm text-muted-foreground">1 assist, 92% pass accuracy</p>
                  </div>
                  <Badge>7.9</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Taylor Brown</p>
                    <p className="text-sm text-muted-foreground">4 saves</p>
                  </div>
                  <Badge>7.5</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RecentGamesView() {
  return (
    <div className="space-y-6">
      {recentGames.map((game) => (
        <Card key={game.id} className={`border-l-4 ${game.result === 'W' ? 'border-l-chart-1' : game.result === 'L' ? 'border-l-destructive' : 'border-l-chart-3'}`}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <Badge>{game.type}</Badge>
                <CardTitle className="mt-2">{game.homeTeam} vs. {game.awayTeam}</CardTitle>
                <CardDescription>{game.date}</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={game.result === 'W' ? 'default' : game.result === 'L' ? 'destructive' : 'secondary'}>
                  {game.result === 'W' ? 'Win' : game.result === 'L' ? 'Loss' : 'Draw'}
                </Badge>
                <div className="text-xl font-bold">
                  {game.score}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Goals</h3>
                <div className="space-y-1 text-sm">
                  {game.goals.map((goal, index) => (
                    <div key={index} className="flex items-center">
                      <Badge variant="outline" className="mr-2">{goal.minute}'</Badge>
                      <span>{goal.player}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Key Stats</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Possession:</span>
                    <span>{game.stats.possession}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shots:</span>
                    <span>{game.stats.shots}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Corners:</span>
                    <span>{game.stats.corners}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Top Performers</h3>
                <div className="space-y-2 text-sm">
                  {game.topPerformers.map((player, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{player.name}</span>
                      <Badge>{player.rating}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View Full Match Report</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

// Sample data
const performanceData = [
  { name: "Goals", value: 24 },
  { name: "Assists", value: 18 },
  { name: "Clean Sheets", value: 5 },
  { name: "Shots", value: 87 },
  { name: "Passes", value: 1245 },
  { name: "Tackles", value: 134 }
];

const goalDistribution = [
  { name: "Forwards", value: 14 },
  { name: "Midfielders", value: 7 },
  { name: "Defenders", value: 3 },
  { name: "Own Goals", value: 0 }
];

const topScorers = [
  { id: 1, name: "Alex Johnson", value: 8 },
  { id: 2, name: "Casey Martinez", value: 6 },
  { id: 3, name: "Sam Williams", value: 3 },
  { id: 4, name: "Riley Davis", value: 2 },
  { id: 5, name: "Jordan Smith", value: 1 }
];

const topAssists = [
  { id: 1, name: "Sam Williams", value: 7 },
  { id: 2, name: "Alex Johnson", value: 5 },
  { id: 3, name: "Riley Davis", value: 4 },
  { id: 4, name: "Casey Martinez", value: 2 },
  { id: 5, name: "Jamie Lee", value: 0 }
];

const topMinutes = [
  { id: 1, name: "Taylor Brown", value: 990 },
  { id: 2, name: "Jordan Smith", value: 945 },
  { id: 3, name: "Sam Williams", value: 920 },
  { id: 4, name: "Alex Johnson", value: 870 },
  { id: 5, name: "Casey Martinez", value: 810 }
];

const recentGames = [
  {
    id: 1,
    type: "League Game #7",
    homeTeam: "Badgers 2014",
    awayTeam: "Riverside United",
    date: "June 8, 2025",
    result: "W",
    score: "2-1",
    goals: [
      { minute: 23, player: "Casey Martinez" },
      { minute: 52, player: "Alex Johnson" }
    ],
    stats: {
      possession: 58,
      shots: 12,
      corners: 6
    },
    topPerformers: [
      { name: "Alex Johnson", rating: 8.4 },
      { name: "Sam Williams", rating: 7.9 },
      { name: "Taylor Brown", rating: 7.5 }
    ]
  },
  {
    id: 2,
    type: "League Game #6",
    homeTeam: "Metro FC",
    awayTeam: "Badgers 2014",
    date: "June 1, 2025",
    result: "D",
    score: "1-1",
    goals: [
      { minute: 67, player: "Riley Davis" }
    ],
    stats: {
      possession: 45,
      shots: 8,
      corners: 4
    },
    topPerformers: [
      { name: "Riley Davis", rating: 8.1 },
      { name: "Taylor Brown", rating: 7.8 },
      { name: "Jordan Smith", rating: 7.4 }
    ]
  },
  {
    id: 3,
    type: "League Game #5",
    homeTeam: "Badgers 2014",
    awayTeam: "Westside Strikers",
    date: "May 25, 2025",
    result: "W",
    score: "3-0",
    goals: [
      { minute: 12, player: "Alex Johnson" },
      { minute: 34, player: "Casey Martinez" },
      { minute: 78, player: "Sam Williams" }
    ],
    stats: {
      possession: 62,
      shots: 15,
      corners: 7
    },
    topPerformers: [
      { name: "Casey Martinez", rating: 9.1 },
      { name: "Alex Johnson", rating: 8.7 },
      { name: "Sam Williams", rating: 8.5 }
    ]
  }
];
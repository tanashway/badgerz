'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, MessageSquare, Trophy, Clock, MapPin, Activity, DollarSign, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import Image from "next/image";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Team Stats - Responsive grid */}
      <section className="container mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Season Record</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold">8-2-1</p>
                <p className="text-muted-foreground text-sm">Wins-Losses-Ties</p>
              </div>
              <Trophy className="h-10 w-10 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold">24</p>
                <p className="text-muted-foreground text-sm">Goals Scored</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">8</p>
                <p className="text-muted-foreground text-sm">Goals Against</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2 md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Team Ranking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold">#2</p>
                <p className="text-muted-foreground text-sm">In Division</p>
              </div>
              <Badge className="text-lg px-3 py-1">Top 5</Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Upcoming Games - Responsive layout */}
      <section className="container mx-auto px-4 mb-8 md:mb-12">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold">Upcoming Games</h2>
          <Button variant="outline" asChild size="sm" className="h-9">
            <Link href="/schedule">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {upcomingGames.map((game) => (
            <Card key={game.id} className="h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{game.opponent}</CardTitle>
                    <CardDescription>{game.type}</CardDescription>
                  </div>
                  <Badge variant={game.homeAway === "Home" ? "default" : "outline"}>
                    {game.homeAway}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span>{game.date} • {game.time}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="line-clamp-2">{game.location}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full h-10">RSVP</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Latest Announcements - Optimized for mobile */}
      <section className="container mx-auto px-4 mb-8 md:mb-12">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold">Latest Announcements</h2>
          <Button variant="outline" asChild size="sm" className="h-9">
            <Link href="/communication">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader>
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <CardTitle className="text-lg">{announcement.title}</CardTitle>
                  <Badge variant="secondary">{announcement.category}</Badge>
                </div>
                <CardDescription>
                  {announcement.date} • {announcement.author}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 md:line-clamp-2">{announcement.content}</p>
              </CardContent>
              <CardFooter className="flex justify-between flex-wrap gap-2">
                <Button variant="ghost" size="sm" className="text-muted-foreground h-9">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {announcement.comments} Comments
                </Button>
                <Button variant="outline" size="sm" className="h-9">Read More</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Links - Responsive grid with touch-friendly targets */}
      <section className="container mx-auto px-4 pb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Quick Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Button asChild variant="outline" className="h-auto py-5 md:py-6 justify-start">
            <Link href="/roster" className="flex flex-col items-center text-center">
              <Users className="h-7 w-7 md:h-8 md:w-8 mb-2" />
              <span className="text-base md:text-lg font-medium">Team Roster</span>
              <span className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-1">View player profiles</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-5 md:py-6 justify-start">
            <Link href="/media" className="flex flex-col items-center text-center">
              <ImageIcon className="h-7 w-7 md:h-8 md:w-8 mb-2" />
              <span className="text-base md:text-lg font-medium">Media Gallery</span>
              <span className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-1">Photos & videos</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-5 md:py-6 justify-start">
            <Link href="/game-day" className="flex flex-col items-center text-center">
              <Activity className="h-7 w-7 md:h-8 md:w-8 mb-2" />
              <span className="text-base md:text-lg font-medium">Game Stats</span>
              <span className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-1">Performance analytics</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-5 md:py-6 justify-start">
            <Link href="/payments" className="flex flex-col items-center text-center">
              <DollarSign className="h-7 w-7 md:h-8 md:w-8 mb-2" />
              <span className="text-base md:text-lg font-medium">Team Fees</span>
              <span className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-1">Manage payments</span>
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

// Sample data
const upcomingGames = [
  {
    id: 1,
    opponent: "Wildcats FC",
    type: "League Match",
    homeAway: "Home",
    date: "Sat, Jun 15",
    time: "10:00 AM",
    location: "Memorial Park, Field 3"
  },
  {
    id: 2,
    opponent: "Eagles United",
    type: "Tournament",
    homeAway: "Away",
    date: "Sun, Jun 23",
    time: "1:30 PM",
    location: "Riverside Complex, Field A"
  }
];

const announcements = [
  {
    id: 1,
    title: "Summer Training Schedule Released",
    category: "Training",
    date: "May 28, 2025",
    author: "Coach Thompson",
    content: "Our summer training schedule is now available. We'll be focusing on conditioning and technical skills. Please make sure to bring plenty of water as temperatures will be high.",
    comments: 5
  },
  {
    id: 2,
    title: "Team Fundraiser Next Weekend",
    category: "Event",
    date: "May 25, 2025",
    author: "Team Manager",
    content: "We're hosting a car wash fundraiser next Saturday from 9AM-2PM at the community center. All players are expected to participate for at least one hour. Parents, please sign up to bring supplies.",
    comments: 8
  }
]; 
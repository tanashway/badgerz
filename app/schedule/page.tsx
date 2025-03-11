"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, MapPin, Users, ChevronLeft, ChevronRight, Filter, Download, Plus, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addMonths, subMonths } from "date-fns";
import { useAuth } from "@/lib/auth/AuthContext";
import { supabase } from "@/lib/supabase";

interface Game {
  id: string;
  opponent: string;
  date: string;
  time: string;
  location: string;
  home_away: string;
  type: string;
  result?: string | null;
  score_team?: number | null;
  score_opponent?: number | null;
}

export default function SchedulePage() {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState<boolean>(false);
  const [month, setMonth] = useState<Date>(new Date());
  const [eventType, setEventType] = useState<string>("all");
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        throw error;
      }

      setGames(data || []);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGames = eventType === "all" 
    ? games 
    : games.filter(game => game.type.toLowerCase() === eventType.toLowerCase());

  const upcomingGames = games.filter(game => {
    const gameDate = new Date(game.date);
    return gameDate >= new Date();
  });

  const pastGames = games.filter(game => {
    const gameDate = new Date(game.date);
    return gameDate < new Date();
  });

  const handlePreviousMonth = () => {
    setMonth(subMonths(month, 1));
  };

  const handleNextMonth = () => {
    setMonth(addMonths(month, 1));
  };

  const generateCalendarDays = (month: Date) => {
    const start = new Date(month.getFullYear(), month.getMonth(), 1);
    const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const days = [];

    // Add days from previous month to start on Sunday
    const startDay = start.getDay();
    for (let i = 0; i < startDay; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() - (startDay - i));
      days.push({ date, isCurrentMonth: false, isToday: false });
    }

    // Add days of current month
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      days.push({
        date: new Date(date),
        isCurrentMonth: true,
        isToday: date.toDateString() === new Date().toDateString(),
      });
    }

    // Add days from next month to complete the calendar
    const endDay = end.getDay();
    for (let i = 1; i < 7 - endDay; i++) {
      const date = new Date(end);
      date.setDate(date.getDate() + i);
      days.push({ date, isCurrentMonth: false, isToday: false });
    }

    return days;
  };

  const getEventsForDay = (date: Date, events: Game[]) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Team Schedule</h1>
          <p className="text-muted-foreground">View and manage upcoming games and practices</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button>
            <CalendarIcon className="mr-2 h-4 w-4" />
            Sync Calendar
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex gap-2">
          <Button 
            variant={calendarView ? "outline" : "default"} 
            onClick={() => setCalendarView(false)}
          >
            List View
          </Button>
          <Button 
            variant={calendarView ? "default" : "outline"} 
            onClick={() => setCalendarView(true)}
          >
            Calendar View
          </Button>
        </div>
        <div className="flex gap-2">
          <Select value={eventType} onValueChange={setEventType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="League">League Games</SelectItem>
              <SelectItem value="Tournament">Tournaments</SelectItem>
              <SelectItem value="Friendly">Friendly Games</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <p>Loading schedule...</p>
        </div>
      ) : calendarView ? (
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>
                {format(month, 'MMMM yyyy')}
              </CardTitle>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="py-2 text-sm font-medium">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {generateCalendarDays(month).map((day, index) => (
                <div 
                  key={index} 
                  className={`min-h-[100px] border rounded-md p-1 ${
                    day.isCurrentMonth ? 'bg-background' : 'bg-muted/50 text-muted-foreground'
                  } ${
                    day.isToday ? 'border-primary' : 'border-border'
                  }`}
                >
                  <div className="text-right text-sm p-1">{day.date.getDate()}</div>
                  <div className="space-y-1">
                    {getEventsForDay(day.date, filteredGames).map((game, idx) => (
                      <div 
                        key={idx} 
                        className={`text-xs p-1 rounded truncate ${
                          game.home_away === 'Home'
                            ? 'bg-blue-100 text-blue-700 border-l-2 border-l-blue-700' 
                            : 'bg-green-100 text-green-700 border-l-2 border-l-green-700'
                        }`}
                      >
                        {game.time} - {game.opponent}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="upcoming" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
            <TabsTrigger value="all">Full Season</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingGames.map((game) => (
                <Card key={game.id} className="h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{game.opponent}</CardTitle>
                        <CardDescription>{game.type}</CardDescription>
                      </div>
                      <Badge variant={game.home_away === "Home" ? "default" : "outline"}>
                        {game.home_away}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span>{format(new Date(game.date), 'MMM d, yyyy')} • {game.time}</span>
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
          </TabsContent>
          
          <TabsContent value="past">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastGames.map((game) => (
                <Card key={game.id} className="h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{game.opponent}</CardTitle>
                        <CardDescription>{game.type}</CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={game.home_away === "Home" ? "default" : "outline"}>
                          {game.home_away}
                        </Badge>
                        {game.result && (
                          <Badge variant={game.result === "W" ? "default" : game.result === "L" ? "destructive" : "secondary"}>
                            {game.score_team}-{game.score_opponent}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span>{format(new Date(game.date), 'MMM d, yyyy')} • {game.time}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="line-clamp-2">{game.location}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full h-10">View Details</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredGames.map((game) => (
                <Card key={game.id} className="h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{game.opponent}</CardTitle>
                        <CardDescription>{game.type}</CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={game.home_away === "Home" ? "default" : "outline"}>
                          {game.home_away}
                        </Badge>
                        {game.result && (
                          <Badge variant={game.result === "W" ? "default" : game.result === "L" ? "destructive" : "secondary"}>
                            {game.score_team}-{game.score_opponent}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span>{format(new Date(game.date), 'MMM d, yyyy')} • {game.time}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="line-clamp-2">{game.location}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full h-10">
                      {new Date(game.date) >= new Date() ? "RSVP" : "View Details"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
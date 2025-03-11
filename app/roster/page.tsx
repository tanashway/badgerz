"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Search, Filter, Download, Mail, Phone, Award, Star, Shirt, Ruler, Footprints, Clock, Calendar, ChevronRight, Menu, Loader2 } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import { Database } from "@/types/database.types";

// Define types based on our database schema
type Player = Database['public']['Tables']['players']['Row'] & {
  player_stats?: Database['public']['Tables']['player_stats']['Row'][];
  player_contacts?: Database['public']['Tables']['player_contacts']['Row'][];
};

type Staff = Database['public']['Tables']['staff']['Row'];

export default function RosterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("players");

  // Fetch all players and staff directly without team selection
  const { data: players, isLoading: isLoadingPlayers, error: playersError } = useApi<Player[]>('/api/players');
  const { data: staff, isLoading: isLoadingStaff } = useApi<Staff[]>('/api/staff', {
    enabled: activeTab === "staff"
  });

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Remove duplicate players by ID
  const uniquePlayers = players ? 
    Array.from(new Map(players.map(player => [player.id, player])).values()) : 
    [];

  // Filter players based on search query and position filter
  const filteredPlayers = uniquePlayers ? uniquePlayers.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPosition = positionFilter === "all" || player.position.toLowerCase() === positionFilter.toLowerCase();
    return matchesSearch && matchesPosition;
  }) : [];

  // Sort players based on sort selection
  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    const statsA = a.player_stats?.[0] || { games: 0, goals: 0, assists: 0 };
    const statsB = b.player_stats?.[0] || { games: 0, goals: 0, assists: 0 };
    
    switch (sortBy) {
      case "number":
        return a.number - b.number;
      case "position":
        return a.position.localeCompare(b.position);
      case "goals":
        return (statsB.goals || 0) - (statsA.goals || 0);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  // Calculate team stats
  const teamStats = {
    totalPlayers: uniquePlayers?.length || 0,
    forwards: uniquePlayers?.filter(p => p.position.toLowerCase() === "forward").length || 0,
    midfielders: uniquePlayers?.filter(p => p.position.toLowerCase() === "midfielder").length || 0,
    defenders: uniquePlayers?.filter(p => p.position.toLowerCase() === "defender").length || 0,
    goalkeepers: uniquePlayers?.filter(p => p.position.toLowerCase() === "goalkeeper").length || 0
  };

  // Loading state
  if (isLoadingPlayers && !players) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading team data...</p>
      </div>
    );
  }

  // Error state
  if (playersError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h2 className="text-2xl font-bold mb-2">Error Loading Players</h2>
          <p className="text-muted-foreground mb-4">{playersError.message}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  // No players found
  if (uniquePlayers && uniquePlayers.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h2 className="text-2xl font-bold mb-2">No Players Found</h2>
          <p className="text-muted-foreground mb-4">Please run the seed.sql script to populate the database.</p>
          <Button>Add Players</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Badgers 2014 Roster</h1>
          <p className="text-muted-foreground">Player profiles and team information</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="h-10 md:h-9">
            <Download className="mr-2 h-4 w-4" />
            <span className="md:inline">Export</span>
          </Button>
          <Button className="h-10 md:h-9">
            <Mail className="mr-2 h-4 w-4" />
            <span className="md:inline">Contact</span>
          </Button>
        </div>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4">
        <Button 
          variant="outline" 
          className="w-full flex justify-between items-center h-12"
          onClick={() => setShowFilters(!showFilters)}
        >
          <div className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filters & Sorting
          </div>
          <ChevronRight className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-90' : ''}`} />
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Filters - Collapsible on Mobile */}
        <div className={`${showFilters || !isMobile ? 'block' : 'hidden'} w-full md:w-64 space-y-4 md:block`}>
          <div className="relative">
            <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search players..." 
              className="pl-8 h-10" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Filter By Position</p>
            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="All Positions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                <SelectItem value="forward">Forward</SelectItem>
                <SelectItem value="midfielder">Midfielder</SelectItem>
                <SelectItem value="defender">Defender</SelectItem>
                <SelectItem value="goalkeeper">Goalkeeper</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Sort By</p>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Name" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="number">Jersey Number</SelectItem>
                <SelectItem value="position">Position</SelectItem>
                <SelectItem value="goals">Goals</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Team Stats - Hidden on mobile when filters are shown */}
          <div className="pt-4 border-t md:block">
            <p className="text-sm font-medium mb-2">Team Stats</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Players:</span>
                <span className="font-medium">{teamStats.totalPlayers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Forwards:</span>
                <span className="font-medium">{teamStats.forwards}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Midfielders:</span>
                <span className="font-medium">{teamStats.midfielders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Defenders:</span>
                <span className="font-medium">{teamStats.defenders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Goalkeepers:</span>
                <span className="font-medium">{teamStats.goalkeepers}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Tabs defaultValue="players" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="players">Players</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
            </TabsList>
            
            <TabsContent value="players" className="space-y-6">
              {/* Players Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedPlayers.map((player) => (
                  <PlayerCard 
                    key={player.id} 
                    player={player} 
                    onClick={() => setSelectedPlayer(player)} 
                  />
                ))}
              </div>
              
              {sortedPlayers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-2">No players match your filters</p>
                  <Button variant="outline" onClick={() => {
                    setSearchQuery("");
                    setPositionFilter("all");
                  }}>Clear Filters</Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="staff" className="space-y-6">
              {/* Staff Grid */}
              {isLoadingStaff && !staff ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {staff && staff.map((person) => (
                    <StaffCard key={person.id} person={person} />
                  ))}
                </div>
              )}
              
              {staff && staff.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-2">No staff members found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Player Detail Dialog */}
      {selectedPlayer && (
        <Dialog open={!!selectedPlayer} onOpenChange={(open) => !open && setSelectedPlayer(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <PlayerDetailContent player={selectedPlayer} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Helper component for player details
function PlayerDetailContent({ player }: { player: Player }) {
  const playerStats = player.player_stats?.[0] || { 
    games: 0, 
    goals: 0, 
    assists: 0, 
    minutes: 0 
  };
  
  const playerContact = player.player_contacts?.[0] || {
    email: null,
    phone: null
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Avatar className="h-16 w-16 mr-4 border-2 border-muted">
          <AvatarImage src={player.avatar || undefined} alt={player.name} />
          <AvatarFallback>{player.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">{player.name}</h3>
          <div className="flex items-center mt-1">
            <Badge variant="outline" className="mr-2">#{player.number}</Badge>
            <Badge>{player.position}</Badge>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div className="flex items-center">
          <Shirt className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>Jersey: <strong>#{player.number}</strong></span>
        </div>
        <div className="flex items-center">
          <Ruler className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>Height: <strong>{player.height || 'N/A'}</strong></span>
        </div>
        <div className="flex items-center">
          <Footprints className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>Foot: <strong>{player.foot || 'N/A'}</strong></span>
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>Age: <strong>{player.age || 'N/A'}</strong></span>
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <h4 className="font-medium mb-2">Season Stats</h4>
        <div className="grid grid-cols-2 gap-y-2">
          <div>Games: <strong>{playerStats.games}</strong></div>
          <div>Goals: <strong>{playerStats.goals}</strong></div>
          <div>Assists: <strong>{playerStats.assists}</strong></div>
          <div>Minutes: <strong>{playerStats.minutes}</strong></div>
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <h4 className="font-medium mb-2">Contact Information</h4>
        <div className="space-y-2">
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{playerContact.phone || "Not provided"}</span>
          </div>
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{playerContact.email || "Not provided"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Player Card Component
function PlayerCard({ player, onClick }: { player: Player; onClick: () => void }) {
  const playerStats = player.player_stats?.[0] || { 
    games: 0, 
    goals: 0, 
    assists: 0 
  };
  
  const positionVariant = getPositionVariant(player.position);
  const positionShort = getPositionShorthand(player.position);

  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="mr-3 flex-shrink-0">
              <Avatar className="h-12 w-12 border-2 border-muted">
                <AvatarImage src={player.avatar || undefined} alt={player.name} />
                <AvatarFallback>{player.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <CardTitle className="text-lg flex items-center">
                {player.name}
                <Badge className="ml-2" variant="outline">#{player.number}</Badge>
              </CardTitle>
              <CardDescription>{player.position}</CardDescription>
            </div>
          </div>
          <Badge variant={positionVariant}>{positionShort}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{playerStats.games}</p>
            <p className="text-xs text-muted-foreground">Games</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{playerStats.goals}</p>
            <p className="text-xs text-muted-foreground">Goals</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{playerStats.assists}</p>
            <p className="text-xs text-muted-foreground">Assists</p>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Height:</span>
            <span>{player.height || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Preferred Foot:</span>
            <span>{player.foot || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Years on Team:</span>
            <span>{Math.floor(Math.random() * 4) + 1}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={onClick}>
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
}

// Staff Card Component
function StaffCard({ person }: { person: Staff }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <Avatar className="h-12 w-12 mr-3">
            <AvatarImage src={person.avatar || undefined} alt={person.name} />
            <AvatarFallback>{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{person.name}</CardTitle>
            <CardDescription>{person.role}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {person.email && (
            <div className="flex items-center text-sm">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{person.email}</span>
            </div>
          )}
          {person.phone && (
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{person.phone}</span>
            </div>
          )}
          {person.bio && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm">{person.bio}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">Contact</Button>
      </CardFooter>
    </Card>
  );
}

// Helper function to get position variant
function getPositionVariant(position: string) {
  switch (position.toLowerCase()) {
    case 'forward':
      return 'default';
    case 'midfielder':
      return 'secondary';
    case 'defender':
      return 'outline';
    case 'goalkeeper':
      return 'destructive';
    default:
      return 'outline';
  }
}

// Helper function to get position shorthand
function getPositionShorthand(position: string) {
  switch (position.toLowerCase()) {
    case 'forward':
      return 'FWD';
    case 'midfielder':
      return 'MID';
    case 'defender':
      return 'DEF';
    case 'goalkeeper':
      return 'GK';
    default:
      return position.substring(0, 3).toUpperCase();
  }
}

// Sample data
const players = [
  {
    id: 1,
    name: "Alex Johnson",
    number: 10,
    position: "Forward",
    height: "5'8\"",
    preferredFoot: "Right",
    yearsOnTeam: 3,
    jerseySize: "M",
    stats: {
      games: 11,
      goals: 8,
      assists: 5,
      minutes: 990,
      passCompletion: 82,
      shotsOnTarget: 18
    },
    injuries: [
      {
        type: "Ankle Sprain",
        date: "March 2025",
        notes: "Minor sprain during practice",
        recovery: "2 weeks"
      }
    ]
  },
  {
    id: 2,
    name: "Sam Williams",
    number: 7,
    position: "Midfielder",
    height: "5'7\"",
    preferredFoot: "Left",
    yearsOnTeam: 2,
    jerseySize: "M",
    stats: {
      games: 11,
      goals: 3,
      assists: 7,
      minutes: 945,
      passCompletion: 89,
      shotsOnTarget: 9
    }
  },
  {
    id: 3,
    name: "Jordan Smith",
    number: 5,
    position: "Defender",
    height: "5'9\"",
    preferredFoot: "Right",
    yearsOnTeam: 3,
    jerseySize: "L",
    stats: {
      games: 10,
      goals: 1,
      assists: 0,
      minutes: 900,
      passCompletion: 91,
      shotsOnTarget: 2
    }
  },
  {
    id: 4,
    name: "Taylor Brown",
    number: 1,
    position: "Goalkeeper",
    height: "5'10\"",
    preferredFoot: "Right",
    yearsOnTeam: 3,
    jerseySize: "L",
    stats: {
      games: 11,
      goals: 0,
      assists: 0,
      minutes: 990,
      passCompletion: 75,
      shotsOnTarget: 0
    }
  },
  {
    id: 5,
    name: "Casey Martinez",
    number: 9,
    position: "Forward",
    height: "5'6\"",
    preferredFoot: "Right",
    yearsOnTeam: 2,
    jerseySize: "S",
    stats: {
      games: 9,
      goals: 6,
      assists: 2,
      minutes: 810,
      passCompletion: 78,
      shotsOnTarget: 15
    }
  },
  {
    id: 6,
    name: "Riley Davis",
    number: 8,
    position: "Midfielder",
    height: "5'7\"",
    preferredFoot: "Right",
    yearsOnTeam: 3,
    jerseySize: "M",
    stats: {
      games: 11,
      goals: 2,
      assists: 4,
      minutes: 880,
      passCompletion: 85,
      shotsOnTarget: 7
    }
  },
  {
    id: 7,
    name: "Jamie Lee",
    number: 4,
    position: "Defender",
    height: "5'8\"",
    preferredFoot: "Left",
    yearsOnTeam: 2,
    jerseySize: "M",
    stats: {
      games: 10,
      goals: 0,
      assists: 1,
      minutes: 870,
      passCompletion: 88,
      shotsOnTarget: 1
    }
  },
  {
    id: 8,
    name: "Morgan Clark",
    number: 6,
    position: "Midfielder",
    height: "5'6\"",
    preferredFoot: "Right",
    yearsOnTeam: 1,
    jerseySize: "S",
    stats: {
      games: 8,
      goals: 1,
      assists: 3,
      minutes: 720,
      passCompletion: 84,
      shotsOnTarget: 4
    }
  },
  {
    id: 9,
    name: "Pat Quinn",
    number: 3,
    position: "Defender",
    height: "5'9\"",
    preferredFoot: "Right",
    yearsOnTeam: 3,
    jerseySize: "M",
    stats: {
      games: 11,
      goals: 0,
      assists: 0,
      minutes: 950,
      passCompletion: 90,
      shotsOnTarget: 0
    }
  },
  {
    id: 10,
    name: "Avery Wilson",
    number: 12,
    position: "Forward",
    height: "5'7\"",
    preferredFoot: "Right",
    yearsOnTeam: 1,
    jerseySize: "M",
    stats: {
      games: 7,
      goals: 3,
      assists: 1,
      minutes: 560,
      passCompletion: 76,
      shotsOnTarget: 8
    }
  },
  {
    id: 11,
    name: "Cameron Reed",
    number: 2,
    position: "Defender",
    height: "5'8\"",
    preferredFoot: "Right",
    yearsOnTeam: 2,
    jerseySize: "M",
    stats: {
      games: 9,
      goals: 0,
      assists: 1,
      minutes: 810,
      passCompletion: 87,
      shotsOnTarget: 1
    }
  },
  {
    id: 12,
    name: "Drew Parker",
    number: 16,
    position: "Goalkeeper",
    height: "5'9\"",
    preferredFoot: "Left",
    yearsOnTeam: 1,
    jerseySize: "M",
    stats: {
      games: 2,
      goals: 0,
      assists: 0,
      minutes: 180,
      passCompletion: 72,
      shotsOnTarget: 0
    }
  }
];

const staff = [
  {
    id: 1,
    name: "Michael Thompson",
    role: "Head Coach",
    experience: "10+ years",
    certifications: "USSF C License",
    yearsWithTeam: 4,
    specialties: ["Tactical Development", "Team Building", "Player Development"]
  },
  {
    id: 2,
    name: "Sarah Rodriguez",
    role: "Assistant Coach",
    experience: "5+ years",
    certifications: "USSF D License",
    yearsWithTeam: 2,
    specialties: ["Technical Training", "Goalkeeper Training", "Fitness"]
  },
  {
    id: 3,
    name: "David Wilson",
    role: "Team Manager",
    experience: "3+ years",
    certifications: "First Aid, CPR",
    yearsWithTeam: 3,
    specialties: ["Logistics", "Communication", "Event Planning"]
  },
  {
    id: 4,
    name: "Jennifer Adams",
    role: "Athletic Trainer",
    experience: "7+ years",
    certifications: "Certified Athletic Trainer, CPR/AED",
    yearsWithTeam: 2,
    specialties: ["Injury Prevention", "Rehabilitation", "Performance Enhancement"]
  }
];

const recentGames = [
  {
    opponent: "Westside Strikers",
    date: "May 25, 2025",
    result: "W 3-0"
  },
  {
    opponent: "Metro FC",
    date: "May 18, 2025",
    result: "D 1-1"
  },
  {
    opponent: "Riverside United",
    date: "May 11, 2025",
    result: "W 2-1"
  },
  {
    opponent: "Southside FC",
    date: "April 27, 2025",
    result: "L 0-2"
  },
  {
    opponent: "North United",
    date: "April 20, 2025",
    result: "W 4-1"
  }
];
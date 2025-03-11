"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Bell, Search, Filter, Plus, Mail, Calendar, Users, ThumbsUp, Reply, AlertCircle, FileText, Paperclip } from "lucide-react";

export default function CommunicationPage() {
  const [activeTab, setActiveTab] = useState("announcements");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Filter announcements based on search query and category filter
  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || announcement.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Team Communication</h1>
          <p className="text-muted-foreground">Announcements, messages, and team discussions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Bell className="mr-2 h-4 w-4" />
            Notification Settings
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Message
          </Button>
        </div>
      </div>

      <Tabs defaultValue="announcements" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="discussions">Team Discussions</TabsTrigger>
        </TabsList>
        
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-64 space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                className="pl-8" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {activeTab === "announcements" && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Filter By Category</p>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="Game">Game</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="Important">Important</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {activeTab === "announcements" && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Announcements:</span>
                    <span className="font-medium">{announcements.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Unread:</span>
                    <span className="font-medium">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">This Week:</span>
                    <span className="font-medium">3</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "messages" && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Contacts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {contacts.map((contact) => (
                    <div key={contact.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">{contact.role}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeTab === "discussions" && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Discussion Topics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {discussionTopics.map((topic) => (
                    <div key={topic.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <p className="text-sm">{topic.name}</p>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    New Topic
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>

          <div className="flex-1">
            <TabsContent value="announcements" className="mt-0">
              <div className="space-y-6">
                {filteredAnnouncements.length > 0 ? (
                  filteredAnnouncements.map((announcement) => (
                    <AnnouncementCard key={announcement.id} announcement={announcement} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Announcements Found</h3>
                    <p className="text-muted-foreground max-w-md">
                      No announcements match your current search criteria. Try adjusting your filters or search query.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="messages" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Direct Messages</CardTitle>
                  <CardDescription>Recent conversations with team members</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="flex gap-4 p-4 rounded-lg border">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{message.sender.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <p className="font-medium">{message.sender}</p>
                              <p className="text-xs text-muted-foreground">{message.time}</p>
                            </div>
                            {message.unread && (
                              <Badge variant="secondary">New</Badge>
                            )}
                          </div>
                          <p className="text-sm">{message.preview}</p>
                          <div className="flex gap-2 mt-2">
                            <Button variant="ghost" size="sm">
                              <Reply className="h-4 w-4 mr-2" />
                              Reply
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              View Conversation
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <Mail className="mr-2 h-4 w-4" />
                    Compose New Message
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="discussions" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Team Discussions</CardTitle>
                  <CardDescription>Ongoing team conversations and topics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {discussions.map((discussion) => (
                      <div key={discussion.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-muted p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{discussion.title}</h3>
                              <p className="text-xs text-muted-foreground">Started by {discussion.author} • {discussion.date}</p>
                            </div>
                            <Badge>{discussion.replies} replies</Badge>
                          </div>
                          <p className="text-sm mt-2">{discussion.preview}</p>
                        </div>
                        <div className="p-4 flex justify-between items-center">
                          <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                              <Avatar key={i} className="h-6 w-6 border-2 border-background">
                                <AvatarFallback className="text-xs">U{i}</AvatarFallback>
                              </Avatar>
                            ))}
                            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                              +{discussion.participants - 3}
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Join Discussion
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Start New Discussion
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Communication Guidelines</CardTitle>
          <CardDescription>Team policies for effective communication</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 text-primary" />
                <div>
                  <p className="font-medium">Response Time</p>
                  <p className="text-sm text-muted-foreground">Please respond to team messages within 24 hours</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                <div>
                  <p className="font-medium">Game Day Communication</p>
                  <p className="text-sm text-muted-foreground">Check messages at least 3 hours before game time</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start">
                <Users className="h-5 w-5 mr-2 text-primary" />
                <div>
                  <p className="font-medium">Group Messages</p>
                  <p className="text-sm text-muted-foreground">Use team discussions for topics relevant to all members</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AnnouncementCard({ announcement }: { announcement: any }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{announcement.title}</CardTitle>
          <Badge variant={getBadgeVariant(announcement.category)}>{announcement.category}</Badge>
        </div>
        <CardDescription>
          {announcement.date} • {announcement.author}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{announcement.content}</p>
        {announcement.attachments && announcement.attachments.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium mb-2">Attachments:</p>
            <div className="space-y-2">
              {announcement.attachments.map((attachment: any, index: number) => (
                <div key={index} className="flex items-center p-2 bg-muted rounded-md">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{attachment.name}</span>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    <Paperclip className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center text-muted-foreground text-sm">
          <ThumbsUp className="mr-1 h-4 w-4" />
          <span>{announcement.likes} likes</span>
          <span className="mx-2">•</span>
          <MessageSquare className="mr-1 h-4 w-4" />
          <span>{announcement.comments} comments</span>
        </div>
        <Button variant="outline" size="sm">Read More</Button>
      </CardFooter>
    </Card>
  );
}

function getBadgeVariant(category: string) {
  switch (category) {
    case "Important":
      return "destructive";
    case "Game":
      return "default";
    case "Training":
      return "secondary";
    case "Event":
      return "outline";
    default:
      return "default";
  }
}

// Sample data
const announcements = [
  {
    id: 1,
    title: "Summer Training Schedule Released",
    category: "Training",
    date: "May 28, 2025",
    author: "Coach Thompson",
    content: "Our summer training schedule is now available. We'll be focusing on conditioning and technical skills. Please make sure to bring plenty of water as temperatures will be high. The schedule includes three sessions per week: Tuesdays and Thursdays from 5:30-7:00 PM, and Saturday mornings from 9:00-10:30 AM.",
    likes: 12,
    comments: 5,
    attachments: [
      { name: "Summer_Training_Schedule.pdf", size: "245 KB" }
    ]
  },
  {
    id: 2,
    title: "Team Fundraiser Next Weekend",
    category: "Event",
    date: "May 25, 2025",
    author: "Team Manager",
    content: "We're hosting a car wash fundraiser next Saturday from 9AM-2PM at the community center. All players are expected to participate for at least one hour. Parents, please sign up to bring supplies. The funds raised will go toward our tournament travel expenses and new training equipment.",
    likes: 8,
    comments: 8
  },
  {
    id: 3,
    title: "Important Update: Field Change for Next Game",
    category: "Important",
    date: "May 22, 2025",
    author: "Coach Thompson",
    content: "Due to maintenance issues, our next home game against Wildcats FC has been moved from Field 3 to Field 5 at Memorial Park. All other details remain the same. Please arrive at the usual time and park in the north lot, which is closer to Field 5.",
    likes: 15,
    comments: 3
  },
  {
    id: 4,
    title: "Game Analysis: Riverside United",
    category: "Game",
    date: "May 20, 2025",
    author: "Coach Thompson",
    content: "I've uploaded the video analysis from our recent game against Riverside United. Please review it before Thursday's practice as we'll be discussing key moments and areas for improvement. Overall, great team performance with excellent defensive organization in the second half.",
    likes: 10,
    comments: 6,
    attachments: [
      { name: "Game_Analysis_Riverside.mp4", size: "1.2 GB" },
      { name: "Performance_Stats.xlsx", size: "156 KB" }
    ]
  },
  {
    id: 5,
    title: "New Tactical Approach for Upcoming Games",
    category: "Training",
    date: "May 18, 2025",
    author: "Coach Thompson",
    content: "Based on our recent performances and the upcoming opponents, we'll be implementing some tactical adjustments. We'll focus on a more possession-based approach with quick transitions. This Thursday's practice will introduce these concepts, so full attendance is important.",
    likes: 7,
    comments: 4
  }
];

const messages = [
  {
    id: 1,
    sender: "Coach Thompson",
    time: "Yesterday, 4:30 PM",
    preview: "Alex, I noticed your great positioning during the last game. Let's work on some specific drills to further improve your movement off the ball.",
    unread: true
  },
  {
    id: 2,
    sender: "Sarah Rodriguez",
    time: "Yesterday, 2:15 PM",
    preview: "The goalkeeper training session is confirmed for tomorrow morning. Please bring your gloves and water bottle.",
    unread: true
  },
  {
    id: 3,
    sender: "David Wilson",
    time: "May 27, 2025",
    preview: "All uniform orders have been placed. They should arrive before the tournament next month.",
    unread: false
  },
  {
    id: 4,
    sender: "Jennifer Adams",
    time: "May 25, 2025",
    preview: "Your ankle looks much better. Let's continue with the strengthening exercises we discussed.",
    unread: false
  }
];

const discussions = [
  {
    id: 1,
    title: "Tournament Carpooling Arrangements",
    author: "David Wilson",
    date: "May 26, 2025",
    preview: "Let's coordinate carpooling for the upcoming tournament. Please indicate if you can drive and how many passengers you can take.",
    replies: 12,
    participants: 8
  },
  {
    id: 2,
    title: "Team Dinner After Saturday's Game",
    author: "Parent Volunteer",
    date: "May 24, 2025",
    preview: "We're planning a team dinner after Saturday's game to celebrate the end of the regular season. Please RSVP and note any dietary restrictions.",
    replies: 15,
    participants: 14
  },
  {
    id: 3,
    title: "Summer Conditioning Program",
    author: "Coach Thompson",
    date: "May 20, 2025",
    preview: "I've posted the summer conditioning program. Let's discuss any questions or modifications needed based on individual needs.",
    replies: 8,
    participants: 10
  }
];

const contacts = [
  { id: 1, name: "Coach Thompson", role: "Head Coach" },
  { id: 2, name: "Sarah Rodriguez", role: "Assistant Coach" },
  { id: 3, name: "David Wilson", role: "Team Manager" },
  { id: 4, name: "Jennifer Adams", role: "Athletic Trainer" },
  { id: 5, name: "Alex Johnson", role: "Team Captain" },
  { id: 6, name: "Parent Group", role: "All Parents" }
];

const discussionTopics = [
  { id: 1, name: "Team Logistics" },
  { id: 2, name: "Game Preparation" },
  { id: 3, name: "Training Feedback" },
  { id: 4, name: "Tournament Planning" },
  { id: 5, name: "Equipment Needs" }
];
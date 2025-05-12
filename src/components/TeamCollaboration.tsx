import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageSquare, 
  Share2, 
  ThumbsUp,
  Bookmark,
  Calendar,
  Plus,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';

interface Discussion {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  likes: number;
  comments: number;
  tags: string[];
}

interface StudyGroup {
  id: string;
  name: string;
  members: number;
  topic: string;
  nextMeeting?: string;
  progress: number;
}

export const TeamCollaboration: React.FC = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([
    {
      id: '1',
      title: 'Best practices for customer service',
      content: 'Share your experiences and tips for handling difficult customer situations...',
      author: 'John Doe',
      timestamp: '2024-03-15T10:30:00',
      likes: 15,
      comments: 8,
      tags: ['customer-service', 'best-practices']
    },
    {
      id: '2',
      title: 'Product knowledge quiz tips',
      content: 'What strategies are you using to prepare for the upcoming product knowledge assessment?',
      author: 'Jane Smith',
      timestamp: '2024-03-14T15:45:00',
      likes: 12,
      comments: 5,
      tags: ['product-knowledge', 'quiz']
    }
  ]);

  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([
    {
      id: '1',
      name: 'Customer Service Excellence',
      members: 8,
      topic: 'Advanced customer handling techniques',
      nextMeeting: '2024-03-20T14:00:00',
      progress: 75
    },
    {
      id: '2',
      name: 'Product Knowledge',
      members: 12,
      topic: 'New product features and updates',
      progress: 60
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Collaboration</h2>
        <div className="flex space-x-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Discussion
          </Button>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Create Study Group
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Study Groups</h3>
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Find Groups
            </Button>
          </div>

          {studyGroups.map((group) => (
            <Card key={group.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <p className="text-sm text-gray-500">{group.topic}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-2" />
                    {group.members} members
                  </div>
                  {group.nextMeeting && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      Next meeting: {new Date(group.nextMeeting).toLocaleString()}
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm">
                      Join Group
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Discussions</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {discussions.map((discussion) => (
            <Card key={discussion.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{discussion.title}</CardTitle>
                    <p className="text-sm text-gray-500">
                      Posted by {discussion.author} • {new Date(discussion.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">{discussion.content}</p>
                  <div className="flex flex-wrap gap-2">
                    {discussion.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      {discussion.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {discussion.comments}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}; 
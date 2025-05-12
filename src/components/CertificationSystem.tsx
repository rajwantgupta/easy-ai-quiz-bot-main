import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Award, 
  Download, 
  Share2, 
  CheckCircle, 
  Clock, 
  Star,
  Trophy,
  Medal
} from 'lucide-react';

interface Certification {
  id: string;
  title: string;
  description: string;
  level: 'basic' | 'intermediate' | 'advanced';
  requirements: string[];
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  expiryDate?: string;
  issuedDate?: string;
  certificateUrl?: string;
}

export const CertificationSystem: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>([
    {
      id: '1',
      title: 'Customer Service Professional',
      description: 'Master customer service skills and best practices',
      level: 'intermediate',
      requirements: [
        'Complete Customer Service Excellence module',
        'Score 85% or higher in final assessment',
        'Complete 3 practical assignments'
      ],
      progress: 75,
      status: 'in_progress',
      expiryDate: '2025-06-01'
    },
    {
      id: '2',
      title: 'Product Knowledge Expert',
      description: 'Become an expert in our product line',
      level: 'advanced',
      requirements: [
        'Complete all product training modules',
        'Score 90% or higher in product knowledge test',
        'Complete product demonstration project'
      ],
      progress: 100,
      status: 'completed',
      issuedDate: '2024-03-15',
      certificateUrl: '/certificates/product-expert.pdf'
    }
  ]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'basic':
        return 'bg-blue-100 text-blue-800';
      case 'intermediate':
        return 'bg-purple-100 text-purple-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'basic':
        return <Star className="h-4 w-4" />;
      case 'intermediate':
        return <Medal className="h-4 w-4" />;
      case 'advanced':
        return <Trophy className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Certifications</h2>
        <Button>
          <Award className="h-4 w-4 mr-2" />
          View All Certifications
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certifications.map((cert) => (
          <Card key={cert.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                {cert.title}
                <Badge className={`ml-2 ${getLevelColor(cert.level)}`}>
                  {getLevelIcon(cert.level)}
                  <span className="ml-1">{cert.level}</span>
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">{cert.description}</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Requirements:</h4>
                  <ul className="space-y-1">
                    {cert.requirements.map((req, index) => (
                      <li key={index} className="text-sm flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{cert.progress}%</span>
                  </div>
                  <Progress value={cert.progress} />
                </div>

                {cert.status === 'completed' && cert.certificateUrl && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download Certificate
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                )}

                {cert.expiryDate && (
                  <div className="text-sm text-gray-500 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                  </div>
                )}

                {cert.issuedDate && (
                  <div className="text-sm text-gray-500 flex items-center">
                    <Award className="h-4 w-4 mr-2" />
                    Issued: {new Date(cert.issuedDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}; 
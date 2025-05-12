
import { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [organization, setOrganization] = useState(user?.organization || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      const success = await updateProfile({
        name,
        phone,
        organization,
      });
      
      if (success) {
        setIsEditing(false);
        toast.success("Profile updated successfully");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null; // This should be caught by ProtectedRoute
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">My Profile</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Account Info</CardTitle>
                  <CardDescription>Your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Username</span>
                    <p className="text-base">{user.username || user.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Email</span>
                    <p className="text-base">{user.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Account Type</span>
                    <p className="text-base capitalize">{user.role}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Joined</span>
                    <p className="text-base">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </div>
                    {!isEditing && (
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="organization">Organization</Label>
                        <Input
                          id="organization"
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      {isEditing && (
                        <div className="flex pt-4 space-x-3">
                          <Button 
                            type="submit" 
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                Saving...
                              </>
                            ) : (
                              "Save Changes"
                            )}
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => {
                              setIsEditing(false);
                              setName(user?.name || "");
                              setPhone(user?.phone || "");
                              setOrganization(user?.organization || "");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;

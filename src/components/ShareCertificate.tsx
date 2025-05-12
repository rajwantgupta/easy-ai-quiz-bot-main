
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { toast } from "sonner";

type ShareCertificateProps = {
  quizId: string;
};

export const ShareCertificate = ({ quizId }: ShareCertificateProps) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isEmailSharing, setIsEmailSharing] = useState(false);
  const [isWhatsAppSharing, setIsWhatsAppSharing] = useState(false);
  
  const handleEmailShare = () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }
    
    setIsEmailSharing(true);
    
    // Simulate API call to send certificate via email
    setTimeout(() => {
      setIsEmailSharing(false);
      toast.success("Certificate sent to the provided email address");
      setEmail("");
    }, 1500);
  };
  
  const handleWhatsAppShare = () => {
    if (!phone) {
      toast.error("Please enter a phone number");
      return;
    }
    
    setIsWhatsAppSharing(true);
    
    // Format the phone number (remove non-digits)
    const formattedPhone = phone.replace(/\D/g, "");
    
    // Generate share URL
    // In a real app, this would be a link to the certificate
    const certificateUrl = `${window.location.origin}/certificate/${quizId}`;
    const shareText = encodeURIComponent(`Check out my EASY AI Quiz certificate: ${certificateUrl}`);
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${shareText}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, "_blank");
    
    setIsWhatsAppSharing(false);
    toast.success("WhatsApp opened with certificate link");
  };
  
  return (
    <div className="grid gap-6 py-4">
      <div className="space-y-2">
        <h3 className="font-medium">Share via Email</h3>
        <div className="grid gap-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="flex gap-2">
            <Input
              id="email"
              type="email"
              placeholder="recipient@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button 
              onClick={handleEmailShare} 
              disabled={isEmailSharing}
            >
              {isEmailSharing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
                  Sending...
                </div>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Send
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Certificate will be sent as a PDF attachment
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-medium">Share via WhatsApp</h3>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="flex gap-2">
            <Input
              id="phone"
              placeholder="+1 (123) 456-7890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Button
              onClick={handleWhatsAppShare}
              disabled={isWhatsAppSharing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isWhatsAppSharing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
                  Opening...
                </div>
              ) : (
                "WhatsApp"
              )}
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Opens WhatsApp with a shareable link to your certificate
          </p>
        </div>
      </div>
    </div>
  );
};

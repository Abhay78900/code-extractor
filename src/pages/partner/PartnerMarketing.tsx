import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Share2, Copy, Check, Download, QrCode, Link2, MessageSquare, Mail, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import PartnerSidebar from '@/components/partner/PartnerSidebar';
import { mockPartners } from '@/data/mockData';

export default function PartnerMarketing() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState<string | null>(null);
  const partner = mockPartners[0];

  const referralLink = `https://creditcheck.in/ref/${partner.franchise_id}`;
  const whatsappMessage = encodeURIComponent(`Check your credit score from all 4 bureaus at just ₹99! Get your CIBIL, Experian, Equifax & CRIF scores instantly. Use my referral code: ${partner.franchise_id}\n\n${referralLink}`);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate(createPageUrl('Home'));
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(null), 2000);
  };

  const marketingAssets = [
    { name: 'Banner 1200x628', size: '1200 x 628 px', type: 'Social Media' },
    { name: 'Story 1080x1920', size: '1080 x 1920 px', type: 'Instagram Story' },
    { name: 'Square 1080x1080', size: '1080 x 1080 px', type: 'Instagram Post' },
    { name: 'WhatsApp Status', size: '750 x 1334 px', type: 'WhatsApp' },
  ];

  const stats = [
    { label: 'Referral Clicks', value: '234', icon: Link2 },
    { label: 'Conversions', value: '45', icon: Users },
    { label: 'Conversion Rate', value: '19.2%', icon: Share2 },
  ];

  return (
    <div className="min-h-screen bg-background flex w-full">
      <PartnerSidebar onLogout={handleLogout} />
      
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Marketing Tools</h1>
              <p className="text-muted-foreground">Promote your referral link and grow your business</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={stat.label}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="referral" className="space-y-6">
            <TabsList>
              <TabsTrigger value="referral">Referral Link</TabsTrigger>
              <TabsTrigger value="assets">Marketing Assets</TabsTrigger>
              <TabsTrigger value="templates">Message Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="referral">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Referral Link</CardTitle>
                    <CardDescription>Share this link to earn commission on every report</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input value={referralLink} readOnly className="font-mono text-sm" />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => copyToClipboard(referralLink, 'link')}
                      >
                        {copied === 'link' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1 gap-2"
                        onClick={() => window.open(`https://wa.me/?text=${whatsappMessage}`, '_blank')}
                      >
                        <MessageSquare className="w-4 h-4" />
                        Share on WhatsApp
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 gap-2"
                        onClick={() => window.open(`mailto:?subject=Check Your Credit Score&body=${decodeURIComponent(whatsappMessage)}`, '_blank')}
                      >
                        <Mail className="w-4 h-4" />
                        Share via Email
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Franchise Code</CardTitle>
                    <CardDescription>Your unique partner identification code</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 rounded-xl p-6 text-center">
                      <p className="text-3xl font-mono font-bold text-foreground mb-4">{partner.franchise_id}</p>
                      <Button 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => copyToClipboard(partner.franchise_id, 'code')}
                      >
                        {copied === 'code' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        Copy Code
                      </Button>
                    </div>
                    <div className="mt-4 p-4 bg-accent/10 rounded-lg">
                      <p className="text-sm text-accent font-medium">Earn {partner.commission_rate}% commission on every report!</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="assets">
              <Card>
                <CardHeader>
                  <CardTitle>Downloadable Marketing Assets</CardTitle>
                  <CardDescription>Professional banners and creatives for your marketing campaigns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {marketingAssets.map((asset, index) => (
                      <div key={index} className="border border-border rounded-xl p-4 hover:border-primary transition-colors">
                        <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
                          <QrCode className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="font-medium text-foreground">{asset.name}</p>
                        <p className="text-sm text-muted-foreground mb-3">{asset.size}</p>
                        <Button variant="outline" size="sm" className="w-full gap-2">
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates">
              <Card>
                <CardHeader>
                  <CardTitle>Message Templates</CardTitle>
                  <CardDescription>Ready-to-use messages for WhatsApp and SMS marketing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      title: 'Initial Outreach',
                      message: `🎯 Check your Credit Score from ALL 4 Bureaus!\n\n✅ CIBIL\n✅ Experian\n✅ Equifax\n✅ CRIF High Mark\n\nJust ₹99 per bureau. Get instant report!\n\n👉 ${referralLink}\n\nUse code: ${partner.franchise_id}`
                    },
                    {
                      title: 'Follow-up Message',
                      message: `Hi! Did you check your credit score yet? 📊\n\nKnowing your score is important for:\n• Getting better loan rates\n• Credit card approvals\n• Tracking your financial health\n\nCheck now: ${referralLink}`
                    },
                    {
                      title: 'Promotional Offer',
                      message: `🔥 LIMITED TIME OFFER!\n\nGet ALL 4 Bureau Credit Reports at just ₹396 (₹99 each)!\n\n✨ CIBIL + Experian + Equifax + CRIF\n✨ Instant Download\n✨ Detailed Analysis\n\n👉 ${referralLink}`
                    }
                  ].map((template, index) => (
                    <div key={index} className="border border-border rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-foreground">{template.title}</h4>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(template.message, `template-${index}`)}
                        >
                          {copied === `template-${index}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{template.message}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}

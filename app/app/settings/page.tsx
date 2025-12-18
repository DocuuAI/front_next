"use client";
import { useUser } from "@clerk/clerk-react";
import { useUserProfile } from "@/hooks/useUserprofile";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useClerk } from "@clerk/clerk-react";
import { useAppStore } from "@/contexts/AppContext";

import {
  User,
  Bell,
  CreditCard,
  Users,
  Lock,
  HelpCircle,
  LogOut,
  Check,
  ChevronRight
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function SettingsSkeleton() {
  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto animate-pulse space-y-6">
      <div className="h-8 w-32 bg-gray-200 rounded"></div>

      <div className="space-y-4">
        <div className="h-10 w-full bg-gray-200 rounded"></div>
        <div className="h-64 w-full bg-gray-200 rounded"></div>
        <div className="h-64 w-full bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
export default function Settings() {
  const [uploading, setUploading] = useState(false);
  const avatarUrl = useAppStore((s) => s.avatarUrl);
  const entities = useAppStore((s) => s.entities);
  const businessEntities = entities.filter(
    (e) => e.type === "business"
  );
  const setAvatarUrl = useAppStore((s) => s.setAvatarUrl);
  const handleImageChange = async (e: any) => {
      const file = e.target.files[0];
      if (!file || !user) return;

      try {
        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("clerkId", user.id);

        // Upload to API
        const res = await fetch("/api/user/avatar", {
          method: "POST",
          body: formData,
        });

        const data = await res.json(); // <-- NOW data exists

        if (data.error) {
          toast.error(data.error);
          return;
        }

        // Update local UI
        setAvatarUrl(data.imageUrl);
        localStorage.setItem("avatarUrl", data.imageUrl);

        toast.success("Profile photo updated!");

        // 🔥 Fetch latest profile from Supabase
        await refresh();

      } catch (err) {
        console.error(err);
        toast.error("Failed to upload photo");
      } finally {
        setUploading(false);
      }
    };


  const { user } = useUser();
  const { profile, loading, refresh } = useUserProfile();

  const [pan, setPan] = useState("");

  // Load PAN from database into state when profile loads
  useEffect(() => {
    if (profile?.pan !== undefined && profile.pan !== null) {
      setPan(profile.pan);
    }
  }, [profile]);

  // Save PAN to Supabase
  const handleSave = async () => {
  if (!user) return;

  console.log("Sending clerkId:", user.id);
  console.log("Sending PAN:", pan);

  try {
    const res = await fetch("/api/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clerkId: user.id, pan }),
    });

    console.log("API status:", res.status);

    const result = await res.json();
    console.log("API result:", result);   // <-- IMPORTANT

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Profile updated successfully!");

  } catch (err) {
    console.error(err);
    toast.error("Failed to update PAN");
  }
};

    
  const { signOut } = useClerk();

  const [notifications, setNotifications] = useState({
    deadlines: true,
    compliance: true,
    documents: true,
    email: true,
    push: false
  });

  const profileImage = profile?.avatar_url || user?.imageUrl || null;
  const subscriptionPlans = [ { id: 'personal', name: 'Personal', price: '$9', period: '/month', features: [ 'Up to 50 documents', '1 business entity', 'Basic AI assistance', 'Email support', 'Document extraction' ], current: false }, { id: 'business', name: 'Business', price: '$29', period: '/month', features: [ 'Up to 500 documents', '5 business entities', 'Advanced AI assistance', 'Priority support', 'Compliance tracking', 'Team collaboration' ], current: false }, { id: 'premium', name: 'Premium', price: '$99', period: '/month', features: [ 'Unlimited documents', 'Unlimited entities', 'Premium AI features', '24/7 phone support', 'Advanced compliance', 'API access', 'Custom integrations', 'Dedicated account manager' ], current: true } ]; const billingHistory = [ { id: '1', date: '2024-03-01', amount: '$99.00', status: 'Paid', invoice: 'INV-2024-03' }, { id: '2', date: '2024-02-01', amount: '$99.00', status: 'Paid', invoice: 'INV-2024-02' }, { id: '3', date: '2024-01-01', amount: '$99.00', status: 'Paid', invoice: 'INV-2024-01' } ]; const businesses = [ { id: '1', name: 'TechCorp Pvt Ltd', role: 'Owner' }, { id: '2', name: 'Brand Solutions', role: 'Owner' }, { id: '3', name: 'CloudWorks LLP', role: 'Partner' } ];
 if (loading || !profile) {
  return <SettingsSkeleton />;
}


  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-2">Settings</h2>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

{/* PROFILE TAB */}
<TabsContent value="profile" className="space-y-6">
  <Card className="p-6">
    <h3 className="text-xl font-bold text-foreground mb-2">Personal Information</h3>

    {/* PROFILE IMAGE + CHANGE PHOTO */}
<div className="flex items-center gap-6 mb-6">
  {profileImage ? (
    <img
      src={profileImage}
      className="w-20 h-20 rounded-full object-cover"
      alt="Profile"
    />
  ) : (
    <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl">
      {profile.first_name?.[0]}
    </div>
  )}

  <div>
    {/* HIDDEN INPUT */}
    <input
      id="avatarInput"
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleImageChange}
    />

    {/* BUTTON THAT TRIGGERS FILE PICKER */}
    <Button
      variant="outline"
      size="sm"
      disabled={uploading}
      onClick={() => document.getElementById("avatarInput")?.click()}
    >
      {uploading ? "Uploading..." : "Change Photo"}
    </Button>

    <p className="text-gray-600 text-xs mt-2">
      Supports JPG, PNG. Max 5MB.
    </p>
  </div>
</div>

    {/* PERSONAL INFORMATION FORM */}
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" value={profile.first_name || ""} disabled />
        </div>

        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" value={profile.last_name || ""} disabled />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={profile.email || ""} disabled />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" value={profile.phone || ""} disabled />
      </div>

      {/* PAN INPUT */}
      <div>
        <Label htmlFor="pan">PAN</Label>
        <Input
          id="pan"
          value={pan}
          onChange={(e) => setPan(e.target.value)}
          placeholder="Enter your PAN"
        />
      </div>
    </div>

    <Separator className="my-6" />

    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={() => setPan(profile.pan || "")}>
        Cancel
      </Button>

      <Button onClick={handleSave}>
        Save Changes
      </Button>
    </div>
  </Card>
  </TabsContent>
      <Card className="p-6 mt-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-foreground">My Businesses</h3>

        <Button
          size="sm"
          onClick={() => (window.location.href = "/app/entities")}
        >
          Add Business
        </Button>
      </div>

      {businessEntities.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No businesses yet. Create one to start uploading documents.
        </div>
      ) : (
        <div className="space-y-2">
          {businessEntities.map((business) => (
            <div
              key={business.id}
              className="flex items-center justify-between p-3 bg-muted/40 rounded-lg hover:bg-muted transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground">
                    {business.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Business Entity
                  </p>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          ))}
        </div>
      )}
    </Card>

        {/* NOTIFICATIONS TAB */}
<TabsContent value="notifications" className="space-y-6">
  <Card className="p-6">
    <h3 className="text-2xl font-bold text-foreground mb-2">Notification Preferences</h3>

    <div className="space-y-6">
      {(
        Object.keys(notifications) as (keyof typeof notifications)[]
      ).map((key) => (
        <div key={key}>
          <div className="flex items-center justify-between">
            <p className="text-l font-bold text-foreground mb-2 capitalize">{key}</p>
            <Switch
              checked={notifications[key]} // ✅ TypeScript is happy now
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, [key]: checked })
              }
            />
          </div>
          <Separator />
        </div>
      ))}
    </div>
  </Card>
</TabsContent>


        {/* SUBSCRIPTION TAB */}
        <TabsContent value="subscription" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-2xl font-bold text-foreground mb-2">Subscription Plans</h3>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {subscriptionPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative p-6 border-2 rounded-xl ${
                    plan.current ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  {plan.current && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600">
                      Current Plan
                    </Badge>
                  )}

                  <div className="text-center mb-6">
                    <h4 className="text-gray-900 mb-2">{plan.name}</h4>
                    <div className="flex items-baseline justify-center">
                      <span className="text-3xl text-gray-900">{plan.price}</span>
                      <span className="text-gray-600 text-sm ml-1">{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full" variant={plan.current ? 'outline' : 'default'} disabled={plan.current}>
                    {plan.current ? 'Current Plan' : 'Upgrade'}
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* PAYMENT METHOD */}
          <Card className="p-6">
            <h3 className="text-2xl font-bold text-foreground mb-2">Payment Method</h3>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-4">
              <div className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 text-sm">•••• •••• •••• 4242</p>
                <p className="text-gray-600 text-xs">Expires 12/25</p>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>

            <Button variant="outline" size="sm">Add Payment Method</Button>
          </Card>

          {/* BILLING HISTORY — COMPLETED */}
          <Card className="p-6">
            <h3 className="text-2xl font-bold text-foreground mb-2">Billing History</h3>

            <div className="space-y-3">
              {billingHistory.map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-gray-900 text-sm">{bill.invoice}</p>
                    <p className="text-gray-600 text-xs">
                      {new Date(bill.date).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-gray-900 text-sm">{bill.amount}</p>
                      <Badge className="bg-green-600 text-white text-xs px-2 py-0.5">
                        {bill.status}
                      </Badge>
                    </div>

                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* SECURITY TAB */}
        <TabsContent value="security">
          <Card className="p-6">
            <h3 className="text-2xl font-bold text-foreground mb-2">Security Settings</h3>

            <div className="space-y-6">
              <div>
                <Label>Password</Label>
                <Button variant="outline" className="mt-2" size='sm'>
                  Change Password
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <p className="text-l font-bold text-foreground mb-2">Two-Factor Authentication</p>
                <Button size="sm" variant="outline">Enable</Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <p className="text-l font-bold text-foreground mb-2">Logout from all devices</p>
                <Button size="sm" variant="outline" onClick={() => signOut(() => { window.location.href = "/"; })}>Logout</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
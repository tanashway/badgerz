'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const supabase = createClientComponentClient<Database>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    birthday: '',
    gender: '',
    preferred_email: '',
    is_preferred_email_private: false,
    phone1: '',
    is_phone1_private: false,
    phone2: '',
    is_phone2_private: false,
    address: '',
    city: '',
    state: '',
    zip: '',
    is_address_private: false
  });

  useEffect(() => {
    if (user?.id) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user?.id) return;
    
    try {
      let { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert([
            { 
              id: user.id,
              email: user.email,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])
          .select()
          .single();

        if (createError) throw createError;
        data = newProfile;
      } else if (error) {
        throw error;
      }

      if (data) {
        setProfile({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          birthday: data.birthday || '',
          gender: data.gender || '',
          preferred_email: data.preferred_email || user.email || '',
          is_preferred_email_private: data.is_preferred_email_private || false,
          phone1: data.phone1 || '',
          is_phone1_private: data.is_phone1_private || false,
          phone2: data.phone2 || '',
          is_phone2_private: data.is_phone2_private || false,
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          zip: data.zip || '',
          is_address_private: data.is_address_private || false
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          ...profile
        });

      if (error) throw error;
      setSuccess(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out');
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Please sign in to view your profile</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Update your personal information and privacy settings
              </CardDescription>
            </div>
            <Button 
              variant="destructive" 
              onClick={handleSignOut}
              className="w-24"
            >
              Sign Out
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                Profile updated successfully
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={profile.first_name}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={profile.last_name}
                  onChange={(e) => handleChange('last_name', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthday">Birthday</Label>
                <Input
                  id="birthday"
                  type="date"
                  value={profile.birthday}
                  onChange={(e) => handleChange('birthday', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={profile.gender}
                  onValueChange={(value) => handleChange('gender', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="preferred_email">Preferred Contact Email</Label>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="email_private">Private</Label>
                    <Switch
                      id="email_private"
                      checked={profile.is_preferred_email_private}
                      onCheckedChange={(checked) => handleChange('is_preferred_email_private', checked)}
                    />
                  </div>
                </div>
                <Input
                  id="preferred_email"
                  type="email"
                  value={profile.preferred_email}
                  onChange={(e) => handleChange('preferred_email', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="phone1">Phone 1</Label>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="phone1_private">Private</Label>
                    <Switch
                      id="phone1_private"
                      checked={profile.is_phone1_private}
                      onCheckedChange={(checked) => handleChange('is_phone1_private', checked)}
                    />
                  </div>
                </div>
                <Input
                  id="phone1"
                  type="tel"
                  value={profile.phone1}
                  onChange={(e) => handleChange('phone1', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="phone2">Phone 2</Label>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="phone2_private">Private</Label>
                    <Switch
                      id="phone2_private"
                      checked={profile.is_phone2_private}
                      onCheckedChange={(checked) => handleChange('is_phone2_private', checked)}
                    />
                  </div>
                </div>
                <Input
                  id="phone2"
                  type="tel"
                  value={profile.phone2}
                  onChange={(e) => handleChange('phone2', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Address Information</h3>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="address_private">Private</Label>
                  <Switch
                    id="address_private"
                    checked={profile.is_address_private}
                    onCheckedChange={(checked) => handleChange('is_address_private', checked)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={profile.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profile.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={profile.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    value={profile.zip}
                    onChange={(e) => handleChange('zip', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 
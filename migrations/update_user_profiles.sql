-- Create the user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  first_name TEXT,
  last_name TEXT,
  birthday DATE,
  gender TEXT,
  preferred_email TEXT,
  is_preferred_email_private BOOLEAN DEFAULT false,
  phone1 TEXT,
  is_phone1_private BOOLEAN DEFAULT false,
  phone2 TEXT,
  is_phone2_private BOOLEAN DEFAULT false,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  is_address_private BOOLEAN DEFAULT false
);

-- Add new columns if they don't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'city') THEN
        ALTER TABLE public.user_profiles ADD COLUMN city TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'state') THEN
        ALTER TABLE public.user_profiles ADD COLUMN state TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'zip') THEN
        ALTER TABLE public.user_profiles ADD COLUMN zip TEXT;
    END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Anyone can view non-private fields" ON public.user_profiles;

-- Create policies
CREATE POLICY "Users can view own profile" 
ON public.user_profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can view non-private fields" 
ON public.user_profiles 
FOR SELECT 
USING (
  auth.uid() = id OR 
  (
    auth.uid() IS NOT NULL AND 
    (
      is_preferred_email_private IS NULL OR is_preferred_email_private = false OR
      is_phone1_private IS NULL OR is_phone1_private = false OR
      is_phone2_private IS NULL OR is_phone2_private = false OR
      is_address_private IS NULL OR is_address_private = false
    )
  )
); 
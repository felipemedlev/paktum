-- 1. Create a table for public profiles
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 4. Create a function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create a trigger to call the function on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

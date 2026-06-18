
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Auto-grant admin to master email on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_admin_grant()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) = 'gauriganesh.branding@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created_grant_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_admin_grant();

-- Registrations: status enum
CREATE TYPE public.reg_status AS ENUM ('new', 'contacted', 'closed');

-- Sponsor registrations
CREATE TABLE public.sponsor_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  rep_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  budget TEXT NOT NULL,
  zones TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT,
  status public.reg_status NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sponsor_registrations TO authenticated;
GRANT INSERT ON public.sponsor_registrations TO anon;
GRANT ALL ON public.sponsor_registrations TO service_role;
ALTER TABLE public.sponsor_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone may submit sponsor reg" ON public.sponsor_registrations
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins read sponsor regs" ON public.sponsor_registrations
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update sponsor regs" ON public.sponsor_registrations
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete sponsor regs" ON public.sponsor_registrations
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Mandal registrations
CREATE TABLE public.mandal_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mandal_name TEXT NOT NULL,
  area TEXT NOT NULL,
  footfall TEXT NOT NULL,
  past_sponsors TEXT,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  status public.reg_status NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mandal_registrations TO authenticated;
GRANT INSERT ON public.mandal_registrations TO anon;
GRANT ALL ON public.mandal_registrations TO service_role;
ALTER TABLE public.mandal_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone may submit mandal reg" ON public.mandal_registrations
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins read mandal regs" ON public.mandal_registrations
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update mandal regs" ON public.mandal_registrations
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete mandal regs" ON public.mandal_registrations
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER sponsor_reg_touch BEFORE UPDATE ON public.sponsor_registrations
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER mandal_reg_touch BEFORE UPDATE ON public.mandal_registrations
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

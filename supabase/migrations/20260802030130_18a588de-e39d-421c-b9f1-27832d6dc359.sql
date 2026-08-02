CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can read their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE TABLE public.customer_builds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  caption text,
  specs text,
  image_path text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.customer_builds TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customer_builds TO authenticated;
GRANT ALL ON public.customer_builds TO service_role;

ALTER TABLE public.customer_builds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view customer builds"
ON public.customer_builds FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Admins can insert customer builds"
ON public.customer_builds FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update customer builds"
ON public.customer_builds FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete customer builds"
ON public.customer_builds FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_customer_builds_updated_at
BEFORE UPDATE ON public.customer_builds
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.consultations ADD COLUMN consultation_type text NOT NULL DEFAULT 'free';

DROP POLICY IF EXISTS "Anyone can submit a consultation" ON public.consultations;

CREATE POLICY "Anyone can submit a consultation"
ON public.consultations FOR INSERT TO anon, authenticated
WITH CHECK (
  (length(trim(both from name)) >= 1 AND length(trim(both from name)) <= 120)
  AND (length(trim(both from email)) >= 3 AND length(trim(both from email)) <= 200)
  AND (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
  AND (length(trim(both from tier)) >= 1 AND length(trim(both from tier)) <= 40)
  AND (length(trim(both from budget)) >= 1 AND length(trim(both from budget)) <= 60)
  AND (custom_requests IS NULL OR length(custom_requests) <= 4000)
  AND (payment_status = ANY (ARRAY['pending','paid','refunded']))
  AND (consultation_type = ANY (ARRAY['free','guided']))
);
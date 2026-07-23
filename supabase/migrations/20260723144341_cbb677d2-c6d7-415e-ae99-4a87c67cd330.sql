CREATE TABLE public.consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  tier text NOT NULL,
  budget text NOT NULL,
  custom_requests text,
  payment_status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.consultations TO anon, authenticated;
GRANT ALL ON public.consultations TO service_role;

ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a consultation"
  ON public.consultations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
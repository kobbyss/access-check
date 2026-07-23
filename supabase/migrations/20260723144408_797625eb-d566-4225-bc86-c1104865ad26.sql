DROP POLICY IF EXISTS "Anyone can submit a consultation" ON public.consultations;

CREATE POLICY "Anyone can submit a consultation"
  ON public.consultations FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(trim(name)) BETWEEN 1 AND 120
    AND length(trim(email)) BETWEEN 3 AND 200
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND length(trim(tier)) BETWEEN 1 AND 40
    AND length(trim(budget)) BETWEEN 1 AND 60
    AND (custom_requests IS NULL OR length(custom_requests) <= 4000)
    AND payment_status IN ('pending', 'paid', 'refunded')
  );

-- Tighten INSERT policies with WITH CHECK conditions instead of true
DROP POLICY "anyone may submit sponsor reg" ON public.sponsor_registrations;
CREATE POLICY "anyone may submit sponsor reg" ON public.sponsor_registrations
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(company_name) BETWEEN 2 AND 200
    AND length(rep_name) BETWEEN 2 AND 100
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND length(phone) BETWEEN 7 AND 30
    AND length(budget) BETWEEN 1 AND 100
    AND array_length(zones, 1) BETWEEN 1 AND 20
  );

DROP POLICY "anyone may submit mandal reg" ON public.mandal_registrations;
CREATE POLICY "anyone may submit mandal reg" ON public.mandal_registrations
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(mandal_name) BETWEEN 2 AND 200
    AND length(area) BETWEEN 2 AND 200
    AND length(footfall) BETWEEN 1 AND 100
    AND length(contact_name) BETWEEN 2 AND 100
    AND contact_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND length(contact_phone) BETWEEN 7 AND 30
  );

-- Restrict direct execution of security-definer helpers from public/anon
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_admin_grant() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;

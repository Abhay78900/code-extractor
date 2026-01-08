-- Create function to increment view count for a report
CREATE OR REPLACE FUNCTION public.increment_view_count(report_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.credit_reports
  SET view_count = COALESCE(view_count, 0) + 1,
      last_viewed_at = now()
  WHERE id = report_id;
END;
$$;
-- Add plano_url to modelos table
ALTER TABLE public.modelos ADD COLUMN IF NOT EXISTS plano_url TEXT;

-- Update the storage policies if needed (but 'model_images' bucket might already be allowing any file uploaded).
-- No other tables need changes.

-- Create note_attachments table
CREATE TABLE IF NOT EXISTS public.note_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  note_id UUID NOT NULL REFERENCES public.notes ON DELETE CASCADE,
  path TEXT NOT NULL,
  filename TEXT NOT NULL,
  content_type TEXT,
  size_bytes BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_note_attachments_user_id ON public.note_attachments(user_id);
CREATE INDEX IF NOT EXISTS idx_note_attachments_note_id ON public.note_attachments(note_id);

-- Enable RLS
ALTER TABLE public.note_attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for note_attachments
CREATE POLICY "Users can view own note attachments" ON public.note_attachments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create note attachments" ON public.note_attachments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own note attachments" ON public.note_attachments FOR DELETE
  USING (auth.uid() = user_id);


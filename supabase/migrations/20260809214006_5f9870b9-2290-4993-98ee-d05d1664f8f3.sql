DROP POLICY IF EXISTS "Auth read post-media" ON storage.objects;

CREATE POLICY "Read published post-media"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'post-media'
  AND (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1 FROM public.posts p
      WHERE p.published = true
        AND (p.image_url = storage.objects.name OR p.attachment_url = storage.objects.name)
    )
  )
);
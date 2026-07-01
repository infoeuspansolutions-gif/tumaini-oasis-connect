
CREATE POLICY "Auth read post-media" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'post-media');
CREATE POLICY "Admins upload post-media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'post-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update post-media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'post-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete post-media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'post-media' AND public.has_role(auth.uid(), 'admin'));

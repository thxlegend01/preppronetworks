DROP POLICY IF EXISTS "Anyone can view chat media" ON storage.objects;

CREATE POLICY "Uploaders can view their chat media"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'chat-media' AND owner = auth.uid());
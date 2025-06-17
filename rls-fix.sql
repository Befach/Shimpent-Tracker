-- Fix RLS policies for custom authentication system
-- Run these commands in your Supabase SQL editor

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access for tracking" ON shipments;
DROP POLICY IF EXISTS "Allow authenticated users to create shipments" ON shipments;
DROP POLICY IF EXISTS "Allow authenticated users to update shipments" ON shipments;
DROP POLICY IF EXISTS "Allow authenticated users to delete shipments" ON shipments;

DROP POLICY IF EXISTS "Allow public read access for documents" ON shipment_documents;
DROP POLICY IF EXISTS "Allow authenticated users to manage documents" ON shipment_documents;

DROP POLICY IF EXISTS "Allow public read access for stages" ON shipment_stages;
DROP POLICY IF EXISTS "Allow authenticated users to manage stages" ON shipment_stages;

-- Create new policies that allow all operations (since we're using custom auth)
-- For shipments table
CREATE POLICY "Allow all operations on shipments" ON shipments
    FOR ALL USING (true);

-- For shipment_documents table  
CREATE POLICY "Allow all operations on shipment_documents" ON shipment_documents
    FOR ALL USING (true);

-- For shipment_stages table
CREATE POLICY "Allow all operations on shipment_stages" ON shipment_stages
    FOR ALL USING (true);

-- For storage objects
DROP POLICY IF EXISTS "Allow public read access to shipment files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload shipment files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update shipment files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete shipment files" ON storage.objects;

CREATE POLICY "Allow all operations on shipment files" ON storage.objects
    FOR ALL USING (bucket_id = 'shipment_files'); 
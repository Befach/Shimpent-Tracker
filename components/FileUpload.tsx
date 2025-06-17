import { useState, useEffect, useRef } from 'react';
import { FaUpload, FaEye, FaTrash, FaFile, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage } from 'react-icons/fa';
import { supabase } from '../lib/supabase';

type UploadedFile = {
  id: number;
  name: string;
  url: string;
  type: string;
  size: number;
};

type FileUploadProps = {
  shipmentId: string | number;
  onFilesChange?: () => void;
};

export default function FileUpload({ shipmentId, onFilesChange }: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (shipmentId) {
      fetchFiles();
    }
  }, [shipmentId]);

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('shipment_documents')
        .select('*')
        .eq('shipment_id', shipmentId);
      
      if (error) throw error;
      
      if (data) {
        setUploadedFiles(data.map(file => ({
          id: file.id,
          name: file.file_name,
          url: file.public_url,
          type: file.file_type,
          size: file.file_size
        })));
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `shipment_documents/${shipmentId}/${fileName}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('shipment_files')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('shipment_files')
          .getPublicUrl(filePath);

        // Save to database
        const { data, error } = await supabase
          .from('shipment_documents')
          .insert([
            {
              shipment_id: shipmentId,
              file_name: file.name,
              file_type: fileExt,
              file_size: file.size,
              file_path: filePath,
              public_url: publicUrlData.publicUrl
            }
          ])
          .select();

        if (error) throw error;

        // Update progress
        setUploadProgress(((i + 1) / files.length) * 100);
      }

      // Refresh file list
      await fetchFiles();
      
      // Notify parent component
      if (onFilesChange) {
        onFilesChange();
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = async (fileId: number, filePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('shipment_files')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('shipment_documents')
        .delete()
        .eq('id', fileId);

      if (dbError) throw dbError;

      // Update file list
      setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
      
      // Notify parent component
      if (onFilesChange) {
        onFilesChange();
      }
    } catch (error) {
      console.error('Error removing file:', error);
      alert('Error removing file. Please try again.');
    }
  };

  const getFileIcon = (fileType: string) => {
    const type = fileType.toLowerCase();
    if (type.includes('pdf')) return <FaFilePdf className="text-red-500" />;
    if (type.includes('doc')) return <FaFileWord className="text-blue-500" />;
    if (type.includes('xls')) return <FaFileExcel className="text-green-500" />;
    if (type.includes('image')) return <FaFileImage className="text-purple-500" />;
    return <FaFile className="text-gray-500" />;
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">Shipment Files</h3>
        
        {/* File Upload Area */}
        <div className="mb-6">
          <label className="block w-full cursor-pointer">
            <div className="flex items-center justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#F39C12]">
              <FaUpload className="mr-2 text-gray-400" />
              <span className="text-gray-500">
                {uploading ? `Uploading... ${Math.round(uploadProgress)}%` : 'Upload Files'}
              </span>
            </div>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              multiple
              disabled={uploading}
            />
          </label>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            {uploadedFiles.map(file => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  {getFileIcon(file.type)}
                  <span className="ml-2 text-sm truncate max-w-xs">{file.name}</span>
                  <span className="ml-2 text-xs text-gray-500">
                    ({(file.size / 1024).toFixed(2)} KB)
                  </span>
                </div>
                <div className="flex space-x-2">
                  <a 
                    href={file.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 text-blue-600 hover:text-blue-800"
                    title="View file"
                  >
                    <FaEye />
                  </a>
                  <button 
                    onClick={() => removeFile(file.id, file.url)}
                    className="p-2 text-red-600 hover:text-red-800"
                    title="Remove file"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
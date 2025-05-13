import { useState, useEffect } from 'react';
import { FaUpload, FaEye, FaTrash, FaFile, FaFilePdf, FaFileWord, FaFileExcel, FaPlus } from 'react-icons/fa';
import supabase from '../lib/supabaseInstance';

// Define document types
type DocumentType = 'commercial_invoice' | 'bill_of_lading' | 'packing_list' | 'other_documents';

// Define uploaded file structure
type UploadedFile = {
  name: string;
  url: string;
  id: number | null;
};

// Define props
type DocumentUploadProps = {
  shipmentId: string | number;
  onDocumentsChange?: () => void;
};

export default function DocumentUpload({ shipmentId, onDocumentsChange }: DocumentUploadProps) {
  const [files, setFiles] = useState<Record<string, File | null>>({
    commercial_invoice: null,
    bill_of_lading: null,
    packing_list: null,
  });
  
  const [otherDocuments, setOtherDocuments] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile | null>>({
    commercial_invoice: null,
    bill_of_lading: null,
    packing_list: null,
  });
  
  const [uploadedOtherDocuments, setUploadedOtherDocuments] = useState<UploadedFile[]>([]);
  
  // Fetch existing documents on component mount
  useEffect(() => {
    if (shipmentId) {
      fetchDocuments();
    }
  }, [shipmentId]);
  
  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('shipment_documents')
        .select('*')
        .eq('shipment_id', shipmentId);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Process standard documents
        const standardDocs = {};
        const otherDocs = [];
        
        data.forEach(doc => {
          if (['commercial_invoice', 'bill_of_lading', 'packing_list'].includes(doc.document_type)) {
            standardDocs[doc.document_type] = {
              name: doc.file_name,
              url: doc.public_url,
              id: doc.id
            };
          } else if (doc.document_type === 'other_documents') {
            otherDocs.push({
              name: doc.file_name,
              url: doc.public_url,
              id: doc.id
            });
          }
        });
        
        setUploadedFiles(prev => ({
          ...prev,
          ...standardDocs
        }));
        
        setUploadedOtherDocuments(otherDocs);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, documentType: DocumentType) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (documentType === 'other_documents') {
      // For other documents, add to array
      uploadFile(file, documentType);
    } else {
      // For standard documents
      setFiles(prev => ({
        ...prev,
        [documentType]: file
      }));
      
      // Upload the file immediately
      uploadFile(file, documentType);
    }
  };
  
  const uploadFile = async (file: File, documentType: DocumentType) => {
    if (!file || !shipmentId) return;
    
    setUploading(true);
    
    try {
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${documentType}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `shipment_documents/${shipmentId}/${fileName}`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('shipment_files')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('shipment_files')
        .getPublicUrl(filePath);
      
      const publicUrl = publicUrlData?.publicUrl;
      
      // Save to database
      const { data, error } = await supabase
        .from('shipment_documents')
        .insert([
          {
            shipment_id: shipmentId,
            document_type: documentType,
            file_name: file.name,
            file_type: fileExt,
            file_size: file.size,
            file_path: filePath,
            public_url: publicUrl
          }
        ])
        .select();
      
      if (error) throw error;
      
      if (documentType === 'other_documents') {
        // For other documents, add to array
        setUploadedOtherDocuments(prev => [
          ...prev,
          {
            name: file.name,
            url: publicUrl,
            id: data && data[0] ? data[0].id : null
          }
        ]);
      } else {
        // For standard documents
        setUploadedFiles(prev => ({
          ...prev,
          [documentType]: {
            name: file.name,
            url: publicUrl,
            id: data && data[0] ? data[0].id : null
          }
        }));
      }
      
      // Notify parent component
      if (onDocumentsChange) {
        onDocumentsChange();
      }
      
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setUploading(false);
    }
  };
  
  const removeFile = async (documentType: DocumentType, fileId: number | null = null) => {
    try {
      if (documentType === 'other_documents' && fileId) {
        // Delete specific other document
        const { error } = await supabase
          .from('shipment_documents')
          .delete()
          .eq('id', fileId);
        
        if (error) throw error;
        
        // Update state
        setUploadedOtherDocuments(prev => 
          prev.filter(doc => doc.id !== fileId)
        );
      } else if (uploadedFiles[documentType]) {
        // Delete standard document
        const { error } = await supabase
          .from('shipment_documents')
          .delete()
          .eq('id', uploadedFiles[documentType]?.id as number);
        
        if (error) throw error;
        
        // Update state
        setUploadedFiles(prev => ({
          ...prev,
          [documentType]: null
        }));
        
        setFiles(prev => ({
          ...prev,
          [documentType]: null
        }));
      }
      
      // Notify parent component
      if (onDocumentsChange) {
        onDocumentsChange();
      }
      
    } catch (error) {
      console.error('Error removing file:', error);
      alert('Error removing file. Please try again.');
    }
  };
  
  const getFileIcon = (fileName: string | undefined) => {
    if (!fileName) return <FaFile />;
    
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    
    if (['pdf'].includes(ext)) {
      return <FaFilePdf className="text-red-500" />;
    } else if (['doc', 'docx'].includes(ext)) {
      return <FaFileWord className="text-blue-500" />;
    } else if (['xls', 'xlsx', 'csv'].includes(ext)) {
      return <FaFileExcel className="text-green-500" />;
    } else {
      return <FaFile className="text-gray-500" />;
    }
  };
  
  const renderFileUpload = (documentType: DocumentType, label: string, required: boolean = false) => {
    const hasFile = uploadedFiles[documentType];
    
    return (
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <label className="block text-gray-700 font-medium">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        </div>
        
        {hasFile ? (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center">
              {getFileIcon(hasFile.name)}
              <span className="ml-2 text-sm truncate max-w-xs">{hasFile.name}</span>
            </div>
            <div className="flex space-x-2">
              <a 
                href={hasFile.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-blue-600 hover:text-blue-800"
                title="View file"
              >
                <FaEye />
              </a>
              <button 
                onClick={() => removeFile(documentType)}
                className="p-2 text-red-600 hover:text-red-800"
                title="Remove file"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-1">
            <label className="block w-full cursor-pointer">
              <div className="flex items-center justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#F39C12]">
                <FaUpload className="mr-2 text-gray-400" />
                <span className="text-gray-500">Upload {label}</span>
              </div>
              <input
                type="file"
                className="hidden"
                onChange={(e) => handleFileChange(e, documentType)}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                disabled={uploading}
              />
            </label>
          </div>
        )}
      </div>
    );
  };
  
  const renderOtherDocumentsUpload = () => {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-gray-700 font-medium">
            Other Documents
          </label>
        </div>
        
        {/* Display uploaded other documents */}
        {uploadedOtherDocuments.length > 0 && (
          <div className="mb-4 space-y-2">
            {uploadedOtherDocuments.map((doc, index) => (
              <div key={doc.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  {getFileIcon(doc.name)}
                  <span className="ml-2 text-sm truncate max-w-xs">{doc.name}</span>
                </div>
                <div className="flex space-x-2">
                  <a 
                    href={doc.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 text-blue-600 hover:text-blue-800"
                    title="View file"
                  >
                    <FaEye />
                  </a>
                  <button 
                    onClick={() => removeFile('other_documents', doc.id)}
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
        
        {/* Upload new other document */}
        <div className="mt-1">
          <label className="block w-full cursor-pointer">
            <div className="flex items-center justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#F39C12]">
              <FaPlus className="mr-2 text-gray-400" />
              <span className="text-gray-500">Add Another Document</span>
            </div>
            <input
              type="file"
              className="hidden"
              onChange={(e) => handleFileChange(e, 'other_documents')}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              disabled={uploading}
            />
          </label>
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">Shipment Documents</h3>
        
        {renderFileUpload('commercial_invoice', 'Commercial Invoice', true)}
        {renderFileUpload('bill_of_lading', 'Bill of Lading', true)}
        {renderFileUpload('packing_list', 'Packing List', true)}
        {renderOtherDocumentsUpload()}
      </div>
    </div>
  );
} 
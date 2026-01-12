// Cloudinary upload utility for client-side
export const uploadToCloudinary = async (
  file: File,
  type: 'image' | 'video' = 'image'
): Promise<string> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dyjecllja';
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'greenverse';
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  // Remove folder parameter - let upload preset handle it

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${type}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Cloudinary error:', data);
      throw new Error(data.error?.message || 'Upload failed');
    }

    return data.secure_url;
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    throw new Error(error.message || 'Failed to upload file');
  }
};

// Upload multiple files
export const uploadMultipleToCloudinary = async (
  files: File[],
  type: 'image' | 'video' = 'image'
): Promise<string[]> => {
  const uploadPromises = files.map((file) => uploadToCloudinary(file, type));
  return Promise.all(uploadPromises);
};

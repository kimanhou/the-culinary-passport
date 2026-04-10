import React, { useState, useRef } from 'react';
import * as AdminService from '../../api/AdminService';

interface AdminPhotoManagerProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  restaurantName: string;
  placesPhotos?: Array<{ name: string; widthPx: number; heightPx: number }>;
}

const AdminPhotoManager: React.FC<AdminPhotoManagerProps> = ({
  images,
  onImagesChange,
  restaurantName,
  placesPhotos,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    onImagesChange([...images, trimmed]);
    setUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await AdminService.uploadPhoto(restaurantName, file);
      onImagesChange([...images, result.path]);
    } catch (err) {
      alert(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddPlacesPhoto = async (photo: { name: string }, index: number) => {
    setDownloadingIndex(index);
    try {
      const result = await AdminService.downloadPhoto(photo.name, restaurantName, index);
      onImagesChange([...images, result.path]);
    } catch (err) {
      alert(`Download failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setDownloadingIndex(null);
    }
  };

  return (
    <div className="admin-photo-manager">
      <label>Images</label>

      {images.length > 0 && (
        <div className="photo-thumbnails" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
          {images.map((img, i) => (
            <div key={i} style={{ position: 'relative', width: '80px', height: '80px' }}>
              <img
                src={img.startsWith('http') ? img : `/${img}`}
                alt={`Restaurant ${i + 1}`}
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(i)}
                style={{
                  position: 'absolute', top: '-4px', right: '-4px',
                  background: '#e74c3c', color: '#fff', border: 'none',
                  borderRadius: '50%', width: '20px', height: '20px',
                  cursor: 'pointer', fontSize: '12px', lineHeight: '20px', padding: 0,
                }}
                aria-label={`Remove image ${i + 1}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="photo-url-input" style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Image URL"
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
          style={{ flex: 1 }}
        />
        <button type="button" onClick={handleAddUrl}>Add URL</button>
      </div>

      <div className="photo-upload" style={{ marginBottom: '8px' }}>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          {uploading ? 'Uploading…' : 'Upload File'}
        </button>
      </div>

      {placesPhotos && placesPhotos.length > 0 && (
        <div className="places-photos">
          <label>Google Places Photos</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
            {placesPhotos.map((photo, i) => {
              const alreadyAdded = images.some((img) => img.includes(photo.name.split('/').pop() || ''));
              return (
                <div key={photo.name} style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '80px', height: '80px', background: '#eee',
                    borderRadius: '4px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '11px', color: '#666',
                  }}>
                    {photo.widthPx}×{photo.heightPx}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddPlacesPhoto(photo, i)}
                    disabled={downloadingIndex === i || alreadyAdded}
                    style={{ marginTop: '4px', fontSize: '12px' }}
                  >
                    {downloadingIndex === i ? 'Adding…' : alreadyAdded ? 'Added' : 'Add'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPhotoManager;

import React, { useState, useEffect, useCallback } from 'react';
import AdminPhotoManager from './AdminPhotoManager';
import AdminPreview from './AdminPreview';
import { validateForm, checkDuplicate } from './adminValidation';
import * as AdminService from '../../api/AdminService';
import './AdminForm.scss';

interface FoodPlaceEntry {
  id: number;
  name: string;
  tags: string[];
  description: string;
  price: string;
  typeOfCuisine: string[];
  neighborhood?: string;
  images?: string[];
  googleMaps?: string;
  instagram?: string;
  website?: string;
  coordinates?: [number, number];
}

interface AdminFormProps {
  city: string;
  existingEntry?: FoodPlaceEntry;
  existingNames: string[];
  onSave: (entry: Omit<FoodPlaceEntry, 'id'> | FoodPlaceEntry) => void;
  onCancel: () => void;
}

const PRICE_OPTIONS = ['$', '$$', '$$$'];

const AdminForm: React.FC<AdminFormProps> = ({
  city,
  existingEntry,
  existingNames,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [typeOfCuisine, setTypeOfCuisine] = useState<string[]>([]);
  const [cuisineInput, setCuisineInput] = useState('');
  const [price, setPrice] = useState('$$');
  const [neighborhood, setNeighborhood] = useState('');
  const [lat, setLat] = useState<string>('');
  const [lng, setLng] = useState<string>('');
  const [googleMaps, setGoogleMaps] = useState('');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const [placesPhotos, setPlacesPhotos] = useState<Array<{ name: string; widthPx: number; heightPx: number }>>([]);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  const isEditing = !!existingEntry;

  // Track previous entry id to detect actual edit→create transitions
  const prevEntryIdRef = React.useRef<number | undefined>(existingEntry?.id);

  // Populate fields when editing an existing entry
  useEffect(() => {
    const prevId = prevEntryIdRef.current;
    const newId = existingEntry?.id;
    prevEntryIdRef.current = newId;

    if (existingEntry) {
      setName(existingEntry.name);
      setDescription(existingEntry.description || '');
      setTypeOfCuisine(existingEntry.typeOfCuisine || []);
      setPrice(existingEntry.price || '$$');
      setNeighborhood(existingEntry.neighborhood || '');
      setLat(existingEntry.coordinates?.[0]?.toString() ?? '');
      setLng(existingEntry.coordinates?.[1]?.toString() ?? '');
      setGoogleMaps(existingEntry.googleMaps || '');
      setWebsite(existingEntry.website || '');
      setInstagram(existingEntry.instagram || '');
      setImages(existingEntry.images || []);
      setTags(existingEntry.tags || []);
      setPlacesPhotos([]);
      setErrors({});
      setDuplicateWarning(false);
      setLookupError('');
    } else if (prevId !== undefined) {
      // Only reset when transitioning from edit mode back to create mode,
      // not on every re-render where existingEntry is undefined
      resetForm();
    }
  }, [existingEntry]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setTypeOfCuisine([]);
    setCuisineInput('');
    setPrice('$$');
    setNeighborhood('');
    setLat('');
    setLng('');
    setGoogleMaps('');
    setWebsite('');
    setInstagram('');
    setImages([]);
    setTags([]);
    setTagInput('');
    setPlacesPhotos([]);
    setErrors({});
    setDuplicateWarning(false);
    setLookupError('');
  };

  // Duplicate detection on name change
  const handleNameChange = useCallback(
    (value: string) => {
      setName(value);
      if (value.trim()) {
        const namesToCheck = isEditing
          ? existingNames.filter((n) => n.toLowerCase() !== existingEntry!.name.toLowerCase())
          : existingNames;
        setDuplicateWarning(checkDuplicate(value, namesToCheck));
      } else {
        setDuplicateWarning(false);
      }
    },
    [existingNames, isEditing, existingEntry],
  );

  // Google Places lookup
  const handlePlacesLookup = async () => {
    if (!name.trim()) {
      setLookupError('Enter a restaurant name first');
      return;
    }
    setLookupLoading(true);
    setLookupError('');
    try {
      const result = await AdminService.placesLookup(name, city);

      if (result.coordinates) {
        setLat(result.coordinates[0].toString());
        setLng(result.coordinates[1].toString());
      }
      if (result.googleMapsUri) {
        setGoogleMaps(result.googleMapsUri);
      }
      if (result.websiteUri) {
        setWebsite(result.websiteUri);
      }

      // Pass photos to AdminPhotoManager — user clicks "Add" to download individually.
      // We don't auto-download here because saving files to public/ triggers
      // CRA's dev server file watcher, which reloads the page and wipes form state.
      const photos = (result.photos || []).slice(0, 3);
      setPlacesPhotos(photos);
    } catch (err) {
      setLookupError(
        `Lookup failed: ${err instanceof Error ? err.message : 'Unknown error'}. You can enter fields manually.`,
      );
    } finally {
      setLookupLoading(false);
    }
  };

  // Multi-input helpers
  const addCuisine = () => {
    const trimmed = cuisineInput.trim();
    if (trimmed && !typeOfCuisine.includes(trimmed)) {
      setTypeOfCuisine([...typeOfCuisine, trimmed]);
    }
    setCuisineInput('');
  };

  const removeCuisine = (index: number) => {
    setTypeOfCuisine(typeOfCuisine.filter((_, i) => i !== index));
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput('');
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // Build form data object
  const buildFormData = () => {
    const coordinates: [number, number] | undefined =
      lat !== '' && lng !== '' ? [parseFloat(lat), parseFloat(lng)] : undefined;

    const entry: Record<string, any> = {
      name: name.trim(),
      description,
      tags,
      price,
      typeOfCuisine,
      neighborhood: neighborhood || undefined,
      images: images.length > 0 ? images : undefined,
      googleMaps: googleMaps || undefined,
      instagram: instagram || undefined,
      website: website || undefined,
      coordinates,
    };

    if (isEditing && existingEntry) {
      entry.id = existingEntry.id;
    }

    return entry;
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = buildFormData();
    const validation = validateForm({ ...formData, city });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setSaving(true);
    try {
      onSave(formData as any);
    } finally {
      setSaving(false);
    }
  };

  // Preview mode
  if (showPreview) {
    const formData = buildFormData();
    return (
      <AdminPreview
        city={city}
        formData={{
          id: isEditing ? existingEntry!.id : undefined,
          name: formData.name || '',
          tags: formData.tags || [],
          description: formData.description || '',
          price: formData.price || '',
          typeOfCuisine: formData.typeOfCuisine || [],
          neighborhood: formData.neighborhood,
          images: formData.images,
          googleMaps: formData.googleMaps,
          instagram: formData.instagram,
          website: formData.website,
          coordinates: formData.coordinates,
        }}
        onBack={() => setShowPreview(false)}
      />
    );
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit} noValidate>
      <div className="admin-form-header">
        <h3>{isEditing ? 'Edit Restaurant' : 'Add Restaurant'}</h3>
        <div className="admin-form-actions-top">
          <button type="button" onClick={() => setShowPreview(true)} className="btn-preview">
            Preview
          </button>
          <button type="button" onClick={onCancel} className="btn-cancel">
            Cancel
          </button>
        </div>
      </div>

      {/* Restaurant Name + Lookup */}
      <div className={`form-field ${errors.name ? 'has-error' : ''}`}>
        <label htmlFor="admin-name">Restaurant Name *</label>
        <div className="name-lookup-row">
          <input
            id="admin-name"
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Restaurant name"
          />
          <button
            type="button"
            onClick={handlePlacesLookup}
            disabled={lookupLoading || !name.trim()}
            className="btn-lookup"
          >
            {lookupLoading ? 'Looking up…' : '🔍 Google Places Lookup'}
          </button>
        </div>
        {errors.name && <span className="field-error">{errors.name}</span>}
        {duplicateWarning && (
          <span className="duplicate-warning">
            ⚠ A restaurant with this name already exists in {city}. You can still save if intended.
          </span>
        )}
        {lookupError && <span className="lookup-error">{lookupError}</span>}
      </div>

      {/* Description */}
      <div className="form-field">
        <label htmlFor="admin-description">Description</label>
        <textarea
          id="admin-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Restaurant description"
          rows={3}
        />
      </div>

      {/* Cuisine Types */}
      <div className={`form-field ${errors.typeOfCuisine ? 'has-error' : ''}`}>
        <label>Cuisine Types *</label>
        <div className="multi-input-row">
          <input
            type="text"
            value={cuisineInput}
            onChange={(e) => setCuisineInput(e.target.value)}
            placeholder="e.g. Italian"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCuisine();
              }
            }}
          />
          <button type="button" onClick={addCuisine}>
            Add
          </button>
        </div>
        {typeOfCuisine.length > 0 && (
          <div className="tag-list">
            {typeOfCuisine.map((c, i) => (
              <span key={i} className="tag">
                {c}
                <button type="button" onClick={() => removeCuisine(i)} aria-label={`Remove ${c}`}>
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        {errors.typeOfCuisine && <span className="field-error">{errors.typeOfCuisine}</span>}
      </div>

      {/* Price Range */}
      <div className="form-field">
        <label htmlFor="admin-price">Price Range</label>
        <select id="admin-price" value={price} onChange={(e) => setPrice(e.target.value)}>
          {PRICE_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Neighborhood */}
      <div className="form-field">
        <label htmlFor="admin-neighborhood">Neighborhood</label>
        <input
          id="admin-neighborhood"
          type="text"
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
          placeholder="e.g. Mile-Ex"
        />
      </div>

      {/* Coordinates */}
      <div className={`form-field ${errors.coordinates ? 'has-error' : ''}`}>
        <label>Coordinates *</label>
        <div className="coordinates-row">
          <input
            type="number"
            step="any"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="Latitude"
          />
          <input
            type="number"
            step="any"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder="Longitude"
          />
        </div>
        {errors.coordinates && <span className="field-error">{errors.coordinates}</span>}
      </div>

      {/* Google Maps URL */}
      <div className="form-field">
        <label htmlFor="admin-googlemaps">Google Maps URL</label>
        <input
          id="admin-googlemaps"
          type="text"
          value={googleMaps}
          onChange={(e) => setGoogleMaps(e.target.value)}
          placeholder="https://maps.app.goo.gl/..."
        />
      </div>

      {/* Website URL */}
      <div className="form-field">
        <label htmlFor="admin-website">Website URL</label>
        <input
          id="admin-website"
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://..."
        />
      </div>

      {/* Instagram URL */}
      <div className="form-field">
        <label htmlFor="admin-instagram">Instagram URL</label>
        <input
          id="admin-instagram"
          type="text"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          placeholder="https://www.instagram.com/..."
        />
      </div>

      {/* Photos */}
      <div className="form-field">
        <AdminPhotoManager
          images={images}
          onImagesChange={setImages}
          restaurantName={name}
          placesPhotos={placesPhotos.length > 0 ? placesPhotos : undefined}
        />
      </div>

      {/* Tags */}
      <div className="form-field">
        <label>Tags</label>
        <div className="multi-input-row">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="e.g. date-night"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <button type="button" onClick={addTag}>
            Add
          </button>
        </div>
        {tags.length > 0 && (
          <div className="tag-list">
            {tags.map((t, i) => (
              <span key={i} className="tag">
                {t}
                <button type="button" onClick={() => removeTag(i)} aria-label={`Remove ${t}`}>
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="form-field form-submit">
        <button type="submit" disabled={saving} className="btn-save">
          {saving ? 'Saving…' : isEditing ? 'Update Restaurant' : 'Add Restaurant'}
        </button>
        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AdminForm;

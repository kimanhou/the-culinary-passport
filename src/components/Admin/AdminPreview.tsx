import React, { useState } from 'react';
import FoodPlaceCard from '../FoodPlaceList/Card/FoodPlaceCard';
import FoodPlace from '../../model/FoodPlace';
import { CityEnum, ToastNotificationEnum } from '../../ts/enum';

interface AdminPreviewProps {
  city: string;
  formData: {
    id?: number;
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
  };
  onBack: () => void;
}

const cityToCityEnum: Record<string, CityEnum> = {
  montreal: CityEnum.MONTREAL,
  paris: CityEnum.PARIS,
  tokyo: CityEnum.TOKYO,
  london: CityEnum.LONDON,
};

const AdminPreview: React.FC<AdminPreviewProps> = ({ city, formData, onBack }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const foodPlace = new FoodPlace(
    formData.id ?? 0,
    formData.name,
    formData.tags,
    formData.description,
    formData.price,
    formData.typeOfCuisine,
    formData.neighborhood,
    formData.images,
    formData.googleMaps,
    formData.instagram,
    formData.website,
    formData.coordinates,
  );

  const cityEnum = cityToCityEnum[city] ?? CityEnum.MONTREAL;

  return (
    <div className="admin-preview">
      <div className="admin-preview-header" style={{ marginBottom: '16px' }}>
        <button type="button" onClick={onBack}>
          ← Back to Edit
        </button>
        <span style={{ marginLeft: '12px', fontWeight: 500 }}>Preview</span>
      </div>
      <div className="admin-preview-card" style={{ maxWidth: '500px' }}>
        <FoodPlaceCard
          city={cityEnum}
          foodPlace={foodPlace}
          onLike={() => {}}
          isFullScreen={isFullScreen}
          setIsFullScreen={setIsFullScreen}
          showToast={(_msg: string, _type: ToastNotificationEnum) => {}}
        />
      </div>
    </div>
  );
};

export default AdminPreview;

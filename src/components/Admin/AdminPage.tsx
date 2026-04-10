import React, { useState, useEffect, useCallback } from 'react';
import AdminRestaurantList from './AdminRestaurantList';
import AdminForm from './AdminForm';
import * as AdminService from '../../api/AdminService';
import ToastList from '../ToastNotification/List/ToastList';
import { useToastNotifications } from '../../hooks/useToastNotifications';
import { POSITION } from '../ToastNotification/constants';
import { ToastNotificationEnum } from '../../ts/enum';
import './AdminPage.scss';

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

const CITIES = ['montreal', 'paris', 'tokyo', 'london'] as const;

const AdminPage: React.FC = () => {
  const [city, setCity] = useState<string>(CITIES[0]);
  const [restaurants, setRestaurants] = useState<FoodPlaceEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<FoodPlaceEntry | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const { toasts, removeToast, showToast } = useToastNotifications();

  const loadRestaurants = useCallback(async (selectedCity: string) => {
    setLoading(true);
    try {
      const data = await AdminService.fetchRestaurants(selectedCity);
      setRestaurants(data);
    } catch (err: any) {
      showToast(`Failed to load restaurants: ${err.message}`, ToastNotificationEnum.FAILURE);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadRestaurants(city);
  }, [city, loadRestaurants]);

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCity(e.target.value);
    setEditingEntry(undefined);
  };

  const handleEdit = (entry: FoodPlaceEntry) => {
    setEditingEntry(entry);
  };

  const handleAddNew = () => {
    setEditingEntry(undefined);
  };

  const handleCancel = () => {
    setEditingEntry(undefined);
  };

  const handleSave = async (entry: Omit<FoodPlaceEntry, 'id'> | FoodPlaceEntry) => {
    try {
      if ('id' in entry && entry.id) {
        await AdminService.updateRestaurant(city, entry);
        showToast(`"${entry.name}" updated successfully.`, ToastNotificationEnum.SUCCESS);
      } else {
        await AdminService.createRestaurant(city, entry);
        showToast(`"${entry.name}" created successfully.`, ToastNotificationEnum.SUCCESS);
      }
      setEditingEntry(undefined);
      await loadRestaurants(city);
    } catch (err: any) {
      showToast(`Save failed: ${err.message}`, ToastNotificationEnum.FAILURE);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await AdminService.deleteRestaurant(city, id);
      showToast('Restaurant deleted.', ToastNotificationEnum.SUCCESS);
      if (editingEntry?.id === id) {
        setEditingEntry(undefined);
      }
      await loadRestaurants(city);
    } catch (err: any) {
      showToast(`Delete failed: ${err.message}`, ToastNotificationEnum.FAILURE);
    }
  };

  const handleMoveUp = async (id: number) => {
    const index = restaurants.findIndex((r) => r.id === id);
    if (index <= 0) return;
    const newOrder = [...restaurants];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    const orderedIds = newOrder.map((r) => r.id);
    try {
      await AdminService.reorderRestaurants(city, orderedIds);
      setRestaurants(newOrder);
    } catch (err: any) {
      showToast(`Reorder failed: ${err.message}`, ToastNotificationEnum.FAILURE);
    }
  };

  const handleMoveDown = async (id: number) => {
    const index = restaurants.findIndex((r) => r.id === id);
    if (index < 0 || index >= restaurants.length - 1) return;
    const newOrder = [...restaurants];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    const orderedIds = newOrder.map((r) => r.id);
    try {
      await AdminService.reorderRestaurants(city, orderedIds);
      setRestaurants(newOrder);
    } catch (err: any) {
      showToast(`Reorder failed: ${err.message}`, ToastNotificationEnum.FAILURE);
    }
  };

  const existingNames = restaurants.map((r) => r.name);

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1>Restaurant Admin</h1>
        <div className="admin-page-controls">
          <label htmlFor="city-selector">City:</label>
          <select id="city-selector" value={city} onChange={handleCityChange}>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
          <button type="button" className="btn-add-new" onClick={handleAddNew}>
            + Add New
          </button>
        </div>
      </header>

      {loading && <p className="loading-text">Loading…</p>}

      <div className="admin-page-panels">
        <div className="admin-page-list">
          <AdminRestaurantList
            city={city}
            restaurants={restaurants}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
          />
        </div>
        <div className="admin-page-form">
          <AdminForm
            city={city}
            existingEntry={editingEntry}
            existingNames={existingNames}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </div>

      <ToastList data={toasts} position={POSITION} removeToast={removeToast} />
    </div>
  );
};

export default AdminPage;

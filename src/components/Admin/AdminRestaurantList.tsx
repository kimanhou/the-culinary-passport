import React from 'react';

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

interface AdminRestaurantListProps {
  city: string;
  restaurants: FoodPlaceEntry[];
  onEdit: (entry: FoodPlaceEntry) => void;
  onDelete: (id: number) => void;
  onMoveUp: (id: number) => void;
  onMoveDown: (id: number) => void;
}

const AdminRestaurantList: React.FC<AdminRestaurantListProps> = ({
  city,
  restaurants,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  const handleDelete = (entry: FoodPlaceEntry) => {
    if (window.confirm(`Delete "${entry.name}"? This cannot be undone.`)) {
      onDelete(entry.id);
    }
  };

  return (
    <div className="admin-restaurant-list">
      <h3>Restaurants in {city.charAt(0).toUpperCase() + city.slice(1)} ({restaurants.length})</h3>
      {restaurants.length === 0 ? (
        <p className="empty-list">No restaurants found for this city.</p>
      ) : (
        <table className="restaurant-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Neighborhood</th>
              <th>Cuisine</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((entry, index) => (
              <tr key={entry.id}>
                <td>{index + 1}</td>
                <td>{entry.name}</td>
                <td>{entry.neighborhood || '—'}</td>
                <td>{(entry.typeOfCuisine || []).join(', ') || '—'}</td>
                <td className="actions-cell">
                  <button type="button" onClick={() => onEdit(entry)} title="Edit">
                    ✏️ Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(entry)} title="Delete">
                    🗑️ Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => { if (index > 0) onMoveUp(entry.id); }}
                    disabled={index === 0}
                    title="Move Up"
                  >
                    ⬆️ Up
                  </button>
                  <button
                    type="button"
                    onClick={() => { if (index < restaurants.length - 1) onMoveDown(entry.id); }}
                    disabled={index === restaurants.length - 1}
                    title="Move Down"
                  >
                    ⬇️ Down
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminRestaurantList;

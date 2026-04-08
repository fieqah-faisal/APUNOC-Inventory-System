import React, { useEffect, useState } from "react";
import { Package, Plus, Minus, AlertTriangle } from "lucide-react";
import { Consumable } from "../models/Consumable";
import { useAuth } from "../hooks/useAuth";
import { getConsumables, updateConsumable } from "../services/consumableService";

const Consumables: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Consumable[]>([]);
  const [loading, setLoading] = useState(true);

  const loadConsumables = async () => {
    try {
      const data = await getConsumables();
      setItems(data);
    } catch (error) {
      console.error("Failed to load consumables:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConsumables();
  }, []);

  const updateQuantity = async (item: Consumable, change: number) => {
    if (!user || !item.id) return;

    const newQuantity = Math.max(0, item.quantity + change);

    try {
      await updateConsumable(
        item.id,
        {
          quantity: newQuantity,
        },
        user
      );

      setItems((prev) =>
        prev.map((existing) =>
          existing.id === item.id
            ? { ...existing, quantity: newQuantity }
            : existing
        )
      );
    } catch (error) {
      console.error("Failed to update consumable quantity:", error);
    }
  };

  const isLowStock = (item: Consumable) => item.quantity <= item.minimumThreshold;

  if (loading) {
    return <div className="p-6">Loading consumables...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Package className="w-7 h-7 mr-3 text-green-600" />
          Consumables Inventory
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Track cables, connectors, and other consumable items
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const lowStock = isLowStock(item);

          return (
            <div
              key={item.id}
              className={`bg-white rounded-xl p-6 card-shadow hover:card-shadow-hover transition-all ${
                lowStock ? "ring-2 ring-amber-400" : ""
              }`}
            >
              {lowStock && (
                <div className="bg-amber-100 text-amber-800 font-semibold px-3 py-1.5 rounded-lg text-xs inline-flex items-center mb-3 border border-amber-200">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                  LOW STOCK ALERT
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                  {item.category}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {item.itemName}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Unit: <span className="font-semibold">{item.unit}</span>
              </p>

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl mb-4 border border-indigo-100">
                <p className="text-sm font-medium text-gray-600 mb-1">Current Stock</p>
                <p className="text-4xl font-bold text-gray-900">{item.quantity}</p>
                <div className="mt-3 pt-3 border-t border-indigo-200">
                  <p className="text-sm text-gray-600">
                    Min Threshold:{" "}
                    <span
                      className={`font-semibold ${
                        lowStock ? "text-amber-600" : "text-gray-900"
                      }`}
                    >
                      {item.minimumThreshold}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => updateQuantity(item, -1)}
                  className="flex-1 bg-red-600 text-white font-semibold px-4 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                  <Minus className="w-5 h-5 mr-1" />
                  Remove
                </button>
                <button
                  onClick={() => updateQuantity(item, 1)}
                  className="flex-1 bg-green-600 text-white font-semibold px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 mr-1" />
                  Add
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="bg-white rounded-xl p-12 card-shadow text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-semibold text-gray-900">No consumables found</p>
          <p className="text-gray-600 mt-2">
            Add consumables to begin tracking stock levels
          </p>
        </div>
      )}
    </div>
  );
};

export default Consumables;
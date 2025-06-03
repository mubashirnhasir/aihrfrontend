"use client";
import { useEffect, useState } from "react";
import AssetCard from "./assetsCard";
import AddAssetModal from "./assetsModal";

export default function AssetsWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAssets = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/assets"); // or /api/assets if proxied
      const data = await res.json();
      setAssets(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching assets:", err);
      setLoading(false);
    }
  };

  console.log("mubashirasssets",assets)

  const handleAddAsset = async (asset) => {
    try {
      const res = await fetch("http://localhost:5000/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(asset),
      });

      if (res.ok) {
        fetchAssets(); // refresh list
        setIsOpen(false);
      }
    } catch (err) {
      console.error("Error adding asset:", err);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4 border-b-2 border-gray-200 pb-2">
        <div>
          <h2 className="text-3xl font-semibold">Assets</h2>
          <p className="text-sm text-gray-500">All Assigned Assets</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white cursor-pointer text-sm px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add New Assets
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          assets.map((asset, i) => <AssetCard key={asset._id || i} asset={asset} />)
        )}
      </div>

      <AddAssetModal isOpen={isOpen} setIsOpen={setIsOpen} onSave={handleAddAsset} />
    </div>
  );
}

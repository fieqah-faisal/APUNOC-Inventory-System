import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Archive,
  MapPin,
  Package,
  UserCheck,
  X,
} from "lucide-react";
import { Asset } from "../models/Asset";
import { AssetStatus } from "../models/enums";
import { useAuth } from "../hooks/useAuth";
import {
  archiveAsset,
  createAsset,
  getAssets,
  retireAsset,
  updateAssetAdminFields,
} from "../services/assetService";
import {
  canArchiveAsset,
  canRetireAsset,
  canEditAssetAdminFields,
} from "../permissions/permissions";

const Assets: React.FC = () => {
  const { user } = useAuth();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState<AssetStatus | "all">("all");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const initialFormState = {
    assetCode: "",
    barcode: "",
    category: "",
    subcategory: "",
    brand: "",
    model: "",
    serialNumber: "",
    status: "in_stock" as AssetStatus,
    locationType: "campus" as Asset["locationType"],
    siteName: "",
    buildingOrBlock: "",
    floor: "",
    roomOrUnit: "",
    rack: "",
    deployedToLocation: "",
    issuedToUser: "",
    custodian: "",
    purchaseDate: "",
    warrantyExpiry: "",
    remarks: "",
    importedFrom: null as string | null,
  };

  const [formData, setFormData] = useState(initialFormState);

  const loadAssets = async () => {
    try {
      const data = await getAssets();
      setAssets(data);
    } catch (error) {
      console.error("Failed to load assets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch =
        asset.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.assetCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        filterCategory === "all" || asset.category === filterCategory;

      const matchesStatus =
        filterStatus === "all" || asset.status === filterStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [assets, searchTerm, filterCategory, filterStatus]);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(assets.map((asset) => asset.category))).sort();
  }, [assets]);

  const getStatusColor = (status: AssetStatus) => {
    const colors: Record<AssetStatus, string> = {
      in_stock: "bg-green-100 text-green-800 border-green-200",
      deployed: "bg-blue-100 text-blue-800 border-blue-200",
      under_repair: "bg-red-100 text-red-800 border-red-200",
      replacement: "bg-amber-100 text-amber-800 border-amber-200",
      retired: "bg-gray-100 text-gray-800 border-gray-200",
      archived: "bg-slate-100 text-slate-800 border-slate-200",
    };

    return colors[status];
  };

  const getStatusLabel = (status: AssetStatus) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setSelectedAsset(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    resetForm();
  };

  const openEditModal = (asset: Asset) => {
    setSelectedAsset(asset);
    setFormData({
      assetCode: asset.assetCode,
      barcode: asset.barcode,
      category: asset.category,
      subcategory: asset.subcategory,
      brand: asset.brand,
      model: asset.model,
      serialNumber: asset.serialNumber,
      status: asset.status,
      locationType: asset.locationType,
      siteName: asset.siteName,
      buildingOrBlock: asset.buildingOrBlock,
      floor: asset.floor,
      roomOrUnit: asset.roomOrUnit,
      rack: asset.rack ?? "",
      deployedToLocation: asset.deployedToLocation ?? "",
      issuedToUser: asset.issuedToUser ?? "",
      custodian: asset.custodian ?? "",
      purchaseDate: "",
      warrantyExpiry: "",
      remarks: asset.remarks ?? "",
      importedFrom: asset.importedFrom ?? null,
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    resetForm();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSubmitting(true);

      await createAsset(
        {
          assetCode: formData.assetCode,
          barcode: formData.barcode,
          category: formData.category,
          subcategory: formData.subcategory,
          brand: formData.brand,
          model: formData.model,
          serialNumber: formData.serialNumber,
          status: formData.status,
          locationType: formData.locationType,
          siteName: formData.siteName,
          buildingOrBlock: formData.buildingOrBlock,
          floor: formData.floor,
          roomOrUnit: formData.roomOrUnit,
          rack: formData.rack || null,
          deployedToLocation: formData.deployedToLocation || null,
          issuedToUser: formData.issuedToUser || null,
          custodian: formData.custodian || null,
          purchaseDate: null,
          warrantyExpiry: null,
          remarks: formData.remarks,
          importedFrom: formData.importedFrom,
        },
        user
      );

      await loadAssets();
      closeAddModal();
    } catch (error) {
      console.error("Failed to create asset:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedAsset?.id) return;

    try {
      setSubmitting(true);

      await updateAssetAdminFields(
        selectedAsset.id,
        {
          category: formData.category,
          subcategory: formData.subcategory,
          brand: formData.brand,
          model: formData.model,
          serialNumber: formData.serialNumber,
          status: formData.status,
          locationType: formData.locationType,
          siteName: formData.siteName,
          buildingOrBlock: formData.buildingOrBlock,
          floor: formData.floor,
          roomOrUnit: formData.roomOrUnit,
          rack: formData.rack || null,
          deployedToLocation: formData.deployedToLocation || null,
          issuedToUser: formData.issuedToUser || null,
          custodian: formData.custodian || null,
          remarks: formData.remarks,
        },
        user
      );

      await loadAssets();
      closeEditModal();
    } catch (error) {
      console.error("Failed to update asset:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetireAsset = async (asset: Asset) => {
    if (!user || !asset.id || !canRetireAsset(user)) return;

    try {
      await retireAsset(asset.id, user, "Marked as retired from Assets page");
      await loadAssets();
    } catch (error) {
      console.error("Failed to retire asset:", error);
    }
  };

  const handleArchiveAsset = async (asset: Asset) => {
    if (!user || !asset.id || !canArchiveAsset(user)) return;

    try {
      await archiveAsset(asset.id, user, "Archived from Assets page");
      await loadAssets();
    } catch (error) {
      console.error("Failed to archive asset:", error);
    }
  };

  const FormSection = ({
    title,
    subtitle,
    children,
  }: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
  }) => (
    <div className="md:col-span-2 border border-gray-200 rounded-xl p-4 bg-gray-50">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );

  const renderAssetForm = (mode: "add" | "edit") => (
    <form
      onSubmit={mode === "add" ? handleCreateAsset : handleEditAsset}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <FormSection
        title="Asset Identity"
        subtitle="Required fields to uniquely identify the asset."
      >
        <input
          name="assetCode"
          value={formData.assetCode}
          onChange={handleInputChange}
          placeholder="Asset Code"
          className={`w-full px-4 py-3 rounded-lg border border-gray-300 ${
            mode === "edit" ? "bg-gray-100" : ""
          }`}
          required
          disabled={mode === "edit"}
        />
        <input
          name="barcode"
          value={formData.barcode}
          onChange={handleInputChange}
          placeholder="Barcode"
          className={`w-full px-4 py-3 rounded-lg border border-gray-300 ${
            mode === "edit" ? "bg-gray-100" : ""
          }`}
          required
          disabled={mode === "edit"}
        />
        <input
          name="serialNumber"
          value={formData.serialNumber}
          onChange={handleInputChange}
          placeholder="Serial Number"
          className="w-full px-4 py-3 rounded-lg border border-gray-300"
          required
        />
      </FormSection>

      <FormSection
        title="Asset Classification"
        subtitle="Required fields describing what the asset is."
      >
        <input
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          placeholder="Category"
          className="w-full px-4 py-3 rounded-lg border border-gray-300"
          required
        />
        <input
          name="subcategory"
          value={formData.subcategory}
          onChange={handleInputChange}
          placeholder="Subcategory"
          className="w-full px-4 py-3 rounded-lg border border-gray-300"
          required
        />
        <input
          name="brand"
          value={formData.brand}
          onChange={handleInputChange}
          placeholder="Brand"
          className="w-full px-4 py-3 rounded-lg border border-gray-300"
          required
        />
        <input
          name="model"
          value={formData.model}
          onChange={handleInputChange}
          placeholder="Model"
          className="w-full px-4 py-3 rounded-lg border border-gray-300"
          required
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300"
        >
          <option value="in_stock">In Stock</option>
          <option value="deployed">Deployed</option>
          <option value="under_repair">Under Repair</option>
          <option value="replacement">Replacement</option>
          <option value="retired">Retired</option>
          <option value="archived">Archived</option>
        </select>
      </FormSection>

      <FormSection
        title="Site Information"
        subtitle="Only site name is required. Exact placement can be added later."
      >
        <select
          name="locationType"
          value={formData.locationType}
          onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300"
        >
          <option value="campus">Campus</option>
          <option value="accommodation_on_campus">On Campus Accommodation</option>
          <option value="accommodation_off_campus">Off Campus Accommodation</option>
          <option value="satellite_campus">Satellite Campus</option>
          <option value="storeroom">Storeroom</option>
        </select>
        <input
          name="siteName"
          value={formData.siteName}
          onChange={handleInputChange}
          placeholder="Site Name"
          className="w-full px-4 py-3 rounded-lg border border-gray-300"
          required
        />
        <input
          name="buildingOrBlock"
          value={formData.buildingOrBlock}
          onChange={handleInputChange}
          placeholder="Building / Block (optional)"
          className="w-full px-4 py-3 rounded-lg border border-gray-300"
        />
        <input
          name="floor"
          value={formData.floor}
          onChange={handleInputChange}
          placeholder="Floor (optional)"
          className="w-full px-4 py-3 rounded-lg border border-gray-300"
        />
        <input
          name="roomOrUnit"
          value={formData.roomOrUnit}
          onChange={handleInputChange}
          placeholder="Room / Unit (optional)"
          className="w-full px-4 py-3 rounded-lg border border-gray-300"
        />
        <input
          name="rack"
          value={formData.rack}
          onChange={handleInputChange}
          placeholder="Rack (optional)"
          className="w-full px-4 py-3 rounded-lg border border-gray-300"
        />
      </FormSection>

      <FormSection
        title="Assignment"
        subtitle="Optional fields for deployment and responsibility."
      >
        <input
          name="deployedToLocation"
          value={formData.deployedToLocation}
          onChange={handleInputChange}
          placeholder="Deployed To Location (optional)"
          className="w-full px-4 py-3 rounded-lg border border-gray-300"
        />
        <input
          name="issuedToUser"
          value={formData.issuedToUser}
          onChange={handleInputChange}
          placeholder="Issued To User (optional)"
          className="w-full px-4 py-3 rounded-lg border border-gray-300"
        />
        <input
          name="custodian"
          value={formData.custodian}
          onChange={handleInputChange}
          placeholder="Custodian (optional)"
          className="w-full px-4 py-3 rounded-lg border border-gray-300"
        />
      </FormSection>

      <FormSection
        title="Additional Details"
        subtitle="Optional notes for future reference."
      >
        <textarea
          name="remarks"
          value={formData.remarks}
          onChange={handleInputChange}
          placeholder="Remarks (optional)"
          className="md:col-span-2 w-full px-4 py-3 rounded-lg border border-gray-300"
          rows={4}
        />
      </FormSection>

      <div className="md:col-span-2 flex justify-end gap-3 mt-2">
        <button
          type="button"
          onClick={mode === "add" ? closeAddModal : closeEditModal}
          className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-60"
        >
          {submitting
            ? mode === "add"
              ? "Creating..."
              : "Saving..."
            : mode === "add"
            ? "Create Asset"
            : "Save Changes"}
        </button>
      </div>
    </form>
  );

  if (loading) {
    return <div className="p-6">Loading assets...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Package className="w-7 h-7 mr-3 text-indigo-600" />
              Asset Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage and track all network assets
            </p>
          </div>

          {canEditAssetAdminFields(user) && (
            <button
              onClick={openAddModal}
              className="gradient-primary text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Asset
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as AssetStatus | "all")}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="in_stock">In Stock</option>
            <option value="deployed">Deployed</option>
            <option value="under_repair">Under Repair</option>
            <option value="replacement">Replacement</option>
            <option value="retired">Retired</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="bg-white rounded-xl p-6 card-shadow hover:card-shadow-hover transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                {asset.category}
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                  asset.status
                )}`}
              >
                {getStatusLabel(asset.status)}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-3">
              {asset.brand} {asset.model}
            </h3>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Asset Code:</span>
                <span className="font-semibold text-gray-900">
                  {asset.assetCode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Barcode:</span>
                <span className="font-mono text-xs text-gray-900">
                  {asset.barcode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Serial:</span>
                <span className="font-mono text-xs text-gray-900">
                  {asset.serialNumber}
                </span>
              </div>
            </div>

            <div className="flex items-start text-sm mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">
                  {asset.buildingOrBlock || "Unassigned"}
                </p>
                <p className="text-gray-600">
                  {asset.floor || "-"} - {asset.roomOrUnit || "-"}
                </p>
                {asset.rack && <p className="text-gray-600">{asset.rack}</p>}
              </div>
            </div>

            {(asset.issuedToUser || asset.custodian) && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm">
                <div className="flex items-start">
                  <UserCheck className="w-4 h-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
                  <div className="space-y-1">
                    {asset.issuedToUser && (
                      <p className="text-gray-700">
                        <span className="font-semibold">Issued To:</span>{" "}
                        {asset.issuedToUser}
                      </p>
                    )}
                    {asset.custodian && (
                      <p className="text-gray-700">
                        <span className="font-semibold">Custodian:</span>{" "}
                        {asset.custodian}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {asset.remarks && (
              <p className="text-sm text-gray-600 mb-4 italic bg-amber-50 p-2 rounded border border-amber-200">
                {asset.remarks}
              </p>
            )}

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              {canEditAssetAdminFields(user) && (
                <button
                  onClick={() => openEditModal(asset)}
                  className="flex-1 bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </button>
              )}

              {canRetireAsset(user) &&
                asset.status !== "retired" &&
                asset.status !== "archived" && (
                  <button
                    onClick={() => handleRetireAsset(asset)}
                    className="flex-1 bg-amber-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    Retire
                  </button>
                )}

              {canArchiveAsset(user) && asset.status !== "archived" && (
                <button
                  onClick={() => handleArchiveAsset(asset)}
                  className="bg-slate-700 text-white font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center"
                  title="Archive Asset"
                >
                  <Archive className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredAssets.length === 0 && (
        <div className="bg-white rounded-xl p-12 card-shadow text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-semibold text-gray-900">No assets found</p>
          <p className="text-gray-600 mt-2">
            Try adjusting your filters or add a new asset
          </p>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Add New Asset</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Only core fields are required. Additional information can be added later.
                </p>
              </div>
              <button onClick={closeAddModal}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {renderAssetForm("add")}
          </div>
        </div>
      )}

      {showEditModal && selectedAsset && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Edit Asset</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Update core details first. Secondary fields remain optional.
                </p>
              </div>
              <button onClick={closeEditModal}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {renderAssetForm("edit")}
          </div>
        </div>
      )}
    </div>
  );
};

export default Assets;
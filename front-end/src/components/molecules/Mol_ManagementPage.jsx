import { useState, useEffect } from "react";
import Input from "../atoms/Atm_Inputs";
import Button from "../atoms/Atm_Button";
import ApiService from "../../scripts/PostManager";

export default function ManagementPage() {
  const [products, setProducts] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProducts();
    fetchRawMaterials();
  }, []);

  const fetchProducts = async () => {
    const data = await ApiService.InternalGet("/api/products/products");
    setProducts(data);
  };

  const fetchRawMaterials = async () => {
    const data = await ApiService.InternalGet(
      "/api/raw-materials/raw_materials",
    );
    setRawMaterials(data);
  };

  const handleSelectProduct = (product) => {
    setSelectedItem({ type: "product", data: product });
    setFormData(product);
  };

  const handleSelectRawMaterial = (raw) => {
    setSelectedItem({ type: "raw", data: raw });
    setFormData(raw);
  };

  const handleNewProduct = () => {
    const newProduct = {
      id: null,
      name: "",
      quantity: 0,
      price: 0,
      materials: "[]",
    };
    setSelectedItem({ type: "product", data: newProduct });
    setFormData(newProduct);
  };

  const handleNewRawMaterial = () => {
    const newRaw = {
      id: null,
      name: "",
      stockQuantity: 0,
      identifier: "",
    };
    setSelectedItem({ type: "raw", data: newRaw });
    setFormData(newRaw);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!selectedItem) return;

    const { type, data } = selectedItem;
    const isNew = !data.id;

    let url, method, payload;

    if (type === "product") {
      url = isNew
        ? "/api/products/new_product"
        : "/api/products/update_product";
      method = isNew ? "POST" : "PUT";
      payload = {
        id: formData.id,
        name: formData.name,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        materials: formData.materials,
      };
    } else {
      url = isNew
        ? "/api/raw-materials/new_raw_material"
        : "/api/raw-materials/update_raw_material";
      method = isNew ? "POST" : "PUT";
      payload = {
        id: formData.id,
        name: formData.name,
        stockQuantity: Number(formData.stockQuantity),
        identifier: formData.identifier,
      };
    }

    if (method === "POST") {
      await ApiService.Post(url, payload);
    } else {
      await ApiService.Put(url, payload);
    }

    await fetchProducts();
    await fetchRawMaterials();
    setSelectedItem(null);
    setFormData({});
    alert("Item saved successfully!");
  };

  const handleDelete = async () => {
    if (!selectedItem?.data?.id) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    const { type, data } = selectedItem;
    const url =
      type === "product"
        ? `/api/products/delete_product?id=${data.id}`
        : `/api/raw-materials/delete_raw_material?id=${data.id}`;

    await ApiService.Delete(url);
    await fetchProducts();
    await fetchRawMaterials();
    setSelectedItem(null);
    setFormData({});
    alert("Item removed successfully!");
  };

  const renderForm = () => {
    if (!selectedItem) {
      return (
        <div className="text-black/60">
          Select an item to edit or create a new one.
        </div>
      );
    }

    const { type } = selectedItem;

    if (type === "product") {
      return (
        <div className="w-full max-w-md space-y-4">
          <h2 className="text-xl font-semibold">
            {formData.id ? "Edit Product" : "New Product"}
          </h2>

          <Input
            placeholder="Name"
            value={formData.name || ""}
            onChange={(e) => handleFormChange("name", e.target.value)}
          />

          <Input
            type="number"
            placeholder="Quantity"
            value={formData.quantity || 0}
            onChange={(e) => handleFormChange("quantity", e.target.value)}
          />

          <Input
            type="number"
            step="0.01"
            placeholder="Price"
            value={formData.price || 0}
            onChange={(e) => handleFormChange("price", e.target.value)}
          />

          <textarea
            className="w-full border border-black/20 rounded-lg p-2 font-mono text-sm"
            rows={5}
            value={formData.materials || "[]"}
            onChange={(e) => handleFormChange("materials", e.target.value)}
          />
        </div>
      );
    }

    return (
      <div className="w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">
          {formData.id ? "Edit Raw Material" : "New Raw Material"}
        </h2>

        <Input
          placeholder="Name"
          value={formData.name || ""}
          onChange={(e) => handleFormChange("name", e.target.value)}
        />

        <Input
          type="number"
          placeholder="Stock Quantity"
          value={formData.stockQuantity || 0}
          onChange={(e) =>
            handleFormChange("stockQuantity", e.target.value)
          }
        />

        <Input
          placeholder="Identifier"
          value={formData.identifier || ""}
          onChange={(e) => handleFormChange("identifier", e.target.value)}
        />
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 h-full">
      <h1 className="text-2xl font-semibold mb-6">Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
        <div className="md:col-span-4 flex flex-col gap-6 overflow-y-auto max-h-[50vh] md:max-h-full">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Products</h2>
              <Button
                onClick={handleNewProduct}
                className="bg-blue-600 hover:bg-blue-700 text-sm px-3 py-1"
              >
                New
              </Button>
            </div>

            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => handleSelectProduct(product)}
                className={`px-4 py-2 rounded-lg text-left transition ${
                  selectedItem?.type === "product" &&
                  selectedItem.data.id === product.id
                    ? "bg-blue-600 text-white"
                    : "bg-black/5 hover:bg-black/10"
                }`}
              >
                {product.name}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Raw Materials</h2>
              <Button
                onClick={handleNewRawMaterial}
                className="bg-blue-600 hover:bg-blue-700 text-sm px-3 py-1"
              >
                New
              </Button>
            </div>

            {rawMaterials.map((raw) => (
              <button
                key={raw.id}
                onClick={() => handleSelectRawMaterial(raw)}
                className={`px-4 py-2 rounded-lg text-left transition ${
                  selectedItem?.type === "raw" &&
                  selectedItem.data.id === raw.id
                    ? "bg-blue-600 text-white"
                    : "bg-black/5 hover:bg-black/10"
                }`}
              >
                {raw.name} ({raw.identifier})
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-8 flex flex-col gap-6">
          {renderForm()}
          {selectedItem && (
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700"
              >
                Save
              </Button>
              {selectedItem.data.id && (
                <Button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import ProductInputsGrid from "../molecules/Mol_ProductInputGrid";
import ApiService from "../../scripts/PostManager";

export default function ProductRegister() {
  const [product, setProduct] = useState({
    name: "",
    quantity: "",
    price: "",
    materials: [{ name: "", quantity: "" }],
  });

  function handleAddMaterial() {
    setProduct(prev => ({
      ...prev,
      materials: [...prev.materials, { name: "", quantity: "" }],
    }));
  }

  function handleRemoveMaterial(index) {
    setProduct(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index),
    }));
  }

  function handleChange(e) {
    const { name, value } = e.target;

    if (name.startsWith("material")) {
      const [, index, field] = name.split(".");
      setProduct(prev => {
        const materials = [...prev.materials];
        materials[index] = { ...materials[index], [field]: value };
        return { ...prev, materials };
      });
      return;
    }

    setProduct(prev => ({ ...prev, [name]: value }));
  }

  async function handleSendToDatabase() {
    try {
      const payload = {
        name: product.name,
        quantity: Number(product.quantity),
        price: Number(product.price),
        materials: JSON.stringify(
          product.materials.map(m => ({
            name: m.name,
            requiredQuantity: Number(m.quantity),
          }))
        ),
      };

      const response = await ApiService.Post(
        "/api/products/new_product",
        payload
      );

      console.log("Success:", response);
      alert("Registred product successfully!");
    } catch (err) {
      console.error("Error:", err);
      alert("Error registring product. Please check the console for details.");
    }
  }

  return (
    <ProductInputsGrid
      product={product}
      handleChange={handleChange}
      handleAddMaterial={handleAddMaterial}
      handleRemoveMaterial={handleRemoveMaterial}
      handleSendToDatabase={handleSendToDatabase}
    />
  );
}
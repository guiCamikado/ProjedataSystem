import { useState } from "react";
import ProductInputsGrid from "../molecules/Mol_ProductInputGrid";

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

  return (
    <ProductInputsGrid
      product={product}
      handleChange={handleChange}
      handleAddMaterial={handleAddMaterial}
      handleRemoveMaterial={handleRemoveMaterial}
    />
  );
}
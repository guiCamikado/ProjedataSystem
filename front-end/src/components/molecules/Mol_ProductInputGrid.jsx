import Input from "../atoms/Atm_Inputs";
import Button from "../atoms/Atm_Button";

export default function ProductInputsGrid({
  product,
  handleChange,
  handleAddMaterial,
  handleRemoveMaterial,
  handleSendToDatabase //WIP
}) {
  return (
    <div className="grid grid-cols-6 gap-4">
      {/* Name */}
      <Input
        name="name"
        placeholder="Product Name"
        value={product.name}
        onChange={handleChange}
        className="col-span-4"
      />

      {/* Qtdd */}
      <Input
        type="number"
        name="quantity"
        placeholder="Quantity ex: 10"
        value={product.quantity}
        onChange={handleChange}
      />

      {/* Price */}
      <Input
        type="number"
        name="price"
        placeholder="Price ex: 300"
        value={product.price}
        onChange={handleChange}
      />

      {/* Materials */}
      <div className="col-span-6 flex flex-col gap-4">
        {product.materials.map((material, index) => (
          <div key={index} className="flex items-center gap-4">
            <Input
              name={`material.${index}.name`}
              placeholder="Material"
              value={material.name}
              onChange={handleChange}
              className="flex-1"
            />

            <Input
              name={`material.${index}.quantity`}
              placeholder="Quantity ex: 50"
              value={material.quantity}
              onChange={handleChange}
              className="w-32"
            />

            <Button
              onClick={() => handleRemoveMaterial(index)}
              className="bg-red-600 hover:bg-red-700 px-3"
            >
              ✕
            </Button>
          </div>
        ))}

        <Button
          onClick={handleAddMaterial}
          className="self-start bg-green-600 hover:bg-green-700"
        >
          + Add Material
        </Button>

        <Button
          onClick={handleSendToDatabase}
          className="self-start bg-blue-600 hover:bg-blue-700"
        >
          Send
        </Button>
      </div>
    </div>
  );
}

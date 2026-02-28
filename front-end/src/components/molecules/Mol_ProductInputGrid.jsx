import Input from "../atoms/Atm_Inputs";
import Button from "../atoms/Atm_Button";

export default function ProductInputsGrid({
  product,
  handleChange,
  handleAddMaterial,
  handleRemoveMaterial,
  handleSendToDatabase, //WIP
}) {
  return (
    <div className="  gap-4">
      {/* Name */}
      <Input
        name="name"
        placeholder="Product Name"
        value={product.name}
        onChange={handleChange}
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
      {product.materials.map((material, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row md:items-center"
        >
          <Input
            name={`material.${index}.name`}
            placeholder="Material"
            value={material.name}
            onChange={handleChange}
            className="w-full md:flex-1"
          />

          <div className="flex gap-2 md:gap-4">
            <Input
              name={`material.${index}.quantity`}
              placeholder="Quantity ex: 5000"
              value={material.quantity}
              onChange={handleChange}
            />

            <Button
              onClick={() => handleRemoveMaterial(index)}
              className="bg-red-600 hover:bg-red-700 px-3 md:px-4"
            >
              ✕
            </Button>
          </div>
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
  );
}

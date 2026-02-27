import { useState } from "react";
import Input from "../atoms/Atm_Inputs";
import Button from "../atoms/Atm_Button";

export default function SupplyRegister() {
  const [supply, setSupply] = useState({
    name: "",
    stock: "",
    identifier: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupply((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendToDatabase = () => {
    // WIP: integração com backend
    console.log("Insumo registrado:", supply);
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-semibold mb-6">
        Registro de Insumos
      </h1>

      <div className="grid grid-cols-6 gap-4">
        {/* Nome do Insumo */}
        <Input
          name="name"
          placeholder="Nome do insumo"
          value={supply.name}
          onChange={handleChange}
          className="col-span-4"
        />

        {/* Quantidade em estoque */}
        <Input
          type="number"
          name="stock"
          placeholder="Estoque"
          value={supply.stock}
          onChange={handleChange}
          className="col-span-1"
        />

        {/* Identificador */}
        <Input
          name="identifier"
          placeholder="Identificador (ex: INS-001)"
          value={supply.identifier}
          onChange={handleChange}
          className="col-span-1"
        />

        {/* Ações */}
        <div className="col-span-6 flex gap-4 mt-4">
          <Button
            onClick={handleSendToDatabase}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Registrar Insumo
          </Button>
        </div>
      </div>
    </div>
  );
}
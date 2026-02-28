import { useState } from "react";
import Input from "../atoms/Atm_Inputs";
import Button from "../atoms/Atm_Button";
import ApiService from "../../scripts/PostManager";

export default function SupplyRegister() {
  const [supply, setSupply] = useState({
    name: "",
    stockQuantity: "",
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
    ApiService.Post("/api/raw-materials/new_raw_material", supply).then((response) => {
      console.log("Insumo registrado com sucesso:", response);
    });
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-semibold mb-6">Registro de Insumos</h1>

      <div className="">
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
          name="stockQuantity"
          placeholder="Estoque"
          value={supply.stockQuantity}
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

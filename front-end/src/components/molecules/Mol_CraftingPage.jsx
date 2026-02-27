import { useState, useMemo } from "react";
import Input from "../atoms/Atm_Inputs";
import Button from "../atoms/Atm_Button";

/**
 * Mock do backend
 */

const MOCK_RESOURCES = {
  Ferro: 120,
  Madeira: 40,
  "Erva Vermelha": 12,
  Água: 50,
  Couro: 30,
  Linha: 8,
};

const MOCK_ITEMS = [
  {
    //WIP a qtdd máxima deverá ser definida com base matemática definida pelo front e validada pelo back-end
    id: "item-1",
    name: "Espada de Ferro",
    maxQuantity: 5,
    cost: [
      { material: "Ferro", quantity: 10 },
      { material: "Madeira", quantity: 2 },
    ],
  },
  {
    id: "item-2",
    name: "Poção de Vida",
    maxQuantity: 20,
    cost: [
      { material: "Erva Vermelha", quantity: 3 },
      { material: "Água", quantity: 1 },
    ],
  },
  {
    id: "item-3",
    name: "Armadura Leve",
    maxQuantity: 2,
    cost: [
      { material: "Couro", quantity: 15 },
      { material: "Linha", quantity: 5 },
    ],
  },
];

export default function CraftingPage() {
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const filteredItems = useMemo(() => {
    return MOCK_ITEMS.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setQuantity(1);
  };

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);

    if (!selectedItem) return;

    if (value >= 1 && value <= selectedItem.maxQuantity) {
      setQuantity(value);
    }
  };

  return (
    <div className="p-10 h-full">
      <h1 className="text-2xl font-semibold mb-6">Crafting</h1>

      <div className="grid grid-cols-12 gap-6 h-full">
        {/* Lateral esquerda */}
        <div className="col-span-4 flex flex-col gap-4">
          {/* Busca */}
          <Input
            placeholder="Buscar item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Seletor */}
          <div className="flex flex-col gap-2 overflow-y-auto">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectItem(item)}
                className={`
                  text-left px-4 py-2 rounded-lg transition
                  ${
                    selectedItem?.id === item.id
                      ? "bg-blue-600 text-white"
                      : "bg-black/5 hover:bg-black/10"
                  }
                `}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Área principal */}
        <div className="col-span-8 flex flex-col items-start gap-6">
          {selectedItem ? (
            <>
              {/* Card de custo */}
              <div className="w-full max-w-md rounded-2xl border border-black/20 bg-white p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Custo para craftar
                </h2>

                <div className="flex flex-col gap-2">
                  {selectedItem.cost.map((cost, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{cost.material}</span>
                      <span>{cost.quantity * quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full max-w-md rounded-2xl border border-black/20 bg-white p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Recursos disponíveis
                </h2>

                <div className="flex flex-col gap-2">
                  {Object.entries(MOCK_RESOURCES).map(([resource, amount]) => {
                    const needed =
                      selectedItem?.cost.find((c) => c.material === resource)
                        ?.quantity || 0;

                    const totalNeeded = needed * quantity;
                    const hasEnough = amount >= totalNeeded;

                    return (
                      <div
                        key={resource}
                        className={`flex justify-between text-sm ${
                          totalNeeded > 0 && !hasEnough
                            ? "text-red-600"
                            : "text-black"
                        }`}
                      >
                        <span>{resource}</span>
                        <span>
                          {amount}
                          {totalNeeded > 0 && (
                            <span className="text-black/60">
                              {" "}
                              / {totalNeeded}
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quantidade */}
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantidade:</span>

                <Input
                  type="number"
                  value={quantity}
                  min={1}
                  max={selectedItem.maxQuantity}
                  onChange={handleQuantityChange}
                  className="w-32"
                />

                <span className="text-sm text-black/60">
                  Máx: {selectedItem.maxQuantity}
                </span>
              </div>

              {/* Ação */}
              <Button className="bg-green-600 hover:bg-green-700">
                Craftar
              </Button>
            </>
          ) : (
            <div className="text-black/60">
              Selecione um item para ver o custo.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

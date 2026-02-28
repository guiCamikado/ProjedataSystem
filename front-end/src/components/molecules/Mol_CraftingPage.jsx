import { useState, useMemo, useEffect } from "react";
import Input from "../atoms/Atm_Inputs";
import Button from "../atoms/Atm_Button";
import ApiService from "../../scripts/PostManager";

export default function CraftingPage() {
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [maxCraftableQuantity, setMaxCraftableQuantity] = useState(0);
  const [items, setItems] = useState([]);
  const [resources, setResources] = useState({});

  // Calcula o máximo que pode ser produzido com base nos recursos disponíveis.
  useEffect(() => {
    let maxCraftingByMaterial = Infinity;
    if (selectedItem !== null) {
      const craftingCost = selectedItem.cost; //Armazena valor do material
      const resourcesArray = Object.values(resources);
      craftingCost.forEach((e) => {
        resourcesArray.forEach((resource) => {
          if (resource.name === e.material) {
            // qtdd máxima de crafting para aquele material
            if (maxCraftingByMaterial >= resource.stockQuantity / e.quantity) {
              maxCraftingByMaterial = resource.stockQuantity / e.quantity;
              console.log(maxCraftingByMaterial);
            }
          }
        });
      });
    }
    setMaxCraftableQuantity(maxCraftingByMaterial);
  }, [selectedItem, resources]);

  // Busca produtos (itens craftáveis)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await ApiService.InternalGet("/api/products/products");

        // Converte para o formato esperado pelo componente
        const processedItems = data.map((prod) => ({
          id: prod.id,
          name: prod.name,
          maxQuantity: prod.quantity,
          cost: JSON.parse(prod.materials).map((m) => ({
            material: m.name,
            quantity: m.requiredQuantity,
          })),
        }));
        setItems(processedItems);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchProducts();
  }, []);

  // Busca matérias-primas (recursos disponíveis)
  useEffect(() => {
    const fetchRawMaterials = async () => {
      try {
        const data = await ApiService.InternalGet(
          "/api/raw-materials/raw_materials",
        );

        const resourcesMap = {};
        data.forEach((rm) => {
          resourcesMap[rm.identifier] = {
            name: rm.name,
            stockQuantity: rm.stockQuantity,
          };
        });
        setResources(resourcesMap);
      } catch (error) {
        console.error("Erro ao buscar matérias-primas:", error);
      }
    };

    fetchRawMaterials();
  }, []);

  // Filtro / Busca
  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, items]);

  // Seleciona um item e reseta a quantidade
  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setQuantity(0);
  };

  // Controla a quantidade digitada (respeita o máximo do item)
  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    if (!selectedItem) return;
    if (value >= 1 && value <= maxCraftableQuantity) {
      setQuantity(value);
    }
  };

  const craftNewProducts = () => {
    console.log(selectedItem.name);
    console.log(quantity);

    ApiService.Post("/api/craft/new_craft", {
      name: selectedItem.name,
      quantity: quantity,
    })
      .then((response) => alert(response.data))
      .catch((error) => alert("Erro: " + error.message));
  };

  return (
    <div className="p-10 h-full">
      <h1 className="text-2xl font-semibold mb-6">Crafting</h1>

      <div className="grid grid-cols-12 gap-6 h-full">
        <div className="col-span-4 flex flex-col gap-4">
          <Input
            placeholder="Buscar item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

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

        {/* Área principal - detalhes do item selecionado */}
        <div className="col-span-8 flex flex-col items-start gap-6">
          {selectedItem ? (
            <>
              {/* Custo total para a quantidade escolhida */}
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

              {/* Recursos disponíveis (todas as matérias-primas) */}
              <div className="w-full max-w-md rounded-2xl border border-black/20 bg-white p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Recursos disponíveis
                </h2>

                <div className="flex flex-col gap-2">
                  {Object.entries(resources).map(([identifier, resource]) => {
                    const needed =
                      selectedItem.cost.find((c) => c.material === identifier)
                        ?.quantity || 0;
                    const totalNeeded = needed * quantity;
                    const hasEnough = resource.stockQuantity >= totalNeeded;

                    return (
                      <div
                        key={identifier}
                        className={`flex justify-between text-sm ${
                          totalNeeded > 0 && !hasEnough
                            ? "text-red-600"
                            : "text-black"
                        }`}
                      >
                        <span>{resource.name}</span>
                        <span>
                          {resource.stockQuantity}
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

              {/* Controle de quantidade */}
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantidade:</span>
                <Input
                  type="number"
                  value={quantity}
                  min={1}
                  max={maxCraftableQuantity} // WIP criar lógica
                  onChange={handleQuantityChange}
                  className="w-32"
                />
                <span className="text-sm text-black/60">
                  Máx: {maxCraftableQuantity}
                </span>
              </div>

              {/* Botão de ação (futuramente chamará a API de craft) */}
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => craftNewProducts()}
              >
                {/* // WIP Criar função de craft e conectar com o backend */}
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

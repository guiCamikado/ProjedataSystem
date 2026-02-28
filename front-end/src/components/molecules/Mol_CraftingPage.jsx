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

  useEffect(() => {
    let max = Infinity;
    if (selectedItem) {
      selectedItem.cost.forEach((c) => {
        const resource = Object.values(resources).find(
          (r) => r.name === c.material,
        );
        if (resource) {
          max = Math.min(max, resource.stockQuantity / c.quantity);
        }
      });
    }
    setMaxCraftableQuantity(Math.floor(max));
  }, [selectedItem, resources]);

  useEffect(() => {
    ApiService.InternalGet("/api/products/products").then((data) => {
      setItems(
        data.map((prod) => ({
          id: prod.id,
          name: prod.name,
          maxQuantity: prod.quantity,
          cost: JSON.parse(prod.materials).map((m) => ({
            material: m.name,
            quantity: m.requiredQuantity,
          })),
        })),
      );
    });
  }, []);

  useEffect(() => {
    ApiService.InternalGet("/api/raw-materials/raw_materials").then((data) => {
      const map = {};
      data.forEach((rm) => {
        map[rm.identifier] = {
          name: rm.name,
          stockQuantity: rm.stockQuantity,
        };
      });
      setResources(map);
    });
  }, []);

  const filteredItems = useMemo(
    () =>
      items.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [items, search],
  );

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 1 && value <= maxCraftableQuantity) {
      setQuantity(value);
    }
  };

  const craftNewProducts = () => {
    ApiService.Post("/api/craft/new_craft", {
      name: selectedItem.name,
      quantity,
    })
      .then((r) => alert(r.data))
      .catch((e) => alert("Erro: " + e.message));
  };

  return (
    <div className="p-4 sm:p-6 h-full">
      <h1 className="text-2xl font-semibold mb-6">Crafting</h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
        <div className="md:col-span-4 flex flex-col gap-4">
          <Input
            placeholder="Search Item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex flex-col gap-2 overflow-y-auto max-h-[50vh] md:max-h-full">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedItem(item);
                  setQuantity(1);
                }}
                className={`px-4 py-2 rounded-lg text-left transition ${
                  selectedItem?.id === item.id
                    ? "bg-blue-600 text-white"
                    : "bg-black/5 hover:bg-black/10"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-8 flex flex-col gap-6">
          {selectedItem ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-black/20 bg-white p-6">
                  <h2 className="text-xl font-semibold mb-4">Cost to craft</h2>
                  <div className="flex flex-col gap-2 text-sm">
                    {selectedItem.cost.map((c, i) => (
                      <div key={i} className="flex justify-between">
                        <span>{c.material}</span>
                        <span>{c.quantity * quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-black/20 bg-white p-6">
                  <h2 className="text-xl font-semibold mb-4">Resources</h2>
                  <div className="flex flex-col gap-2 text-sm">
                    {Object.entries(resources).map(([id, r]) => {
                      const needed =
                        selectedItem.cost.find(
                          (c) => c.material === id,
                        )?.quantity || 0;
                      const total = needed * quantity;
                      return (
                        <div
                          key={id}
                          className={`flex justify-between ${
                            total > r.stockQuantity
                              ? "text-red-600"
                              : "text-black"
                          }`}
                        >
                          <span>{r.name}</span>
                          <span>
                            {r.stockQuantity}
                            {total > 0 && (
                              <span className="text-black/60">
                                {" "}
                                / {total}
                              </span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <span className="font-medium">Quantity</span>
                <Input
                  type="number"
                  value={quantity}
                  min={1}
                  max={maxCraftableQuantity}
                  onChange={handleQuantityChange}
                  className="w-full sm:w-32"
                />
                <span className="text-sm text-black/60">
                  Máx: {maxCraftableQuantity}
                </span>
              </div>

              <Button
                className="bg-green-600 hover:bg-green-700 w-full sm:w-fit"
                onClick={craftNewProducts}
              >
                Create new product
              </Button>
            </>
          ) : (
            <div className="text-black/60">
              Select an item to see the cost.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
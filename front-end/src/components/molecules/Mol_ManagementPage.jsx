import { useState, useEffect } from "react";
import Input from "../atoms/Atm_Inputs";
import Button from "../atoms/Atm_Button";
import ApiService from "../../scripts/PostManager";

export default function ManagementPage() {
  const [products, setProducts] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // { type: 'product' ou 'raw', data: {...} }
  const [formData, setFormData] = useState({});

  // Carrega dados iniciais
  useEffect(() => {
    fetchProducts();
    fetchRawMaterials();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await ApiService.InternalGet("/api/products/products");
      setProducts(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const fetchRawMaterials = async () => {
    try {
      const data = await ApiService.InternalGet(
        "/api/raw-materials/raw_materials",
      );
      setRawMaterials(data);
    } catch (error) {
      console.error("Erro ao buscar matérias-primas:", error);
    }
  };

  // Seleção de itens
  const handleSelectProduct = (product) => {
    setSelectedItem({ type: "product", data: product });
    setFormData(product);
  };

  const handleSelectRawMaterial = (raw) => {
    setSelectedItem({ type: "raw", data: raw });
    setFormData(raw);
  };

  // Criação de novos itens (vazios)
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

  // Atualiza campos do formulário
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Salva
  const handleSave = async () => {
    if (!selectedItem) return;

    const { type, data } = selectedItem;
    const isNew = !data.id; // se não tem id, é novo

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

    try {
      if (method === "POST") {
        await ApiService.Post(url, payload);
      } else {
        await ApiService.Put(url, payload); // PUT agora existe
      }
      await fetchProducts();
      await fetchRawMaterials();
      setSelectedItem(null);
      setFormData({});
      alert("Item salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar: " + error.message);
    }
  };

  // Deleta item
  const handleDelete = async () => {
    if (!selectedItem || !selectedItem.data.id) return;
    if (!window.confirm("Tem certeza que deseja excluir este item?")) return;

    const { type, data } = selectedItem;
    const id = data.id;
    const url =
      type === "product"
        ? `/api/products/delete_product?id=${id}`
        : `/api/raw-materials/delete_raw_material?id=${id}`;

    try {
      await ApiService.Delete(url); // DELETE agora existe
      await fetchProducts();
      await fetchRawMaterials();
      setSelectedItem(null);
      setFormData({});
      alert("Item removido com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Erro ao deletar: " + error.message);
    }
  };

  // formulário
  const renderForm = () => {
    if (!selectedItem) {
      return (
        <div className="text-black/60">
          Selecione um item para editar ou crie um novo.
        </div>
      );
    }

    const { type } = selectedItem;

    if (type === "product") {
      return (
        <div className="w-full max-w-md space-y-4">
          <h2 className="text-xl font-semibold mb-4">
            {formData.id ? "Editar Produto" : "Novo Produto"}
          </h2>
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <Input
              value={formData.name || ""}
              onChange={(e) => handleFormChange("name", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quantidade</label>
            <Input
              type="number"
              value={formData.quantity || 0}
              onChange={(e) => handleFormChange("quantity", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Preço</label>
            <Input
              type="number"
              step="0.01"
              value={formData.price || 0}
              onChange={(e) => handleFormChange("price", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Materiais (JSON)
            </label>
            <textarea
              className="w-full border border-black/20 rounded-lg p-2 font-mono text-sm"
              rows={5}
              value={formData.materials || "[]"}
              onChange={(e) => handleFormChange("materials", e.target.value)}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-full max-w-md space-y-4">
          <h2 className="text-xl font-semibold mb-4">
            {formData.id ? "Editar Matéria-prima" : "Nova Matéria-prima"}
          </h2>
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <Input
              value={formData.name || ""}
              onChange={(e) => handleFormChange("name", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Quantidade em estoque
            </label>
            <Input
              type="number"
              step="0.01"
              value={formData.stockQuantity || 0}
              onChange={(e) =>
                handleFormChange("stockQuantity", e.target.value)
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Identificador
            </label>
            <Input
              value={formData.identifier || ""}
              onChange={(e) => handleFormChange("identifier", e.target.value)}
            />
          </div>
        </div>
      );
    }
  };

  return (
    <div className="p-10 h-full">
      <h1 className="text-2xl font-semibold mb-6">Gerenciamento</h1>

      <div className="grid grid-cols-12 gap-6 h-full">
        {/* lista */}
        <div className="col-span-4 flex flex-col gap-6 overflow-y-auto">
          {/* produtos */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Produtos</h2>
              <Button
                onClick={handleNewProduct}
                className="bg-blue-600 hover:bg-blue-700 text-sm px-3 py-1"
              >
                Novo
              </Button>
            </div>
            <div className="flex flex-col gap-1">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  className={`
                    text-left px-4 py-2 rounded-lg transition
                    ${
                      selectedItem?.type === "product" &&
                      selectedItem.data.id === product.id
                        ? "bg-blue-600 text-white"
                        : "bg-black/5 hover:bg-black/10"
                    }
                  `}
                >
                  {product.name}
                </button>
              ))}
            </div>
          </div>

          {/* materiais */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Matérias-primas</h2>
              <Button
                onClick={handleNewRawMaterial}
                className="bg-blue-600 hover:bg-blue-700 text-sm px-3 py-1"
              >
                Novo
              </Button>
            </div>
            <div className="flex flex-col gap-1">
              {rawMaterials.map((raw) => (
                <button
                  key={raw.id}
                  onClick={() => handleSelectRawMaterial(raw)}
                  className={`
                    text-left px-4 py-2 rounded-lg transition
                    ${
                      selectedItem?.type === "raw" &&
                      selectedItem.data.id === raw.id
                        ? "bg-blue-600 text-white"
                        : "bg-black/5 hover:bg-black/10"
                    }
                  `}
                >
                  {raw.name} ({raw.identifier})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna direita: formulário */}
        <div className="col-span-8 flex flex-col items-start gap-6">
          {selectedItem && (
            <>
              {renderForm()}
              <div className="flex gap-4">
                <Button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Salvar
                </Button>
                {selectedItem.data.id && (
                  <Button
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Excluir
                  </Button>
                )}
              </div>
            </>
          )}
          {!selectedItem && (
            <div className="text-black/60">
              Selecione um item para editar ou crie um novo.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

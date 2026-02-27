import { useState, useEffect } from "react";
import ProductRegister from "../organism/Org_ProductRegister";
import SupplyRegister from "../molecules/Mol_SupplyInputGrid";
import CraftingPage from "../molecules/Mol_CraftingPage";
import Sidebar from "../templates/Temp_Sidebar";

export default function ProductRegisterPage() {
  const [product, setProduct] = useState({
    name: "",
    quantity: "",
    price: "",
  });
  const [renderedPage, setRenderedPage] = useState();
  const [searchParams, setSearchParams] = useState("");
  // const renderedPage = "craft";

  function handleChange(e) {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  }

  // return (
  //   // WIP Precisa fazer o header aqui
  //   // WIP SideBar e lógica para trocar de páginas entre: "Registrar produto, registrar materiais, crafting"
  //   <div className="p-4">
  //     <ProductRegister product={product} handleChange={handleChange} />
  //   </div>
  // );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageFromUrl = params.get("page");

    if (pageFromUrl) {
      setRenderedPage(pageFromUrl);
    }
  }, []); // 👈 array vazio = sem loop

  const renderContent = () => {
    switch (renderedPage) {
      case "itemRegister":
        return (
          <ProductRegister product={product} handleChange={handleChange} />
        );
      case "craft":
        return <CraftingPage product={product} handleChange={handleChange} />;
      default:
        return <SupplyRegister product={product} handleChange={handleChange} />;
    }
  };

  return (
    <div className="bg-[#201F20]">
      <Sidebar renderedPage={renderContent()} />
    </div>
  );
}

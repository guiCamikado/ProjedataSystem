import { useState, useEffect } from "react";
import ProductRegister from "../organism/Org_ProductRegister";
import SupplyRegister from "../molecules/Mol_SupplyInputGrid";
import CraftingPage from "../molecules/Mol_CraftingPage";
import Sidebar from "../templates/Temp_Sidebar";
import ManagementPage from "../molecules/Mol_ManagementPage";

export default function ProductRegisterPage() {
  // Me enrolei aqui vou ter que trabalhar com isso mesmo:|
  const [product, setProduct] = useState({
    name: "",
    quantity: "",
    price: "",
  });
  const [renderedPage, setRenderedPage] = useState();

  function handleChange(e) {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageFromUrl = params.get("page");

    if (pageFromUrl) {
      setRenderedPage(pageFromUrl);
    }
  }, []);

  const renderContent = () => {
    switch (renderedPage) {
      default:
        return <SupplyRegister product={product} handleChange={handleChange} />;
      case "itemRegister":
        return <ProductRegister product={product} handleChange={handleChange}/>;
      case "craft":
        return <CraftingPage product={product} handleChange={handleChange} />;
      case "management":
        return <ManagementPage />;
    }
  };

  return (
    <div className="bg-[#201F20]">
      <Sidebar renderedPage={renderContent()} />
    </div>
  );
}

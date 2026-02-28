import { useState } from "react";
import { Menu, Home, SunMoon, CircleUser } from "lucide-react";
import SideBarCluster from "../molecules/Mol_SidebarCluster";

export default function Sidebar({ renderedPage }) {
  // Estados locais (não dependem de fora)
  const [isActive, setIsActive] = useState(true);

  // Fecha menu automaticamente no mobile
  const closeMenuOnMobile = () => {
    if (window.innerWidth < 768) {
      setIsActive(false);
    }
  };

  const ButtonStyle =
    "rounded-xl bg-black/5 p-1 cursor-pointer transition-all duration-300 hover:text-[#FFEF20] hover:bg-black/10 hover:scale-105 text-black";

  return (
    <div className="flex h-screen overflow-hidden">
      <aside
        className={`
          min-h-screen sticky top-0 transition-all duration-300 ease-in-out
          ${"bg-[#D4D3D4] text-black"}
          ${isActive ? "w-full md:w-64" : "w-16"}
        `}
      >
        {/* Header */}
        <div className="flex justify-between p-4">
          {isActive ? (
            <>
              <div className="flex gap-3">
                <button
                  onClick={() => (window.location.href = "?page=about")}
                  className={ButtonStyle}
                >
                  <Home size={32} />
                </button>
              </div>

              <button
                onClick={() => setIsActive(false)}
                className={`${ButtonStyle} absolute right-4 top-4`}
              >
                <Menu size={32} />
              </button>
            </>
          ) : (
            <div className="grid gap-4">
              <button onClick={() => setIsActive(true)} className={ButtonStyle}>
                <Menu size={32} />
              </button>
            </div>
          )}
        </div>

        {/* Conteúdo */}
        {isActive && (
          <div className="flex flex-col gap-2 px-4 transition-all duration-500">
            <hr className="border-white/20" />

            <SideBarCluster
              ClusterTitle="Ações"
              onItemClick={closeMenuOnMobile}
              ClusterData={[
                { text: "Item Register", link: "?page=itemRegister" },
                { text: "Insume Register", link: "?page=insumeRegister" },
                { text: "Craft", link: "?page=craft" },
                { text: "Manuseio", link: "?page=management" },
              ]}
            />
          </div>
        )}
      </aside>

      {/* Conteúdo principal*/}
      <main className={"bg-[#D4D3D4] text-black w-full h-full overflow-y-auto"}>
        <div className="p-10">{renderedPage}</div>
      </main>
    </div>
  );
}

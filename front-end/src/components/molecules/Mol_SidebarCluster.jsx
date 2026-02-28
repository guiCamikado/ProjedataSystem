import SidebarClickOption from "../atoms/Atm_SidebarClickOption";

export default function SideBarCluster({
    ClusterTitle,
    ClusterData,
    darkMode,
    onItemClick
}) {
    return (
        <>
            <b className="text-2xl">
                {ClusterTitle ? ClusterTitle : "ClusterTitle não definido"}
            </b>

            {ClusterData && ClusterData.length > 0 ? (
                <>
                    {ClusterData.map((item, index) => (
                        <SidebarClickOption
                            key={index}
                            darkMode={darkMode}
                            text={item.text}
                            link={item.link}
                            onItemClick={onItemClick}
                        />
                    ))}

                    <hr className="mt-2 border-white/20" />
                </>
            ) : (
                <b className="text-red-600">
                    Cluster has no data. Use [{`{ text, link }`}]
                </b>
            )}
        </>
    );
}

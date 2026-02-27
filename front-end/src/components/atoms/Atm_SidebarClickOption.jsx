export default function SidebarClickOption({ text, link, darkMode, onItemClick }) {

    const handleClick = () => {
        if (link) {
            window.location.href = link
        }
    }

    return (
        <>
            <button
                onClick={() => {
                    handleClick(),
                        onItemClick()
                }}
            >
                <div className={darkMode
                    ? `p-1.5 rounded-sm bg-[#807C8020] cursor-pointer transition-all duration-200 hover:text-[#DD01E6] hover:scale-110 hover:ml-4 hover:bg-[#807C8050]`
                    : `p-1.5 rounded-sm bg-[#0000000D] cursor-pointer transition-all duration-200 hover:text-[#FFFF20] hover:scale-110 hover:ml-4 hover:bg-[#00000018] text-black
`
                }
                >

                    {text}

                </div>
            </button>
        </>
    )
}
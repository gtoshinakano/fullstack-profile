import { useRouter } from "next/router"

const ChangeLanguage = () => {
  const router = useRouter()

  return (
    <div className="fixed z-[1000] top-1 right-1 pr-4 text-white font-wask flex gap-3 ">
      <h5 className="font-thin">Change Language</h5>
      <button onClick={() => router.push("/en")}>
        English
      </button>
      <button onClick={() => router.push("/ja")}>
        Japanese
      </button>
      <button onClick={() => router.push("/pt-BR")}>
        Portuguese
      </button>
    </div>
  )
}

export default ChangeLanguage
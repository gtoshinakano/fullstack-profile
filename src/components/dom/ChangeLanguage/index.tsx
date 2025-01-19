import { useRouter } from "next/router"
import prefix from "@/helpers/prefix"

const ChangeLanguage = () => {
  const router = useRouter()

  return (
    <div id="change-language-container" className="fixed z-[1000] top-1 right-1 pr-4 text-white font-wask flex gap-3 ">
      <h5 className="font-thin">Change Language</h5>
      <button onClick={() => router.push(prefix + "/en")}>
        English
      </button>
      <button onClick={() => router.push(prefix + "/ja")}>
        Japanese
      </button>
      <button onClick={() => router.push(prefix + "/pt-BR")}>
        Portuguese
      </button>
    </div>
  )
}

export default ChangeLanguage
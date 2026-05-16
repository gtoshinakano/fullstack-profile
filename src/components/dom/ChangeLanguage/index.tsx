import { useRouter } from "next/router"
import prefix from "@/helpers/prefix"
import languageDetector from "@/lib/languageDetector"

const PROFILE_PATH = '/dev/gabriel-toshinori-nakano/'

const ChangeLanguage = () => {
  const router = useRouter()
  const currentLocale = router.query.locale as string

  const changeLocale = (locale: string) => {
    languageDetector.cache?.(locale)
    router.push(prefix + '/' + locale + PROFILE_PATH)
  }

  return (
    <div id="change-language-container" className="fixed z-[1000] top-1 right-1 pr-4 text-white font-wask flex gap-3 ">
      <h5 className="font-thin">Change Language</h5>
      <button
        onClick={() => changeLocale('en')}
        aria-current={currentLocale === 'en' ? 'true' : undefined}
        className={currentLocale === 'en' ? 'font-bold underline' : ''}
      >
        English
      </button>
      <button
        onClick={() => changeLocale('ja')}
        aria-current={currentLocale === 'ja' ? 'true' : undefined}
        className={currentLocale === 'ja' ? 'font-bold underline' : ''}
      >
        日本語
      </button>
      <button
        onClick={() => changeLocale('pt-BR')}
        aria-current={currentLocale === 'pt-BR' ? 'true' : undefined}
        className={currentLocale === 'pt-BR' ? 'font-bold underline' : ''}
      >
        Português
      </button>
    </div>
  )
}

export default ChangeLanguage
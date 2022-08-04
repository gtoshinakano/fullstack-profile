import Page from './dev/gabriel-toshinori-nakano'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import i18n from "../i18n.config"

interface IStaticProps {
  locale: string
}

export async function getStaticProps({locale} : IStaticProps) {
  return {
    props: {
      ...await serverSideTranslations(locale, ["common"], i18n),
    },
  };
}

export default Page

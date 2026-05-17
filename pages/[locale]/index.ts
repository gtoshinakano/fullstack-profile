import Page from './dev/gabriel-toshinori-nakano'
import { makeStaticProps, getStaticPaths } from '@Lib/getStatic'


const getStaticProps = makeStaticProps(['common', 'future-partner', 'projects-data'])

export { getStaticPaths, getStaticProps}

export default Page

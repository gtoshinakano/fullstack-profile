interface IParams {
  src: string
}

const customLoader = ({ src }: IParams): string => {
  return src
}

export default customLoader

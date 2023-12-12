const handleQueryParams = ({
  min, max, category, search,
}) => {
  let queryParam = {}

  if (category && category.length) {
    queryParam = { ...queryParam, category }
  }

  if (min && Number(min) > 0) {
    queryParam = { ...queryParam, min }
  }

  if (max && Number(max) > Number(min)) {
    queryParam = { ...queryParam, max }
  }

  if (search && search?.length) {
    queryParam = { ...queryParam, search }
  }

  return queryParam
}

export default handleQueryParams

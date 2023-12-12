const chooseBySlug = (data, slugName) => {
  let result = []

  if (data && slugName) {
    result = data?.filter((content) => (
      Object.values(content).includes(slugName.toLowerCase())
    ))

    result = result ? result[0] : []
  }

  return result
}

export default chooseBySlug

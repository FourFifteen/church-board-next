const truncateN = (nLength: number) => (str: string) => {
  if (str.length > nLength) {
    return str.slice(0, nLength) + "..."
  }
  return str
}

export const truncate = truncateN(110)

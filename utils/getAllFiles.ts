export const getAllFiles = (files: FileList | []) => {
  if (!files) return []

  const fileArray = []
  for (let i = 0; i < files.length; i++) {
    fileArray.push(files[i])
  }
  return fileArray
}

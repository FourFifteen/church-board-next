import { InputGroup } from "@chakra-ui/react"
import { ReactNode, useRef } from "react"
import { ChangeHandler } from "react-hook-form"

type FileUploadProps = {
  name: string
  ref: (instance: HTMLInputElement | null) => void
  accept?: string
  children?: ReactNode
  multiple?: boolean
  onChange?: ChangeHandler
  onBlur?: ChangeHandler
}

const FileUpload = ({
  accept,
  children,
  multiple = false,
  name,
  onChange,
  onBlur,
  ref
}: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const handleClick = () => inputRef.current?.click()

  return (
    <InputGroup onClick={handleClick}>
      <input
        type="file"
        hidden
        accept={accept}
        multiple={multiple}
        ref={(e) => {
          ref(e)
          inputRef.current = e
        }}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
      />
      <>
        {children}
      </>
    </InputGroup>
  )
}

export default FileUpload

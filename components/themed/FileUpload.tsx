import {
  Box,
  Button,
  ButtonGroup,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { ReactNode, useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { useController, UseControllerProps, useForm } from "react-hook-form"
import { RiImageAddFill } from "react-icons/ri"

interface FileUploadProps extends UseControllerProps {
  accept?: string
  children?: ReactNode
  multiple?: boolean
  mode?: "update"
  label: string
}

const FileUpload = (props: FileUploadProps) => {
  const {
    accept,
    children,
    multiple = false,
    name,
    label,
    mode = "update",
  } = props
  const { field } = useController(props)
  const { register, unregister, setValue, watch } = useForm()
  const [acceptedFile, setAcceptedFile] = useState<File[]>([])

  const files = watch(name)

  const onDrop = useCallback(
    (droppedFiles: File[]) => {
      const newFiles =
        mode === "update" ? droppedFiles : [...(files || []), ...droppedFiles]
      setValue(name, newFiles, { shouldValidate: true })
    },
    [setValue, name, mode, files],
  )

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": ["jpeg"],
    },
    maxSize: 10000000,
    onDropAccepted: (accepted) => {
      setAcceptedFile(accepted)
    },
  })

  const updatePhoto = () => {
    open()
  }

  const removePhoto = useCallback(() => {
    setAcceptedFile([])
    setValue("", [])
  }, [setValue])

  useEffect(() => {
    register(name)
    return () => {
      unregister(name)
    }
  }, [register, unregister, name])

  // return (
  //   <InputGroup onClick={handleClick}>
  //     <input
  //       type="file"
  //       hidden
  //       accept={accept}
  //       multiple={multiple}
  //       ref={(e) => {
  //         ref(e)
  //         inputRef.current = e
  //       }}
  //       {...rest}
  //     />
  //     <>
  //       {children}
  //     </>
  //   </InputGroup>
  // )
  return (
    <Box>
      <Stack spacing={2} direction="row">
        <Box
          {...getRootProps()}
          border="2px"
          borderColor={useColorModeValue("gray.300", "gray.500")}
          backgroundColor={useColorModeValue("gray.200", "gray.600")}
        >
          <input id={"" + name} {...field} {...getInputProps()} />
          <Text>Drag and drop to upload your profile image.</Text>
        </Box>
        <ButtonGroup spacing={2}>
          <Button onClick={updatePhoto}>Upload</Button>
          <Button onClick={removePhoto}>Remove</Button>
        </ButtonGroup>
      </Stack>
      {acceptedFile[0] && (
        <FileInfo
          name={acceptedFile[0]?.name}
          id={"" + name}
          onUpdate={updatePhoto}
          onRemove={removePhoto}
        />
      )}
    </Box>
  )
}

export default FileUpload

type FileInfoProps = {
  id: string
  name: string
  onUpdate: () => void
  onRemove: () => void
}
const FileInfo = ({ id, name, onUpdate, onRemove }: FileInfoProps) => (
  <Stack
    direction="row"
    border="2px"
    borderColor={useColorModeValue("gray.200", "gray.600")}
    id={id}
  >
    <Stack>
      <Icon as={RiImageAddFill} />
      <Text>{name}</Text>
    </Stack>
    <ButtonGroup variant="outline" spacing={6}>
      <Button onClick={onUpdate}>Update</Button>
      <Button onClick={onRemove}>Remove</Button>
    </ButtonGroup>
  </Stack>
)

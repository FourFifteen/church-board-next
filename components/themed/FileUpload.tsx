import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { ReactNode, useCallback, useEffect, useState } from "react"
import { Accept, useDropzone } from "react-dropzone"
import { useController, UseControllerProps, useForm } from "react-hook-form"
import { RiImageAddFill } from "react-icons/ri"

interface FileUploadProps extends UseControllerProps {
  accept?: Accept
  children?: ReactNode
  maxFiles?: number
  mode?: "update"
  label: string
  helperText?: string
}

const FileUpload = (props: FileUploadProps) => {
  const {
    accept = {
      "image/*": [".png", ".gif", ".jpeg", ".jpg"],
    },
    children,
    maxFiles = 1,
    name,
    label,
    mode = "update",
    helperText = "Drag and drop to upload your profile image.",
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
    accept,
    maxSize: 10000000,
    onDropAccepted: (accepted) => {
      setAcceptedFile(accepted)
    },
    maxFiles,
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

  const DefaultFileButtons = () => (
    <>
      <input id={"" + name} {...field} {...getInputProps()} />
      <Text>{helperText}</Text>
    </>
  )

  return (
    <Box>
      <Stack spacing={2} direction="row" alignItems="center">
        <Box
          {...getRootProps()}
          border="1px"
          padding={2}
          borderRadius="md"
          borderColor={useColorModeValue("gray.300", "gray.500")}
          backgroundColor={useColorModeValue("gray.100", "gray.700")}
        >
          {children || <DefaultFileButtons />}
        </Box>
        <ButtonGroup spacing={2}>
          <Button onClick={updatePhoto}>Upload</Button>
          {acceptedFile.length > 0 && (
            <Button onClick={removePhoto}>Remove</Button>
          )}
        </ButtonGroup>
      </Stack>
      {acceptedFile[0] && (
        <FormControl>
          <FormLabel>{label}</FormLabel>
          <FileInfo
            name={acceptedFile[0]?.name}
            id={"" + name}
            onUpdate={updatePhoto}
            onRemove={removePhoto}
          />
        </FormControl>
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
    borderRadius="md"
    padding={2}
    justifyContent="space-between"
    alignItems="center"
    borderColor={useColorModeValue("gray.200", "gray.600")}
    id={id}
  >
    <Stack direction="row" alignItems="center">
      <Icon as={RiImageAddFill} />
      <Text>{name}</Text>
    </Stack>
    <ButtonGroup variant="outline" spacing={6}>
      <Button onClick={onUpdate}>Update</Button>
      <Button onClick={onRemove}>Remove</Button>
    </ButtonGroup>
  </Stack>
)

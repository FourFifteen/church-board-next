import {
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  Input,
  Tooltip,
  useColorModeValue,
  useEditableControls,
} from "@chakra-ui/react"
import { ChangeEvent } from "react"
import { RiCheckFill, RiCloseFill } from "react-icons/ri"

type EditableWithButtonProps = {
  name: string
  defaultValue?: string
  setValue: (e: ChangeEvent<HTMLInputElement>) => void
  type?: "email" | "text" | "textarea"
}

const EditableWithButton = ({
  defaultValue = "",
  name,
  type = "text",
  setValue,
}: EditableWithButtonProps) => {
  return (
    <Editable
      defaultValue={defaultValue}
      isPreviewFocusable={true}
      selectAllOnFocus={false}
      w="full"
    >
      <Tooltip label="Click to edit">
        <EditablePreview
          py={2}
          px={4}
          _hover={{
            background: useColorModeValue("gray.100", "gray.600"),
          }}
          bg={useColorModeValue("gray.50", "gray.700")}
        />
      </Tooltip>
      <Input
        py={2}
        px={4}
        as={EditableInput}
        type={type}
        w="full"
        name={name}
        id={name}
        onChange={setValue}
      />
      <EditableControls />
    </Editable>
  )
}

export default EditableWithButton

const EditableControls = () => {
  const { isEditing, getSubmitButtonProps, getCancelButtonProps } =
    useEditableControls()

  return isEditing ? (
    <ButtonGroup justifyContent="end" size="sm" w="full" spacing={2} mt={2}>
      <IconButton
        icon={<RiCheckFill />}
        aria-label="confirm"
        {...getSubmitButtonProps()}
      />
      <IconButton
        icon={<RiCloseFill />}
        aria-label="cancel"
        {...getCancelButtonProps()}
      />
    </ButtonGroup>
  ) : null
}

import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react"
import { FieldError } from "react-hook-form"

type HookFormControlProps = {
  children: React.ReactNode
  error?: FieldError
  label?: string
  name: string
}
const HookFormControl = ({
  children,
  error,
  label,
  name,
}: HookFormControlProps) => (
  <FormControl isInvalid={Boolean(error)}>
    {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
    {children}
    {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
  </FormControl>
)

export default HookFormControl

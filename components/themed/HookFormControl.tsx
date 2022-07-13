import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react"
import { FieldError } from "react-hook-form"

type HookFormControlProps = {
  error?: FieldError
  label?: string
  children: React.ReactNode
}
const HookFormControl = ({ children, error, label }: HookFormControlProps) => (
  <FormControl isInvalid={Boolean(error)}>
    {label && <FormLabel>{label}</FormLabel>}
    {children}
    {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
  </FormControl>
)

export default HookFormControl


import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react"

type LabeledFormControlProps = {
  children: React.ReactNode
  label?: string
  error?: string
  name: string
}
const LabeledFormControl = ({
  children,
  error,
  label,
  name,
}: LabeledFormControlProps) => (
  <FormControl isInvalid={Boolean(error)}>
    {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
    {children}
    {error && <FormErrorMessage>{error}</FormErrorMessage>}
  </FormControl>
)

export default LabeledFormControl

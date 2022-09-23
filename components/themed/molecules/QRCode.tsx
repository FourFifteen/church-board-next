import { Center, Text } from "@chakra-ui/react"
import { QRCodeSVG } from "qrcode.react"
import { BrutalBox } from "./BrutalBox"

export type QRCodeProps = {
  link: string
  message?: string
}

export const QRCode = ({ link, message = "Scan to sign in!" }: QRCodeProps) => {
  return (
    <BrutalBox>
      <Center
        p={4}
        rounded="md"
        borderWidth="1px"
        borderColor="teal.400"
        flexDirection="column"
        gap="4"
        pr="8"
      >
        <Text fontWeight={700}>{message}</Text>
        <QRCodeSVG value={link} />
      </Center>
    </BrutalBox>
  )
}

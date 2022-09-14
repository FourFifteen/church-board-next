import { Link as ChakraLink } from "@chakra-ui/react"
import NextLink from "next/link"

type Props = {
  children: React.ReactNode
  href: string
  color?: string
}
// https://chakra-ui.com/docs/styled-system/color-mode#usecolormodevalue
export const Link = (props: Props) => {
  return (
    <NextLink href={props.href} passHref>
      <ChakraLink color="teal.200" _active={{ color: "teal.100" }}>
        {props.children}
      </ChakraLink>
    </NextLink>
  )
}

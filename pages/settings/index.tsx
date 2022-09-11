/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  Stack,
  Text,
  useColorMode,
} from "@chakra-ui/react"
import { NextPage } from "next"
import {
  Controller,
  ControllerRenderProps,
  FieldError,
  SubmitHandler,
  useForm,
} from "react-hook-form"
import { RiMoonClearFill, RiSunFill } from "react-icons/ri"
import EditableWithButton from "../../components/themed/EditableWithButton"
import FileUpload from "../../components/themed/FileUpload"
import HookFormControl from "../../components/themed/HookFormControl"
import { useProtectedRouteAuth } from "../../hooks/useProtectedRouteAuth"

export type UpdateUserInputs = {
  name: string
  email: string
  photoURL: FileList
}

export type UpdateUserControls<T extends keyof UpdateUserInputs> =
  ControllerRenderProps<UpdateUserInputs, T>

// I'll need to make this separate at some point...
const THEME_ICON_MAP = {
  dark: <RiMoonClearFill />,
  light: <RiSunFill />,
}

const SettingsIndexPage: NextPage = () => {
  const { currentUser } = useProtectedRouteAuth()
  const { colorMode, toggleColorMode } = useColorMode()
  const { handleSubmit, formState, control } = useForm<UpdateUserInputs>()

  const {
    name: nameErrors,
    email: emailErrors,
    photoURL: photoErrors,
  } = formState.errors

  const postUserSettings: SubmitHandler<UpdateUserInputs> = async (
    formData,
  ) => {
    if (!currentUser) {
      return
    }
    const response = await fetch("api/users/" + currentUser.id, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    })
    const data = response.json()
    console.log(data)
  }

  return (
    <Container>
      <Stack direction="column" py={8} w="full" justifyContent="start">
        <Heading as="h1">Settings</Heading>
        <Text>
          Here&apos;s where you can review and update your profile settings.
        </Text>
      </Stack>
      {currentUser && (
        <Grid templateColumns={["2fr 1fr", "1fr"]}>
          <GridItem w="full">
            <form onSubmit={handleSubmit(postUserSettings)}>
              <Stack spacing="6" w="full">
                <HookFormControl
                  Input={EditableWithButton}
                  error={nameErrors}
                  label="Name"
                  name="name"
                ></HookFormControl>
                <HookFormControl
                  Input={EditableWithButton}
                  error={emailErrors}
                  label="Email"
                  name="email"
                ></HookFormControl>
                <HookFormControl
                  error={photoErrors as FieldError | undefined}
                  label="Profile Photo"
                  name="photoURL"
                >
                  <Controller
                    name="photoURL"
                    control={control}
                    render={({ field }) => (
                      <FileUpload label="Profile Photo" {...field} />
                    )}
                  />
                </HookFormControl>
                <Button colorScheme="teal" variant="solid" type="submit">
                  Save changes
                </Button>
              </Stack>
            </form>
          </GridItem>
          <GridItem ml={[6, 0]} mt={[0, 6]}>
            <Button
              onClick={toggleColorMode}
              id="colormode"
              colorScheme="teal"
              variant="outline"
            >
              {THEME_ICON_MAP[colorMode]}
            </Button>
          </GridItem>
        </Grid>
      )}
    </Container>
  )
}

export default SettingsIndexPage

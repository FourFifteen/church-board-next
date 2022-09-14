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
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react"
import { RiMoonClearFill, RiSunFill } from "react-icons/ri"
import {
  EditableWithButton,
  FileUpload,
  LabeledFormControl,
} from "../../components/themed"
import { useProtectedRouteAuth } from "../../hooks/useProtectedRouteAuth"
import { User } from "../../types"

export type UpdateUserInputs = {
  name: string
  email: string
  photos: File[] | null
}

// I'll need to make this separate at some point...
const THEME_ICON_MAP = {
  dark: <RiMoonClearFill />,
  light: <RiSunFill />,
}

const SettingsIndexPage: NextPage = () => {
  const { currentUser } = useProtectedRouteAuth()
  const { colorMode, toggleColorMode } = useColorMode()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState(currentUser?.name || "")
  const [email, setEmail] = useState(currentUser?.email || "")
  const [photos, setPhotos] = useState<UpdateUserInputs["photos"]>(null)

  // const [nameErrors, setNameErrors] = useState("")
  // const [emailErrors, setEmailErrors] = useState("")
  // const [photosErrors, setPhotosErrors] = useState("")

  const handleSetPhotos = (value: FileList | File[]) => {
    if (value instanceof FileList) {
      setPhotos(extractPhotos(value))
    } else {
      setPhotos(value)
    }
  }
  const handleTextInput =
    (setter: Dispatch<SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value)
    }
  // const {
  //   name: nameErrors,
  //   email: emailErrors,
  //   photoURL: photoErrors,
  // } = formState.errors

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name)
      setEmail(currentUser.email)
    }
  }, [currentUser])
  useEffect(() => {
    if (isSubmitting) {
      postUserSettings(
        {
          name,
          email,
          photos,
        },
        currentUser,
      )
    }
  }, [isSubmitting, name, email, photos, currentUser])

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
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setIsSubmitting(true)
              }}
            >
              <Stack spacing="6" w="full">
                <LabeledFormControl label="Name" name="name">
                  <EditableWithButton
                    defaultValue={name}
                    name={name}
                    setValue={handleTextInput(setName)}
                  />
                </LabeledFormControl>
                <LabeledFormControl label="Email" name="email">
                  <EditableWithButton
                    defaultValue={email}
                    name={email}
                    setValue={handleTextInput(setEmail)}
                  />
                </LabeledFormControl>
                <LabeledFormControl label="Profile Photo" name="photoURL">
                  <FileUpload
                    label="Profile Photo"
                    name="photoURL"
                    value={photos}
                    setValue={handleSetPhotos}
                  />
                </LabeledFormControl>
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

const postUserSettings = async (
  formData: UpdateUserInputs,
  currentUser: User | null,
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

const extractPhotos = (photos: FileList | null) => {
  if (!photos) {
    return null
  }
  return Array.from(photos)
}

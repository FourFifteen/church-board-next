import { Box, Container, FormControl, FormErrorMessage, FormLabel, Heading, Input, Text } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'

// TODO: add a verification code option that checks a query param for the code, and if it's not present, block the page until added.
export default function ChurchPage() {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [address2, setAddress2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('United States')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const firstRender = useRef(false)

  const handleInput = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: { target: { value: string } }) => setter(e.target.value)
  const isValueBlank = (value: string) => value === '' && !firstRender.current

  useEffect(() => {
    firstRender.current = true
  }, [])

  useEffect(() => {
    if (!submitting) {
      return
    }

    (async () => {
      setSubmitting(true)
      try {
        fetch('api/church/add', {
          method: "POST",
          body: JSON.stringify({
            name,
            address,
            address2,
            city,
            state,
            country
          }),
          headers: {
            "Accept": "application/json"
          }
        })
      } catch (err) {
        setError("Encountered an error. Please contact the administrator")
        console.error(err)
      }

    })
  }, [name, address, address2, city, state, country, submitting])

  if (error) {
    return (
      <Container>
        <Box>
          <Heading>Whoops!</Heading>
          <Text>{error}</Text>
        </Box>
      </Container>
    )
  }
  // TODO: Add a "Don't see your church here? [link to send an email to your church admin with the info]"
  return (
    <Container>
      <Box>
        <Heading>Hey there! Let&apos;s add your church! {firstRender.current}</Heading>
        <FormControl isInvalid={isValueBlank(name)}>
          <FormLabel htmlFor="churchName">Church name</FormLabel>
          <Input id="churchName" placeholder="Christ Community Church" value={name} onChange={handleInput(setName)} isRequired />
          {isValueBlank(name) && (
            <FormErrorMessage>Church name is required.</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isInvalid={isValueBlank(address)}>
          <FormLabel htmlFor="address">Church address</FormLabel>
          <Input id="address" placeholder="100 5th ave" value={address} onChange={handleInput(setAddress)} isRequired />
          {isValueBlank(address) && (
            <FormErrorMessage>Street address is required.</FormErrorMessage>
          )}
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="addressTwo">Address 2</FormLabel>
          <Input id="addressTwo" placeholder="apt 102" value={address2} onChange={handleInput(setAddress2)} />
        </FormControl>
        <FormControl isInvalid={isValueBlank(city)}>
          <FormLabel htmlFor="city">City</FormLabel>
          <Input id="city" placeholder="New York" value={city} onChange={handleInput(setCity)} isRequired />
          {isValueBlank(city) && (
            <FormErrorMessage>City is required.</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isInvalid={isValueBlank(state)}>
          <FormLabel htmlFor="state">State/Province</FormLabel>
          <Input id="state" placeholder="New York" value={state} onChange={handleInput(setState)} isRequired />
          {isValueBlank(state) && (
            <FormErrorMessage>State/Province is required.</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isInvalid={isValueBlank(country)}>
          <FormLabel htmlFor="country">Church state</FormLabel>
          <Input id="country" value={country} onChange={handleInput(setCountry)} isRequired />
          {isValueBlank(state) && (
            <FormErrorMessage>Country is required.</FormErrorMessage>
          )}
        </FormControl>
      </Box>
    </Container>
  )

}


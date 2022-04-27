import { Box, Button, Input, List, ListItem, Spinner, Text, Textarea } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
// import useSwr from 'swr'
import { Need } from '../../types/entities/Need'

type Props = {
  userId: string
  churchId: string
}

// const fetcher = async (url: string): Promise<Array<Need>> => {
//   const response = await fetch(url)
//   return await response.json()
// }

export default function NeedsPage({ userId, churchId }: Props) {
  const [showAddModal, setShowAddModal] = useState(false)
  // const { data, error } = useSwr('/api/needs', fetcher)
  const data = [{
    name: "Need a Lawnmower",
    description: "My lawnmower broke and I ned to borrow one from someone",
    fulfilledState: "Unfulfilled",
    ownerId: "1",
    churchId: "1",
    assigneeId: "1",
    id: "12134532"
  }]
  const error = null

  if (!data) {
    return (
      <main>
        <Spinner />
      </main>
    )
  }
  if (data && !data.length) {
    return (
      <main>
      </main>
    )
  }
  if (error) {
    return (
      <main>
        <p>Encountered an error loading the Needs data. Sorry!</p>
      </main>
    )
  }
  console.log(data)
  console.log(error)
  return (
    <main>
      <div>
        {!data.length
          ? (
            <>
              <p>No needs found yet. Want to add your first one?</p>
              <Button onClick={() => setShowAddModal(true)}>Add</Button>
            </>
          )
          : (
            <List>
              {data.map(({ name, description, fulfilledState, assigneeId, id }, index) => (
                <ListItem key={`${index}-${id.slice(-4)}`}>
                  <p>{name}</p>
                  <p>{description}</p>
                  <p>{fulfilledState}</p>
                  <p>{assigneeId}</p>
                </ListItem>
              ))}
            </List>
          )}
      </div>
      <Button onClick={() => setShowAddModal(true)}>Add</Button>
      {showAddModal && (
        <AddNeedModal churchId={churchId} userId={userId} setShowAddModal={setShowAddModal} />
      )}
    </main>
  )
}

interface AddModalProps extends Props {
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>
}

const AddNeedModal: React.FC<AddModalProps> = ({ userId, churchId, setShowAddModal }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [createdNeed, setCreatedNeed] = useState<Need | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!name || !description || !submitting) {
      return
    }

    const post = async () => {
      const response = await fetch("api/needs/add", {
        method: "POST",
        headers: {
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name,
          description,
          fulfilledState: "Unfulfilled",
          ownerId: userId
        })
      })
      const need: Need = await response.json()
      setCreatedNeed(need)
    }

    post()
  }, [name, description, churchId, userId, submitting])

  useEffect(() => {
    if (createdNeed && createdNeed.id) {
      setSubmitting(false)
    }
  }, [createdNeed])

  if (createdNeed && createdNeed.name) {
    return (
      <Box>
        <Text>Created new need: <strong>{createdNeed.name}</strong></Text>
        <Button onClick={() => setShowAddModal(false)}>Close</Button>
      </Box>
    )
  }
  if (submitting) {
    return <Spinner />
  }
  return (
    <Box>
      <Input
        placeholder="Name of your need"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Textarea
        placeholder="A fitting description of your need with appropriate details"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button onClick={() => setSubmitting(true)}>Submit</Button>
    </Box>
  )
}


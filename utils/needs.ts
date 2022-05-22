import { NextApiResponse } from "next"
import { OwnerEditableStateUpdater } from "../types/entities"

export const updateOnwerEditableState: OwnerEditableStateUpdater = (existingState) => {
  switch (existingState) {
    case "Unfulfilled":
      return "N/A"
    case "Fulfilled":
      return existingState
    case "N/A":
      return "Unfulfilled"
  }
}

// API Utilities

export const sendNeedsResponse = (res: NextApiResponse) => (status: number) => {
  switch (status) {
    case 400:
      return () => res.status(status).json({
        error:
          "Bad request. Please use hook for GET, api/needs for POST, or api/needs/[id] for PATCH"
      })
    case 200:
      return <T>(data?: T) => res.status(status).json({
        data,
        message: "Operation successful. Place any log info here"
      })
    default:
      return () => null
  }
}

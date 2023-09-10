import React, { ChangeEvent, FC, memo, useState } from "react"
import { TextField } from "@mui/material"

type Props = {
  value: string
  onChange: (newValue: string) => void
}

export const EditableSpan: FC<Props> = memo(function ({ value, onChange }) {
  const [editMode, setEditMode] = useState(false)
  const [title, setTitle] = useState(value)
  const [error, setError] = useState<string | null>(null)

  const activateEditMode = () => {
    setEditMode(true)
    setTitle(value)
  }

  const activateViewMode = () => {
    if (error !== null) {
      setError(null)
    }
    setEditMode(false)
    onChange(title)
  }

  const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  return editMode ? (
    <TextField value={title} onChange={changeTitle} autoFocus onBlur={activateViewMode} helperText={error} />
  ) : (
    <span onDoubleClick={activateEditMode}>{value}</span>
  )
})

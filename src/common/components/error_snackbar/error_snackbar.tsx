import React, { FC, memo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AlertProps, Snackbar } from "@mui/material"
import MuiAlert from "@mui/material/Alert"
import { appActions } from "app/app_slice"
import { errorSelector } from "app/app_selectors"

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export const ErrorSnackbar: FC = memo(() => {
  const error = useSelector(errorSelector)
  const dispatch = useDispatch()

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return
    }
    dispatch(appActions.setAppError({ error: null }))
  }

  const isOpen = error !== null

  return (
    <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error">
        {error}
      </Alert>
    </Snackbar>
  )
})

import React, { FC, memo, useEffect } from "react"
import "app/app.css"
import { useSelector } from "react-redux"
import { authThunks } from "features/auth/auth_slice"
import { CircularProgress } from "@mui/material"
import { isInitializedSelector } from "app/app_selectors"
import { useAppDispatch } from "common/hooks/use_app_dispatch"
import { ErrorSnackbar } from "common/components"
import { Header } from "app/header/header"
import { Routing } from "app/routing/routing"

type Props = {
  demo?: boolean
}

export const App: FC<Props> = memo(({ demo = false }) => {
  const isInitialized = useSelector(isInitializedSelector)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(authThunks.initializeApp())
  }, [])

  if (!isInitialized) {
    return (
      <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
        <CircularProgress />
      </div>
    )
  }

  return (
    <div className="App">
      <ErrorSnackbar />
      <Header />
      <Routing demo={demo} />
    </div>
  )
})

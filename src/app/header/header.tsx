import { AppBar, Button, IconButton, LinearProgress, Toolbar, Typography } from "@mui/material"
import { Menu } from "@mui/icons-material"
import React, { FC, memo, useCallback } from "react"
import { useSelector } from "react-redux"
import { isLoggedInSelector } from "features/auth/auth_selectors"
import { authThunks } from "features/auth/auth_slice"
import { useAppDispatch } from "common/hooks/use_app_dispatch"
import { statusSelector } from "app/app_selectors"

export const Header: FC = memo(() => {
  const dispatch = useAppDispatch()
  const isLoggedIn = useSelector(isLoggedInSelector)
  const status = useSelector(statusSelector)

  const logoutHandler = useCallback(() => {
    dispatch(authThunks.logout())
  }, [])

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <Menu />
        </IconButton>
        <Typography variant="h6">News</Typography>
        {isLoggedIn && (
          <Button color="inherit" onClick={logoutHandler}>
            Log out
          </Button>
        )}
      </Toolbar>
      {status === "loading" && <LinearProgress />}
    </AppBar>
  )
})

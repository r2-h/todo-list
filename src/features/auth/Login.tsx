import React from "react"
import { useFormik } from "formik"
import { useSelector } from "react-redux"
import { loginTC } from "features/auth/auth_reducer"
import { Navigate } from "react-router-dom"
import { useAppDispatch } from "common/hooks/useAppDispatch"
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField } from "@mui/material"
import { isLoggedInSelector } from "features/auth/auth-selectors"

type FormikErrorType = {
  email?: string
  password?: string
  rememberMe?: boolean
}

export const Login = () => {
  const dispatch = useAppDispatch()

  const isLoggedIn = useSelector(isLoggedInSelector)

  const formik = useFormik({
    validate: (values) => {
      const errors: FormikErrorType = {}
      if (!values.email) {
        errors.email = "Required"
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Invalid email address"
      }

      if (!values.password) {
        errors.password = "Required"
      } else if (values.password.length <= 3) {
        errors.password = "Password should be more than 3 symbols"
      }
      return errors
    },
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    onSubmit: (values) => {
      dispatch(loginTC(values))
    },
  })

  if (isLoggedIn) {
    return <Navigate to={"/"} />
  }

  return (
    <Grid container justifyContent="center">
      <Grid item xs={4}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered{" "}
                <a href={"https://social-network.samuraijs.com/"} target={"_blank"}>
                  here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p> Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField label="Email" margin="normal" {...formik.getFieldProps("email")} />
              {formik.errors.email && formik.touched.email ? (
                <div style={{ color: "red" }}>{formik.errors.email}</div>
              ) : null}
              <TextField type="password" label="Password" margin="normal" {...formik.getFieldProps("password")} />
              {formik.errors.password && formik.touched.password ? (
                <div style={{ color: "red" }}>{formik.errors.password}</div>
              ) : null}
              <FormControlLabel
                label={"Remember me"}
                control={<Checkbox {...formik.getFieldProps("rememberMe")} checked={formik.values.rememberMe} />}
              />
              <Button type={"submit"} variant={"contained"} color={"primary"}>
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  )
}

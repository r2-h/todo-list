import { useAppDispatch } from "common/hooks/use_app_dispatch"
import { FormikHelpers, useFormik } from "formik"
import { LoginParamsType } from "features/auth/auth_api"
import { authThunks } from "features/auth/auth_slice"
import { BaseResponseType } from "common/types"

export const useLogin = () => {
  const dispatch = useAppDispatch()

  const formik = useFormik({
    validate: (values) => {
      const errors: Partial<Omit<LoginParamsType, "captcha">> = {}
      if (!values.email) {
        errors.email = "Email is required"
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Invalid email address"
      }

      if (!values.password) {
        errors.password = "Password is required"
      } else if (values.password.length < 3) {
        errors.password = "Must be 3 characters or more"
      }

      return errors
    },
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    onSubmit: (values, formikHelpers: FormikHelpers<LoginParamsType>) => {
      dispatch(authThunks.login(values))
        .unwrap()
        .catch((reason: BaseResponseType) => {
          reason.fieldsErrors?.forEach((fieldError) => {
            formikHelpers.setFieldError(fieldError.field, fieldError.error)
          })
        })
    },
  })
  return { formik }
}

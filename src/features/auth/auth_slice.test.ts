import { authReducer, AuthReducerType, authThunks } from "features/auth/auth_slice"

let startState: AuthReducerType

beforeEach(() => {
  startState = {
    isLoggedIn: false,
  }
})

test("should be logged", () => {
  const endState = authReducer(
    startState,
    authThunks.login.fulfilled({ isLoggedIn: true }, "requestId", { password: "", email: "", rememberMe: true })
  )

  expect(endState.isLoggedIn).toBe(true)
})

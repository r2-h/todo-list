import { appActions, appReducer, InitialStateType } from "app/app_slice"

let startState: InitialStateType

beforeEach(() => {
  startState = {
    error: null,
    status: "idle",
    isInitialized: false,
  }
})

test("correct error message should be set", () => {
  const endState = appReducer(startState, appActions.setAppError({ error: "some error" }))
  expect(endState.error).toBe("some error")
})

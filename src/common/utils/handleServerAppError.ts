import { appActions } from "app/app-reducer"
import { ResponseType } from "common/api_instance"
import { AppDispatch } from "app/store"

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: AppDispatch) => {
  if (data.messages.length) {
    dispatch(appActions.setAppError({ error: data.messages[0] }))
  } else {
    dispatch(appActions.setAppError({ error: "Some error occurred" }))
  }
  dispatch(appActions.setAppStatus({ status: "failed" }))
}

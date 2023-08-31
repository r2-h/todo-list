import { appActions } from "app/app_reducer"
import { AppDispatch } from "app/store"
import { BaseResponseType } from "common/types"

export const handleServerAppError = <D>(
  data: BaseResponseType<D>,
  dispatch: AppDispatch,
  showError: boolean = true
) => {
  if (showError) {
    dispatch(appActions.setAppError({ error: data.messages.length ? data.messages[0] : "Some error" }))
  }
  dispatch(appActions.setAppStatus({ status: "failed" }))
}

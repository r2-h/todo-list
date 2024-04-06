import React from "react"
import { BrowserRouterDecorator, ReduxStoreProviderDecorator } from "../stories/decorators/ReduxStoreProviderDecorator"
import { App } from "app/app"

export default {
  title: "Application Stories",
  component: App,
  decorators: [ReduxStoreProviderDecorator, BrowserRouterDecorator],
}

export const AppBaseExample = (props: any) => {
  return <App />
}

import React from "react"
import { action } from "@storybook/addon-actions"
import { AddItemForm } from "common/components/add_Item_form/add_item_form"

export default {
  title: "AddItemForm Stories",
  component: AddItemForm,
}

const asyncCallback = async (...params: any[]) => {
  action("Button inside form clicked")(...params)
}

export const AddItemFormBaseExample = (props: any) => {
  return <AddItemForm addItem={asyncCallback} />
}

export const AddItemFormDisabledExample = (props: any) => {
  return <AddItemForm disabled={true} addItem={asyncCallback} />
}

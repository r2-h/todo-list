import React, { useEffect, useState } from "react"
import { todolistsAPI } from "features/todolists_list/todolist/todolists_api"
import { tasksAPI } from "features/todolists_list/todolist/tasks/taks-api"

export default {
  title: "API",
}

export const GetTodolists = () => {
  const [state, setState] = useState<any>(null)

  useEffect(() => {
    todolistsAPI.getTodolists().then((res) => {
      setState(res.data)
    })
  }, [])

  return <div> {JSON.stringify(state)}</div>
}

export const CreateTodolist = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    todolistsAPI.createTodolist("blabla todolist").then((res) => {
      setState(res.data)
    })
  }, [])

  return <div> {JSON.stringify(state)}</div>
}

export const DeleteTodolist = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const todolistId = "0da4eca9-b11b-416f-ac61-ecf3b195e25c"
    todolistsAPI.deleteTodolist(todolistId).then((res) => {
      setState(res.data)
    })
  }, [])

  return <div> {JSON.stringify(state)}</div>
}

export const UpdateTodolistTitle = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const todolistId = "1490c9b5-19c9-44a8-bc18-5ca4f1597cfa"
    todolistsAPI.updateTodolist({ id: todolistId, title: "new title" }).then((res) => {
      setState(res.data)
    })
  }, [])

  return <div> {JSON.stringify(state)}</div>
}

export const GetTasks = () => {
  const [state, setState] = useState<any>(null)
  const [todolistId, setTodolistId] = useState<string>("")

  const getTasks = () => {
    tasksAPI.getTasks(todolistId).then((res) => {
      setState(res.data)
    })
  }

  return (
    <div>
      {" "}
      {JSON.stringify(state)}
      <div>
        <input
          placeholder={"todolistId"}
          value={todolistId}
          onChange={(e) => {
            setTodolistId(e.currentTarget.value)
          }}
        />

        <button onClick={getTasks}>get tasks</button>
      </div>
    </div>
  )
}

export const DeleteTask = () => {
  const [state, setState] = useState<any>(null)
  const [taskId, setTaskId] = useState<string>("")
  const [todolistId, setTodolistId] = useState<string>("")

  const deleteTask = () => {
    tasksAPI.deleteTask({ todolistId, taskId }).then((res) => {
      setState(res.data)
    })
  }

  return (
    <div>
      {" "}
      {JSON.stringify(state)}
      <div>
        <input
          placeholder={"todolistId"}
          value={todolistId}
          onChange={(e) => {
            setTodolistId(e.currentTarget.value)
          }}
        />
        <input
          placeholder={"taskId"}
          value={taskId}
          onChange={(e) => {
            setTaskId(e.currentTarget.value)
          }}
        />
        <button onClick={deleteTask}>delete task</button>
      </div>
    </div>
  )
}

export const CreateTask = () => {
  const [state, setState] = useState<any>(null)
  const [taskTitle, setTaskTitle] = useState<string>("")
  const [todolistId, setTodolistId] = useState<string>("")

  const createTask = () => {
    tasksAPI.createTask({ todolistId, title: taskTitle }).then((res) => {
      setState(res.data)
    })
  }

  return (
    <div>
      {" "}
      {JSON.stringify(state)}
      <div>
        <input
          placeholder={"todolistId"}
          value={todolistId}
          onChange={(e) => {
            setTodolistId(e.currentTarget.value)
          }}
        />
        <input
          placeholder={"Task Title"}
          value={taskTitle}
          onChange={(e) => {
            setTaskTitle(e.currentTarget.value)
          }}
        />
        <button onClick={createTask}>create task</button>
      </div>
    </div>
  )
}

export const UpdateTask = () => {
  const [state, setState] = useState<any>(null)
  const [title, setTitle] = useState<string>("title 1")
  const [description, setDescription] = useState<string>("descripton 1")
  const [status, setStatus] = useState<number>(0)
  const [priority, setPriority] = useState<number>(0)
  const [startDate, setStartDate] = useState<string>("")
  const [deadline, setDeadline] = useState<string>("")

  const [todolistId, setTodolistId] = useState<string>("")
  const [taskId, setTaskId] = useState<string>("")

  const createTask = () => {
    tasksAPI
      .updateTask(todolistId, taskId, {
        deadline: "",
        description: description,
        priority: priority,
        startDate: "",
        status: status,
        title: title,
      })
      .then((res) => {
        setState(res.data)
      })
  }

  return (
    <div>
      {" "}
      {JSON.stringify(state)}
      <div>
        <input
          placeholder={"taskId"}
          value={taskId}
          onChange={(e) => {
            setTaskId(e.currentTarget.value)
          }}
        />
        <input
          placeholder={"todolistId"}
          value={todolistId}
          onChange={(e) => {
            setTodolistId(e.currentTarget.value)
          }}
        />
        <input
          placeholder={"Task Title"}
          value={title}
          onChange={(e) => {
            setTitle(e.currentTarget.value)
          }}
        />
        <input
          placeholder={"Description"}
          value={description}
          onChange={(e) => {
            setDescription(e.currentTarget.value)
          }}
        />
        <input
          placeholder={"status"}
          value={status}
          type="number"
          onChange={(e) => {
            setStatus(+e.currentTarget.value)
          }}
        />
        <input
          placeholder={"priority"}
          value={priority}
          type="number"
          onChange={(e) => {
            setPriority(+e.currentTarget.value)
          }}
        />
        <button onClick={createTask}>update task</button>
      </div>
    </div>
  )
}

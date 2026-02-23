"use client";

import { trpcClient } from "@/app/lib/trpc-client";
import { Task } from "@/server/types/task";
import { useEffect, useState } from "react";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");

  async function handleCreateTask(e: React.SubmitEvent) {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (trimmedTitle === "") {
      return;
    }
    await trpcClient.task.create.mutate({ title: trimmedTitle });
    setTitle("");
    await refreshTasks();
  }
  async function handleToggleTask(id: string) {
    await trpcClient.task.toggle.mutate({ id });
    await refreshTasks();
  }
  async function handleDeleteTask(id: string) {
    await trpcClient.task.delete.mutate({ id });
    await refreshTasks();
  }

  async function refreshTasks() {
    const data = await trpcClient.task.getAll.query();
    setTasks(data);
  }
  useEffect(() => {
    refreshTasks();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-md">
      <h1 className="text-2xl font-bold mb-4">Task List</h1>
      <form onSubmit={handleCreateTask} className="flex gap-2 mb-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task"
          className="flex-1 p-2 border rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleTask(task.id)}
              className="w-4 h-4"
            />
            <span
              className={`flex-1 ${
                task.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {task.title}
            </span>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

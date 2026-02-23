import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { Task } from "../types/task";

const tasks: Task[] = [{ id: "1", title: "Task 1", completed: false }];



export const taskRouter = router({
  getAll: publicProcedure.query(() => tasks),
  create: publicProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(({ input }) => {
      const newTask = {
        id: crypto.randomUUID(),
        title: input.title,
        completed: false,
      };
      tasks.push(newTask);
      return newTask;
    }),

  toggle: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      const task = tasks.find((task) => task.id === input.id);
      if (!task) {
        throw new Error("Task not found");
      }
      task.completed = !task.completed;
      return task;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      const index = tasks.findIndex((task) => task.id === input.id);
      if (index !== -1) {
        tasks.splice(index, 1);
        return { success: true };
      } else {
        throw new Error("Task not found");
      }
    }),
});

import { taskRouter } from "./routes/task";
import { router } from "./trpc";

export const appRouter = router({
  task: taskRouter,
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

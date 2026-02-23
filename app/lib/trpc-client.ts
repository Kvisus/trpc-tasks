import type { AppRouter } from "@/server";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "/api/trpc",
    }),
  ],
});

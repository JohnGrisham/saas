// src/provider.tsx
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { jsx, jsxs } from "react/jsx-runtime";
var queryClient = new QueryClient();
var Client = ({ children }) => /* @__PURE__ */ jsxs(QueryClientProvider, {
  client: queryClient,
  children: [
    children,
    /* @__PURE__ */ jsx(ReactQueryDevtools, {})
  ]
});

// src/hooks/useQuery.tsx
import { useQuery as useRQquery } from "react-query";
import { GraphQLClient, gql } from "graphql-request";
var graphQLClient = new GraphQLClient("https://saas-johngrisham.grafbase.app/graphql", {
  headers: {
    Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NjEyNzY3MjUsImlzcyI6ImdyYWZiYXNlIiwiYXVkIjoiMDFHQjVXWTdZSFZITVo2WEcyMTNEUTBIU0oiLCJqdGkiOiIwMUdCNVdZN1lITkU4NkhNQVM4RkVRMEhNMSIsImVudiI6InByb2R1Y3Rpb24iLCJwdXJwb3NlIjoicHJvamVjdC1hcGkta2V5In0.oh7D7TztmFzzgs5xeDlkAv9W-fvHLd-C8RyHRN_1l3o"}`
  }
});
var useQuery = (key, query) => {
  return useRQquery(key, async () => {
    const response = await graphQLClient.request(
      gql`
        ${query}
      `
    );
    return response;
  });
};
export {
  Client,
  useQuery
};

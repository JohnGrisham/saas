"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Client: () => Client,
  useQuery: () => useQuery
});
module.exports = __toCommonJS(src_exports);

// src/provider.tsx
var import_react_query = require("react-query");
var import_devtools = require("react-query/devtools");
var import_jsx_runtime = require("react/jsx-runtime");
var queryClient = new import_react_query.QueryClient();
var Client = ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react_query.QueryClientProvider, {
  client: queryClient,
  children: [
    children,
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_devtools.ReactQueryDevtools, {})
  ]
});

// src/hooks/useQuery.tsx
var import_react_query2 = require("react-query");
var import_graphql_request = require("graphql-request");
var graphQLClient = new import_graphql_request.GraphQLClient("https://saas-johngrisham.grafbase.app/graphql", {
  headers: {
    Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NjEyNzY3MjUsImlzcyI6ImdyYWZiYXNlIiwiYXVkIjoiMDFHQjVXWTdZSFZITVo2WEcyMTNEUTBIU0oiLCJqdGkiOiIwMUdCNVdZN1lITkU4NkhNQVM4RkVRMEhNMSIsImVudiI6InByb2R1Y3Rpb24iLCJwdXJwb3NlIjoicHJvamVjdC1hcGkta2V5In0.oh7D7TztmFzzgs5xeDlkAv9W-fvHLd-C8RyHRN_1l3o"}`
  }
});
var useQuery = (key, query) => {
  return (0, import_react_query2.useQuery)(key, async () => {
    const response = await graphQLClient.request(
      import_graphql_request.gql`
        ${query}
      `
    );
    return response;
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Client,
  useQuery
});

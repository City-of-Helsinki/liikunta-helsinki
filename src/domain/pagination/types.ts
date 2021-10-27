import {
  ApolloQueryResult,
  FetchMoreOptions,
  FetchMoreQueryOptions,
  OperationVariables,
} from "@apollo/client";

// Copied from Apollo's type definitions
export type FetchMoreFunction<
  TData = any,
  TGraphQLVariables = OperationVariables
> = (
  fetchMoreOptions: FetchMoreQueryOptions<TGraphQLVariables, TData> &
    FetchMoreOptions<TData, TGraphQLVariables>
) => Promise<ApolloQueryResult<TData>>;

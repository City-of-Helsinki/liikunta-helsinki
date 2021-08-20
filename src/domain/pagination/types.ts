import {
  ApolloQueryResult,
  DocumentNode,
  FetchMoreOptions,
  FetchMoreQueryOptions,
  TypedDocumentNode,
} from "@apollo/client";

// Copied from Apollo's type definitions
export type FetchMoreFunction<TVariables, TData> = (<
  K extends keyof TVariables
>(
  fetchMoreOptions: FetchMoreQueryOptions<TVariables, K, TData> &
    FetchMoreOptions<TData, TVariables>
) => Promise<ApolloQueryResult<TData>>) &
  (<TData2, TVariables2, K extends keyof TVariables2>(
    fetchMoreOptions: {
      query?: DocumentNode | TypedDocumentNode<TData, TVariables>;
    } & FetchMoreQueryOptions<TVariables2, K, TData> &
      FetchMoreOptions<TData2, TVariables2>
  ) => Promise<ApolloQueryResult<TData2>>);

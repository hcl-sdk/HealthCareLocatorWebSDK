const VERSION = 'v2';
const graphqlEndpoint = (window as any).HCL_API_GRAPHQL_HOST || process.env.API_GRAPHQL_HOST;
export const ENDPOINT = graphqlEndpoint + `/${VERSION}/query`;

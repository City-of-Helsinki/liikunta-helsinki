// eslint-disable-next-line @typescript-eslint/no-empty-function
function readiness() {}

export const getServerSideProps = async (context) => {
  context.res.end("OK");
  return { props: {} };
};

export default readiness;

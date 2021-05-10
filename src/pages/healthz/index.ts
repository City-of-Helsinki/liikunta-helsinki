// eslint-disable-next-line @typescript-eslint/no-empty-function
function healthz() {}

export const getServerSideProps = async (context) => {
  context.res.end("OK");
  return { props: {} };
};

export default healthz;

export default async (context, req, res) => {
  const { data } = context;
  const { a, b } = data;
  return a + b;
};

const page = ({ params }: { params: { keyword: string } }) => {
  return <h1>keyword: {params.keyword} </h1>;
};

export default page;

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const useSearch = () => {
  const router = useRouter();
  const [searchWord, setSearchWord] = useState("");

  const handleSearch = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    router.push(`/search/${decodeURIComponent(searchWord)}`);
  };

  return { searchWord, setSearchWord, handleSearch };
};

export default useSearch;

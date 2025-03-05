import { useForm } from "react-hook-form"
import SearchIcon from "../../assets/SearchIcon"

const SearchInput = ({
  setSearchQuery,
}: {
  // eslint-disable-next-line no-unused-vars
  setSearchQuery: (data: string) => void
}) => {
  const { register, handleSubmit } = useForm()

  return (
    <div className="flex w-full items-center max-w-xl h-14 border border-gray-250 rounded-xl">
      <div className="bg-primary-dark h-full rounded-tl-xl rounded-bl-xl flex items-center justify-center p-2 text-white space-x-1">
        <SearchIcon />
      </div>
      <form onSubmit={handleSubmit((data) => setSearchQuery(data.search))}>
        <input
          className="px-2 flex-1 outline-none border-none h-full w-5/6  rounded-xl"
          placeholder="Enter name"
          {...register("search")}
        />
      </form>
    </div>
  )
}

export default SearchInput

import { Controller, useForm } from "react-hook-form"
import SearchIcon from "../../assets/SearchIcon"

const SearchInput = ({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string
  // eslint-disable-next-line no-unused-vars
  setSearchQuery: (data: string) => void
}) => {
  const { handleSubmit, control } = useForm()

  return (
    <form
      onSubmit={handleSubmit((data) => setSearchQuery(data.search))}
      className="border border-gray-250 flex h-12 rounded-lg"
    >
      <Controller
        name="search"
        control={control}
        defaultValue={searchQuery}
        render={({ field }) => (
          <input
            {...field}
            className="px-2 outline-none border-none h-full w-full rounded-xl"
            placeholder="Enter name"
          />
        )}
      />

      <button className="bg-primary-dark flex items-center justify-center w-16 rounded-tr-lg rounded-br-lg">
        <SearchIcon />
      </button>
    </form>
  )
}

export default SearchInput

import { useState, useEffect, useRef } from "react"

const Search = ({
  setSearchedIssue,
  getSearchIssue,
  setKeyword,
  keyword,
  searchIssuePage,
}) => {
  const getSearchIssueRef = useRef(false)
  function keywordChange(e) {
    setKeyword(e.target.value)
  }
  // const searchStatus = useRef(false)
  function keywordSearch(event) {
    const keywordInput = document.getElementById("search_task").value
    event.preventDefault()
    if (keyword !== keywordInput) {
      setKeyword(keywordInput)
      setSearchedIssue([])
      searchIssuePage.current = 1
      getSearchIssueRef.current = true
    }

    // getSearchIssue()
  }
  useEffect(() => {
    if (!getSearchIssueRef.current) {
      return
    }
    getSearchIssue()
  }, [keyword])
  return (
    <form className="w-1/2 mx-auto mt-10">
      {/* {keyword} */}
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only "
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          type="search"
          id="search_task"
          className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary-dark "
          placeholder="Search Mockups, Logos..."
          required
        />
        <button
          onClick={keywordSearch}
          type="button"
          className="text-white absolute right-2.5 bottom-2.5 bg-primary hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-primary-light font-medium rounded-lg text-sm px-4 py-2 "
        >
          Search
        </button>
      </div>
    </form>
  )
}

export default Search

import Search from "./components/Search"
import Item from "./components/Item"
import { useLocation } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import { Octokit } from "@octokit/core"
// let assignedIssuePage = 1
// let searchIssuePage = 1

const Task = () => {
  const [issues, setIssues] = useState([])
  const [assignedIssue, setAssignedIssue] = useState([])
  const [searchedIssue, setSearchedIssue] = useState([])
  const showType = useRef("assigned")
  const assignedIssuePage = useRef(1)
  const searchIssuePage = useRef(1)
  // const [showType, setShowType] = useState("")
  const [keyword, setKeyword] = useState("")

  useEffect(() => {
    getAssignedIssue()
  }, []) //如果為空就第一次渲染會跑

  const octokit = new Octokit({
    auth: sessionStorage.getItem("token"),
    accept: "application/vnd.github+json",
  })

  function loadMore(fetchData) {
    let setIssueFunction
    let nowIssue = []
    if (showType.current == "assigned") {
      setIssueFunction = setAssignedIssue
      nowIssue = assignedIssue
    } else if (showType.current == "search") {
      setIssueFunction = setSearchedIssue
      nowIssue = searchedIssue
    }
    // console.log(nowIssue)
    console.log(nowIssue)
    if (nowIssue.length === 0) {
      setIssueFunction(fetchData)
    } else {
      setIssueFunction(function (prev) {
        return prev.concat(fetchData)
      })
    }
    if (fetchData == 0) {
      loadMoreIssueRef.current = false
    }
  }

  const loadMoreIssueRef = useRef(true)
  // const changeShowTypeRef = useRef(true)
  useEffect(() => {
    // if (!changeShowTypeRef.current) {
    //   return
    // }
    console.log(showType.current)
    if (showType.current == "assigned") {
      setIssues(assignedIssue)
    } else if (showType.current == "search") {
      setIssues(searchedIssue)
    }
  }, [showType.current, assignedIssue, searchedIssue])

  useEffect(() => {
    if (!loadMoreIssueRef.current) {
      return
    }

    let getFunction
    if (showType.current == "assigned") {
      getFunction = getAssignedIssue
    } else if (showType.current == "search") {
      getFunction = getSearchIssue
    }
    let bodyHeight = document.body.scrollHeight
    const handleScroll = () => {
      if (window.scrollY + window.screen.height >= bodyHeight) {
        getFunction().then((result) => {
          if (!result) {
            window.removeEventListener("scroll", handleScroll)
          }
        })
        window.removeEventListener("scroll", handleScroll)
      }
    }
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [issues])

  async function getAssignedIssue() {
    const fetchedAssignedIssue = await octokit
      .request("GET /issues", {
        per_page: "10",
        page: assignedIssuePage.current,
      })
      .then(assignedIssuePage.current++)
    console.log(fetchedAssignedIssue)
    loadMore(fetchedAssignedIssue.data)
  }
  async function getSearchIssue() {
    if (!loadMoreIssueRef.current) {
      loadMoreIssueRef.current = true
    }
    // console.log(keyword)
    const searchedIssue = await octokit
      .request("GET /search/issues", {
        q: keyword,
        sort: "created",
        per_page: 10,
        page: searchIssuePage.current,
      })
      .then((searchIssuePage.current += 1))
    showType.current = "search"
    // setShowType("search")
    // setSearchedIssue(searchedIssue.data.items)
    // console.log(showType)
    loadMore(searchedIssue.data.items)
  }
  function clearSearch() {
    setKeyword("")
    setSearchedIssue([])
    searchIssuePage.current = 1
    showType.current = "assigned"
  }
  return (
    <div className="app">
      <Search
        setSearchedIssue={setSearchedIssue}
        getSearchIssue={getSearchIssue}
        setKeyword={setKeyword}
        keyword={keyword}
        searchIssuePage={searchIssuePage}
      ></Search>
      <div className="mt-10 mx-20">
        {keyword && (
          <div className="text-2xl font-bold flex justify-between">
            目前搜尋 : {keyword}
            <button
              onClick={clearSearch}
              className="bg-red-200 text-sm px-2 rounded-md hover:bg-red-300 duration-150"
            >
              清除搜尋
            </button>
          </div>
        )}
        {issues.map((item) => {
          return <Item key={item.node_id} item={item}></Item>
        })}
      </div>
    </div>
  )
}

export default Task

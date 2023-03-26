import Search from "./components/Search"
import Item from "./components/Item"
import ItemModal from "./components/ItemModal"
import AlertModal from "./components/AlertModal"
import Loading from "../../global/Loading"
import EditModal from "./components/EditModal"
import {
  showLoading,
  hiddenLoading,
  showContentLoading,
  hiddenContentLoading,
} from "../../global/function"
import { useLocation } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import { Octokit } from "@octokit/core"
import { click } from "@testing-library/user-event/dist/click"
// let assignedIssuePage = 1
// let searchIssuePage = 1
// const statusType = ["Open", "In Progress", "Done"]
const Task = () => {
  const [issues, setIssues] = useState([])
  const [assignedIssue, setAssignedIssue] = useState([])
  const [searchedIssue, setSearchedIssue] = useState([])
  const showType = useRef("assigned")
  const assignedIssuePage = useRef(1)
  const searchIssuePage = useRef(1)
  const [modalItem, setModalItem] = useState({})
  const changeModalItemRef = useRef(false)
  // const sortRef = useRef("")
  const [sort, setSort] = useState("desc")
  const deleteItemRef = useRef({})
  const editItemRef = useRef({})

  // const [modalBody, setModalBody] = useState("")
  const [keyword, setKeyword] = useState("")
  const loadMoreIssueRef = useRef(true)
  const [statusCheck, setStatusCheck] = useState([
    {
      name: "Open",
      checked: true,
    },
    {
      name: "In Progress",
      checked: true,
    },
    {
      name: "Done",
      checked: true,
    },
    {
      name: "Else",
      checked: true,
    },
  ])

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

  // const changeShowTypeRef = useRef(true)
  useEffect(() => {
    // if (!changeShowTypeRef.current) {
    //   return
    // }
    if (showType.current == "assigned") {
      const statusChecked = statusCheck
        .filter((status) => status.checked)
        .map((status) => status.name)
      const statusAll = statusCheck.map((status) => status.name)
      function classifyStatus(label) {
        if (statusAll.includes(label)) {
          return label
        } else {
          return "Else"
        }
      }
      const filterIssue = assignedIssue.filter((issue) => {
        if (!issue.labels.length) {
          if (statusChecked.includes("Else")) {
            return issue
          }
        }
        for (let i = 0; i < issue.labels.length; i++) {
          let label = issue.labels[i].name
          if (statusChecked.includes(classifyStatus(label))) {
            return issue
          }
        }
      })

      setIssues(filterIssue)
    } else if (showType.current == "search") {
      setIssues(searchedIssue)
    }
  }, [showType.current, assignedIssue, searchedIssue, statusCheck])

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
    // if( ="desc"){}
    if (assignedIssuePage.current === 1) {
      showLoading()
    } else {
      showContentLoading()
    }
    const fetchedAssignedIssue = await octokit
      .request("GET /issues", {
        per_page: "10",
        // filter: "all",
        state: "all",
        sort: "created",
        direction: sort,
        page: assignedIssuePage.current,
      })
      .then(assignedIssuePage.current++)
      .catch(() => {
        alert("token過期，請重新認證")
        window.location.assign("/")
      })

    if (assignedIssuePage.current === 2) {
      hiddenLoading()
    } else {
      hiddenContentLoading()
    }
    // loadMore(fetchedAssignedIssue.data)
    loadMore(fetchedAssignedIssue.data.filter((x) => x.state == "open"))
  }
  async function getSearchIssue() {
    if (!loadMoreIssueRef.current) {
      loadMoreIssueRef.current = true
    }
    // console.log(keyword)
    if (searchIssuePage.current === 1) {
      showLoading()
    } else {
      showContentLoading()
    }
    const searchedIssue = await octokit
      .request("GET /search/issues", {
        q: keyword,
        sort: "created",
        // state: "all",
        order: sort,
        per_page: 10,
        page: searchIssuePage.current,
      })
      .then((searchIssuePage.current += 1))
      .catch(() => {
        alert("token過期，請重新認證")
        window.location.assign("/")
      })
    if (searchIssuePage.current === 2) {
      hiddenLoading()
    } else {
      hiddenContentLoading()
    }
    showType.current = "search"
    // setShowType("search")
    // setSearchedIssue(searchedIssue.data.items)
    // console.log(showType)
    loadMore(searchedIssue.data.items)
  }

  function clearSearch() {
    showType.current = "assigned"
    setKeyword("")
    setSearchedIssue([])
    document.getElementById("search_task").value = ""
    searchIssuePage.current = 1
    getAssignedIssue()
  }

  function handleStatusChange(index) {
    setStatusCheck(
      statusCheck.map((status, currentIndex) => {
        if (currentIndex === index) {
          return { ...status, checked: !status.checked }
        } else {
          return status
        }
      })
    )
  }

  function handleTimeSort(event) {
    setSort(event.target.value)
  }

  useEffect(() => {
    if (showType.current === "assigned") {
      setAssignedIssue([])
      assignedIssuePage.current = 1
      loadMoreIssueRef.current = true
      getAssignedIssue()
    } else {
      setSearchedIssue([])
      searchIssuePage.current = 1
      loadMoreIssueRef.current = true
      getSearchIssue()
      setAssignedIssue([])
      assignedIssuePage.current = 1
      // getAssignedIssue()
    }
  }, [sort])

  function getStatusCheckbox(status) {
    let color = "blue"
    if (status === "Open") {
      color = "green"
    } else if (status === "In Progress") {
      color = "yellow"
    } else if (status === "Done") {
      color = "red"
    } else {
      color = "blue"
    }
    return `bg-${color}-100`
  }

  // Modal effect
  useEffect(() => {
    if (!changeModalItemRef.current) {
      return
    }
    document.getElementsByTagName("body")[0].classList.add("overflow-y-hidden")
    document.getElementById("itemModal").classList.remove("hidden")
    document.getElementById("itemModal").classList.add("flex")
    changeModalItemRef.current = false
  }, [modalItem])
  // function handleModal(item) {
  //   // console.log(item)
  //   setModalItem(item)
  // }
  return (
    <div className="app">
      <ItemModal
        item={modalItem}
        setModalItem={setModalItem}
        changeModalItemRef={changeModalItemRef}
      ></ItemModal>
      <AlertModal
        deleteItemRef={deleteItemRef}
        octokit={octokit}
        setAssignedIssue={setAssignedIssue}
      ></AlertModal>
      <EditModal
        item={modalItem}
        setModalItem={setModalItem}
        octokit={octokit}
        editItemRef={editItemRef}
        changeModalItemRef={changeModalItemRef}
      ></EditModal>

      <Loading></Loading>
      {/* </div> */}
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

        <div className="flex justify-end mt-2">
          <select
            name="timeSort"
            id=""
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 p-1"
            onChange={handleTimeSort}
            defaultValue={sort}
          >
            <option value="desc">sort from newest</option>
            <option value="asc">sort from oldest</option>
          </select>
          {showType.current === "assigned" && (
            <div className="flex">
              {statusCheck.map((status, index) => (
                <label className="mx-2 flex items-center " key={status.name}>
                  <input
                    type="checkbox"
                    className={` w-4 h-4 mx-2 py-1  ring-inset bg-gray-300 border-gray-300  rounded   focus:ring-2 `}
                    onChange={() => handleStatusChange(index)}
                    name="status"
                    id=""
                    checked={status.checked}
                  />
                  <span
                    className={`${getStatusCheckbox(
                      status.name
                    )} px-2 rounded-md`}
                  >
                    {status.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
        {issues.map((item) => {
          return (
            <Item
              key={item.node_id}
              item={item}
              setModalItem={setModalItem}
              changeModalItemRef={changeModalItemRef}
              deleteItemRef={deleteItemRef}
              editItemRef={editItemRef}
              showType={showType}
            ></Item>
          )
        })}
        <div id="contentLoading" className="mt-10 hidden justify-center">
          <div className="animate-bounce flex justify-center flex-col self-center">
            <img
              className="w-10 mx-auto"
              src="https://upload.wikimedia.org/wikipedia/commons/f/f8/Dcard_Favicon_x520.png"
              alt=""
            />
            <p className="mt-1 font-mono text-center">Loading...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Task

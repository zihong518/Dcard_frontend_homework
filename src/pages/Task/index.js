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
import { useEffect, useState, useRef } from "react"
import { Octokit } from "@octokit/core"
const Task = () => {
  const [issues, setIssues] = useState([]) //The issues show on the page
  const [assignedIssue, setAssignedIssue] = useState([]) // assigned issue
  const [searchedIssue, setSearchedIssue] = useState([]) // searched issue
  const showType = useRef("assigned") //assigned or searched issue show now
  const assignedIssuePage = useRef(1)
  const searchIssuePage = useRef(1)
  const [modalItem, setModalItem] = useState({}) // the issue showing on the modal
  const changeModalItemRef = useRef(false) // if true, can change the data in  modalItem
  const [sort, setSort] = useState("desc") // sorting method
  const deleteItemRef = useRef({}) // the Delete Item showing on the modal
  const editItemRef = useRef({}) // the Edit Item showing on the modal
  const [keyword, setKeyword] = useState("") // the keyword when searched
  const loadMoreIssueRef = useRef(true) // if true, page can load more issue
  // the record of status check
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
  // load assigned Issue
  useEffect(() => {
    getAssignedIssue()
  }, [])
  // get octokit
  const octokit = new Octokit({
    auth: sessionStorage.getItem("token"),
    accept: "application/vnd.github+json",
  })
  // after fetch data according showType is assigned or searched, put the fetch data into the right array
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
    // put fetched data to the state
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
  // update the data show on the page, according shotType, AssignedIssue, SearchedIssue and statusCheck
  useEffect(() => {
    if (showType.current == "assigned") {
      // filter the checked status
      const statusChecked = statusCheck
        .filter((status) => status.checked)
        .map((status) => status.name)
      // get the all status name
      const statusAll = statusCheck.map((status) => status.name)
      // if label not in status name, classify to "Else"
      function classifyStatus(label) {
        if (statusAll.includes(label)) {
          return label
        } else {
          return "Else"
        }
      }
      // filter issues status
      const filterIssue = assignedIssue.filter((issue) => {
        // if the labels of issue is null, classify to "Else"
        if (!issue.labels.length) {
          if (statusChecked.includes("Else")) {
            return issue
          }
        }
        // classify to the status
        for (let i = 0; i < issue.labels.length; i++) {
          let label = issue.labels[i].name
          if (statusChecked.includes(classifyStatus(label))) {
            return issue
          }
        }
      })
      // setIssue after filter the assigned issue
      setIssues(filterIssue)
    } else if (showType.current == "search") {
      setIssues(searchedIssue)
    }
  }, [showType.current, assignedIssue, searchedIssue, statusCheck])

  // loadMore detect if the issues change
  useEffect(() => {
    if (!loadMoreIssueRef.current) {
      return
    }
    // according the show type than set function
    let getFunction
    if (showType.current == "assigned") {
      getFunction = getAssignedIssue
    } else if (showType.current == "search") {
      getFunction = getSearchIssue
    }
    // load more detection
    let bodyHeight = document.body.scrollHeight
    const handleScroll = () => {
      if (window.scrollY + window.screen.height >= bodyHeight) {
        // if no more fetched data, remove the event listener
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

  // get assigned issue
  async function getAssignedIssue() {
    // according the fetch page to show different type of loading
    if (assignedIssuePage.current === 1) {
      showLoading()
    } else {
      showContentLoading()
    }
    // get data
    const fetchedAssignedIssue = await octokit
      .request("GET /issues", {
        per_page: "10",
        state: "all",
        sort: "created",
        direction: sort,
        page: assignedIssuePage.current,
      })
      .then(assignedIssuePage.current++)
      .catch(() => {
        // if error , navigate to the auth page
        alert("token過期，請重新認證")
        window.location.assign("/")
      })

    if (assignedIssuePage.current === 2) {
      hiddenLoading()
    } else {
      hiddenContentLoading()
    }
    // put the fetched data to loadMore
    loadMore(fetchedAssignedIssue.data.filter((x) => x.state == "open"))
  }

  // get searched issue
  async function getSearchIssue() {
    if (!loadMoreIssueRef.current) {
      loadMoreIssueRef.current = true
    }
    if (searchIssuePage.current === 1) {
      showLoading()
    } else {
      showContentLoading()
    }
    const searchedIssue = await octokit
      .request("GET /search/issues", {
        q: keyword,
        sort: "created",
        order: sort,
        per_page: 10,
        page: searchIssuePage.current,
      })
      .then((searchIssuePage.current += 1))
      .catch(() => {
        // if error , navigate to the auth page
        alert("token過期，請重新認證")
        window.location.assign("/")
      })
    if (searchIssuePage.current === 2) {
      hiddenLoading()
    } else {
      hiddenContentLoading()
    }
    showType.current = "search"
    // put the fetched data to loadMore
    loadMore(searchedIssue.data.items)
  }

  // clear the search
  function clearSearch() {
    showType.current = "assigned"
    setKeyword("")
    setSearchedIssue([])
    document.getElementById("search_task").value = ""
    searchIssuePage.current = 1
    getAssignedIssue()
  }

  // to handle the status check
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
  // to handle the time sort type
  function handleTimeSort(event) {
    setSort(event.target.value)
  }
  // according show type, change the list and if refetch the data
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

  // change the background color according the status name
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

  // detect the item in modal , show the modal
  useEffect(() => {
    if (!changeModalItemRef.current) {
      return
    }
    document.getElementsByTagName("body")[0].classList.add("overflow-y-hidden")
    document.getElementById("itemModal").classList.remove("hidden")
    document.getElementById("itemModal").classList.add("flex")
    changeModalItemRef.current = false
  }, [modalItem])

  return (
    <div className="app">
      {/* The detailed info modal */}
      <ItemModal
        item={modalItem}
        setModalItem={setModalItem}
        changeModalItemRef={changeModalItemRef}
      ></ItemModal>
      {/* The delete alert modal */}
      <AlertModal
        deleteItemRef={deleteItemRef}
        octokit={octokit}
        setAssignedIssue={setAssignedIssue}
      ></AlertModal>
      {/* The edit  modal */}
      <EditModal
        item={modalItem}
        setModalItem={setModalItem}
        octokit={octokit}
        editItemRef={editItemRef}
        changeModalItemRef={changeModalItemRef}
      ></EditModal>
      {/* loading */}
      <Loading></Loading>
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
          {/* if the show type is assigned, than show the status check component */}
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

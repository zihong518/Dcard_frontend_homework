import Search from "./components/Search"
import Item from "./components/Item"
import { useLocation } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import { Octokit } from "@octokit/core"
let issuePage = 1

const Task = () => {
  const [issues, setIssues] = useState([])
  const loadMoreIssueRef = useRef(true)
  useEffect(() => {
    if (!loadMoreIssueRef.current) {
      return
    }
    let bodyHeight = document.body.scrollHeight
    const handleScroll = (event) => {
      if (window.scrollY + window.screen.height >= bodyHeight) {
        getIssue().then((result) => {
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

  //   console.log(state.token)
  const octokit = new Octokit({
    auth: sessionStorage.getItem("token"),
    accept: "application/vnd.github+json",
  })

  async function getIssue() {
    const test = await octokit
      .request("GET /issues", {
        per_page: "10",
        page: issuePage,
      })
      .then(issuePage++)

    if (issues.length === 0) {
      setIssues(test.data)
    } else {
      setIssues(function (prev) {
        // console.log(prev)
        return prev.concat(test.data)
      })
    }
    if (test.data.length == 0) {
      loadMoreIssueRef.current = false
    }
    // return test.data
  }
  //   useEffect(() => {}, [issues]) //如果為空就第一次渲染會跑

  useEffect(() => {
    getIssue()
  }, []) //如果為空就第一次渲染會跑

  return (
    <div className="app">
      <Search></Search>
      <div className="mt-10 mx-10">
        {/* {issues} */}
        {issues.map((item) => {
          return <Item key={item.node_id} item={item}></Item>
        })}
      </div>
    </div>
  )
}

export default Task

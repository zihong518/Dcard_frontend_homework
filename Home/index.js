import { useState, useEffect, useRef } from "react"
import { API_GET_DATA } from "../../global/constants"
import Edit from "./components/Edit"
import List from "./components/List"
import "./index.css"

async function fetchData(setData) {
  const res = await fetch(API_GET_DATA)
  const { data } = await res.json()
  setData(data)
}
async function fetchSetData(data) {
  const res = await fetch(API_GET_DATA, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ data }),
  })
}

const Home = () => {
  const [data, setData] = useState([])
  //  只有重新整理才會run
  const submittingStatus = useRef(false)

  useEffect(() => {
    // 當data 改變的時候執行這個function
    return () => {
      // 渲染結束後 新的渲染之前要執行的事情
      // 取消綁定的事情
    }
  }, [data])

  // data 裡面的東西有變動useEffect就會執行一次，like watch in vue
  useEffect(() => {
    if (!submittingStatus.current) {
      return
    }
    fetchSetData(data).then((data) => (submittingStatus.current = false))
  }, [data])

  useEffect(() => {
    fetchData(setData)
  }, []) //如果為空就第一次渲染會跑

  return (
    <div className="app">
      <Edit add={setData} submittingStatus={submittingStatus} />
      <List
        listData={data}
        deleteData={setData}
        submittingStatus={submittingStatus}
      />
    </div>
  )
}
export default Home

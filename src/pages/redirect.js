import axios from "axios"
// import { client_id, client_secret } from "../global/constants"
import { Octokit } from "@octokit/core"
import { useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const code = urlParams.get("code")

// let headers = {
//   "Content-Type": "application/json",
//   // Accept: "application/json",
//   // "Access-Control-Allow-Origin": "*",
// }

// let data = {
//   client_id: client_id,
//   client_secret: client_secret,
//   code: code,
// }

// window.onload = function () {
//   postData()
// }
// $.getJSON("http://localhost:9999/authenticate/" + code, function (data) {
//   console.log(data.token)
// })
async function postData() {
  // const res = await fetch(`http://localhost:9999/authenticate/${code}`)
  const res = await axios({
    method: "get",
    url: `http://localhost:9999/authenticate/${code}`,
    // data: data,
    // headers: headers,
  })
  const token = await res.data.token
  const octokit = new Octokit({
    auth: token,
    accept: "application/vnd.github+json",
  })

  if (token) {
    sessionStorage.setItem("token", token)
  }
}

const Redirect = () => {
  const navigate = useNavigate()
  const fetchToken = useRef(false)
  useEffect(() => {
    if (!fetchToken) {
      return
    }
    fetchToken.current = true
    postData()
    navigate("/task")

    // document.location.hash = "#/task"
  }, [])

  return <div>redirect</div>
}

export default Redirect

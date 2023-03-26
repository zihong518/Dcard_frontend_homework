import axios from "axios"
// import { client_id, client_secret } from "../global/constants"
import Loading from "../global/Loading"
import { showLoading } from "../global/function"
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
async function postData(navigate) {
  // const res = await fetch(`http://localhost:9999/authenticate/${code}`)
  const res = await axios({
    method: "get",
    url: `http://localhost:9999/authenticate/${code}`,
    // data: data,
    // headers: headers,
  }).then((e) => {
    const token = e.data.token
    if (token) {
      sessionStorage.setItem("token", token)
      navigate("/task")
    }
  })
}

const Redirect = () => {
  const navigate = useNavigate()
  const fetchToken = useRef(false)
  useEffect(() => {
    if (!fetchToken) {
      return
    }
    fetchToken.current = true
    postData(navigate)
    // if (postData()) {
    //   navigate("/task")
    // }

    // document.location.hash = "#/task"
    showLoading()
  }, [])

  return <Loading></Loading>
}

export default Redirect

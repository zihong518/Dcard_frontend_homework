import axios from "axios"
// import { client_id, client_secret } from "../global/constants"
import Loading from "../global/Loading"
import { showLoading } from "../global/function"
import { useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
// get the query code
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const code = urlParams.get("code")

async function getToken(navigate) {
  // use query code to get auth token
  const res = await axios({
    method: "get",
    url: `http://localhost:9999/authenticate/${code}`,
  }).then((e) => {
    const token = e.data.token
    if (token) {
      // save token in the session and navigate to task page
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
    // use query code to get auth token
    getToken(navigate)
    showLoading()
  }, [])

  return <Loading></Loading>
}

export default Redirect

import { useEffect, useRef, useState } from "react"
import { showLoading, hiddenLoading } from "../../../global/function"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { dateStringToDate } from "../../../global/function"
const EditModal = ({ editItemRef, setModalItem, octokit }) => {
  const [itemTitle, setItemTitle] = useState(" ")
  const [itemBody, setItemBody] = useState(" ")
  const disabledDetectRef = useRef(true)
  useEffect(() => {
    console.log(editItemRef.current)
    if (!Object.keys(editItemRef.current).length) {
      return
    } else {
      setItemTitle(editItemRef.current.title)
      setItemBody(editItemRef.current.body)
      if (!editItemRef.current.title) {
        document
          .getElementById("titleCheckAlert")
          .classList.replace("hidden", "inline")
      } else {
        document
          .getElementById("titleCheckAlert")
          .classList.replace("inline", "hidden")
      }
      if (editItemRef.current.body.length < 30) {
        document
          .getElementById("bodyCheckAlert")
          .classList.replace("hidden", "inline")
      } else {
        document
          .getElementById("bodyCheckAlert")
          .classList.replace("inline", "hidden")
      }
    }
  }, [editItemRef.current])
  const closeModal = () => {
    editItemRef.current = {}
    document
      .getElementsByTagName("body")[0]
      .classList.remove("overflow-y-hidden")
    document.getElementsByTagName("body")[0].classList.add("overflow-y-auto")
    document.getElementById("editModal").classList.replace("flex", "hidden")
    setModalItem("")
  }
  function checkTitle(value) {
    setItemTitle(value)
    detectDisabled()

    if (!value) {
      document
        .getElementById("titleCheckAlert")
        .classList.replace("hidden", "inline")
    } else {
      document
        .getElementById("titleCheckAlert")
        .classList.replace("inline", "hidden")
    }
  }
  function checkBody(value) {
    setItemBody(value)
    detectDisabled()

    if (value.length < 30) {
      document
        .getElementById("bodyCheckAlert")
        .classList.replace("hidden", "inline")
    } else {
      document
        .getElementById("bodyCheckAlert")
        .classList.replace("inline", "hidden")
    }
  }
  function detectDisabled() {
    const titleValue = document.getElementById("itemTitleInput").value
    const bodyValue = document.getElementById("itemBodyInput").value
    if (titleValue.length > 0 && bodyValue.length > 30) {
      disabledDetectRef.current = false
      return false
    } else {
      disabledDetectRef.current = true
      return true
    }
  }
  async function sentEditIssue() {
    if (!detectDisabled()) {
      showLoading()

      const editItem = editItemRef.current
      await octokit
        .request("PATCH /repos/{owner}/{repo}/issues/{issue_number}", {
          owner: editItem.repository.owner.login,
          repo: editItem.repository.name,
          issue_number: editItem.number,
          title: itemTitle,
          body: itemBody,
        })
        .then(() => {
          closeModal()
          window.location.reload()
        })
      hiddenLoading()
    }
  }
  return (
    <div
      id="editModal"
      tabIndex="-1"
      aria-hidden="true"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      className="fixed top-0 left-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto h-full justify-center  self-center"
    >
      <div className="relative w-full h-max max-w-2xl bg-white rounded-lg shadow ">
        <div className="flex items-start justify-between p-4 border-b rounded-t ">
          <p
            className="flex self-center text-xl font-semibold text-gray-900 "
            value="test"
          >
            編輯TASK
          </p>

          <div className="flex items-right flex-col">
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              data-modal-hide="defaultModal"
              onClick={closeModal}
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <p className="text-sm text-gray-500 font-mono text-right">
              {/* {dateStringToDate(item.created_at)} */}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center w-11/12 mx-auto">
          <label
            className="w-full text-l font-bold my-2"
            htmlFor="itemTitleInput"
          >
            標題:
            <span id="titleCheckAlert" className="text-red-600 text-sm hidden">
              標題不能為空
            </span>
          </label>
          <input
            id="itemTitleInput"
            type="text"
            className="w-full border p-2 text-l text-gray-900 bg-gray-50  border-gray-300 rounded-md drop-shadow-sm focus:border-red-600"
            value={itemTitle}
            onChange={(e) => checkTitle(e.target.value)}
          />

          <label
            className="w-full text-l font-bold my-2"
            htmlFor="itemBodyInput"
          >
            內文:{" "}
            <span id="bodyCheckAlert" className="text-red-600 text-sm hidden">
              內文需大於30字
            </span>
          </label>
          <textarea
            id="itemBodyInput"
            rows="12"
            className="w-full h-auto border p-2 text-gray-900 bg-gray-50  border-gray-300 rounded-md drop-shadow-sm"
            value={itemBody}
            onChange={(e) => checkBody(e.target.value)}
          />
        </div>
        <div className="flex justify-center">
          <button
            className="my-4 p-2 bg-primary hover:bg-primary-light duration-150 text-white rounded-md disabled:bg-gray-200 disabled:text-gray-400"
            onClick={sentEditIssue}
            disabled={disabledDetectRef.current}
          >
            確認修改
          </button>
        </div>
        {/* <ReactMarkdown
          children={item.body}
          className="m-5 overflow-hidden"
          remarkPlugins={[remarkGfm]}
        ></ReactMarkdown> */}
        {/* <div className="p-6 space-y-6">{item.body}</div> */}
      </div>
    </div>
  )
}

export default EditModal

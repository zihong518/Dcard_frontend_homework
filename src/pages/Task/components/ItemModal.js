import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { dateStringToDate } from "../../../global/function"
const Modal = ({ item, setModalItem }) => {
  // cose the modal
  const closeModal = () => {
    document
      .getElementsByTagName("body")[0]
      .classList.replace("overflow-y-hidden", "overflow-y-auto")
    document.getElementById("itemModal").classList.replace("flex", "hidden")
    setModalItem("")
  }
  return (
    <div
      id="itemModal"
      tabIndex="-1"
      aria-hidden="true"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      className="fixed top-0 left-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto h-full justify-center  self-center"
    >
      <div className="relative w-full h-max max-w-2xl bg-white rounded-lg shadow ">
        <div className="flex items-start justify-between p-4 border-b rounded-t ">
          <a
            href={item.html_url}
            className="flex self-center text-xl font-semibold"
            target={"_blank"}
          >
            {item.title}
          </a>

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
              {dateStringToDate(item.created_at)}
            </p>
          </div>
        </div>
        <ReactMarkdown
          children={item.body}
          className="m-5 overflow-hidden prose"
          remarkPlugins={[remarkGfm]}
        ></ReactMarkdown>
      </div>
    </div>
  )
}

export default Modal

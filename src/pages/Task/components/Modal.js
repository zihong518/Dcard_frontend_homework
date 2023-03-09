import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const Modal = ({ item, setModalItem, changeModelItemRef }) => {
  const closeModal = () => {
    document.getElementById("itemModel").classList.remove("flex")
    document.getElementById("itemModel").classList.add("hidden")
    // changeModelItemRef.current = true
    setModalItem("")
  }
  return (
    <div
      id="itemModel"
      tabIndex="-1"
      aria-hidden="true"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      className="fixed top-0 left-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto h-full justify-center items-center"
    >
      <div className="relative w-full h-auto max-h-3/4 max-w-2xl bg-white rounded-lg shadow ">
        <div className="flex items-start justify-between p-4 border-b rounded-t ">
          <h3 className="text-xl font-semibold text-gray-900 ">{item.title}</h3>
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
        </div>
        <ReactMarkdown
          children={item.body}
          className="m-5"
          remarkPlugins={[remarkGfm]}
        ></ReactMarkdown>
        {/* <div className="p-6 space-y-6">{item.body}</div> */}
      </div>
    </div>
  )
}

export default Modal

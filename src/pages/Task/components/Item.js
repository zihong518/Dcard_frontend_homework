import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { dateStringToDate } from "../../../global/function"
import { ReactComponent as TrashIcon } from "../../../components/image/trash.svg"
import { ReactComponent as EditIcon } from "../../../components/image/edit.svg"

const Item = ({
  item,
  setModalItem,
  changeModalItemRef,
  deleteItemRef,
  editItemRef,
  showType,
}) => {
  // according the status to return different bg color
  function getStatusBackground(status) {
    if (status === "Open") {
      return "bg-green-100"
    } else if (status === "In Progress") {
      return "bg-yellow-100"
    } else if (status === "Done") {
      return "bg-red-100"
    } else {
      return "bg-blue-100"
    }
  }
  function setModal() {
    changeModalItemRef.current = true
    setModalItem(item)
  }
  // show the modal and give the ref data
  function editModal() {
    document.getElementsByTagName("body")[0].classList.add("overflow-y-hidden")
    document.getElementById("editModal").classList.replace("hidden", "flex")
    setModalItem(item)
    editItemRef.current = item
  }
  // show the modal and give the ref data
  function deleteModal() {
    document.getElementsByTagName("body")[0].classList.add("overflow-y-hidden")
    document.getElementById("alertModal").classList.replace("hidden", "flex")
    deleteItemRef.current = item
  }

  return (
    <div
      className="py-5 px-10 bg-white shadow-gray-300 shadow rounded my-3 hover:shadow-xl duration-100 cursor-pointer"
      onClick={() => setModal()}
    >
      <div className=" border-b-2 pb-3 ">
        <div className="flex justify-between">
          <div>
            {item.labels.map((label) => (
              <span
                key={label.node_id}
                className={`rounded-md px-2 mx-1 py-1 text- ${getStatusBackground(
                  label.name
                )}`}
              >
                {label.name}
              </span>
            ))}
          </div>
          {showType.current === "assigned" && (
            <div className="flex">
              <div className="hover:bg-gray-100 cursor-pointer duration-200 p-1 rounded-md">
                <EditIcon
                  onClick={(e) => {
                    e.stopPropagation()
                    editModal()
                  }}
                />
              </div>
              <div className="hover:bg-gray-100 cursor-pointer duration-200 p-1 rounded-md">
                <TrashIcon
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteModal()
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <p className="text-3xl mt-2 font-bold">{item.title}</p>
        <p className="text-sm text-gray-500 font-mono text-right">
          {dateStringToDate(item.created_at)}
        </p>
      </div>
      {/* issueBody transfer to markdown */}
      <ReactMarkdown
        children={item.body}
        className="mt-5 max-h-40 overflow-y-hidden prose"
        remarkPlugins={[remarkGfm]}
      ></ReactMarkdown>
    </div>
  )
}

export default Item

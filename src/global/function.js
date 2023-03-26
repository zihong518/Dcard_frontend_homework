// transfer data string to date
export const dateStringToDate = (dateString) => {
  const timestamp = Date.parse(dateString)
  const dateFormat = new Date(timestamp)
  const addZero = (time) => {
    if (time < 10) {
      return "0" + time
    } else return time
  }
  const date =
    dateFormat.getFullYear() +
    "/" +
    addZero(dateFormat.getMonth() + 1) +
    "/" +
    addZero(dateFormat.getDate()) +
    " " +
    addZero(dateFormat.getHours()) +
    ":" +
    addZero(dateFormat.getMinutes()) +
    ":" +
    addZero(dateFormat.getSeconds())
  return date
}

// show and hide the all page loading
export const showLoading = () => {
  document.getElementsByTagName("body")[0].classList.add("overflow-y-hidden")
  document.getElementById("loading").classList.replace("hidden", "flex")
}
export const hiddenLoading = () => {
  document.getElementsByTagName("body")[0].classList.remove("overflow-y-hidden")
  document.getElementById("loading").classList.replace("flex", "hidden")
}

// show and hide the block  loading
export const showContentLoading = () => {
  document.getElementById("contentLoading").classList.replace("hidden", "flex")
}

export const hiddenContentLoading = () => {
  document.getElementById("contentLoading").classList.replace("flex", "hidden")
}

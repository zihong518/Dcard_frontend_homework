const Loading = () => {
  return (
    <div
      id="loading"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      className="fixed top-0 left-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto h-full justify-center self-center items-center"
    >
      <div className="animate-bounce flex justify-center flex-col self-center">
        <img
          className="w-10 mx-auto"
          src="https://upload.wikimedia.org/wikipedia/commons/f/f8/Dcard_Favicon_x520.png"
          alt=""
        />
        <p className="mt-1 font-mono">Loading...</p>
      </div>
    </div>
  )
}

export default Loading

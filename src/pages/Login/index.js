const Login = () => {
  return (
    <div className="app">
      <section className="bg-gray-50 ">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <img
            className="w-20 h-20 mr-2 mb-5"
            src="https://upload.wikimedia.org/wikipedia/commons/f/f8/Dcard_Favicon_x520.png"
            alt="logo"
          />
          <p className="text-xl font-bold mb-3">
            Github Task Management platform
          </p>
          <div className=" bg-white rounded-lg shadow max-w-md   border-primary-dark border-2">
            <div className="p-3 space-y-4 md:space-y-6 sm:p-8">
              <a href="https://github.com/login/oauth/authorize?client_id=51ba10e209fbb487b054&scope=repo">
                <img
                  className="w-4/12 mx-auto rounded-full  p-4 hover:bg-gray-50 hover:shadow-lg border border-gray-500  hover:shadow-gray-500 cursor-pointer duration-200"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Font_Awesome_5_brands_github.svg/1280px-Font_Awesome_5_brands_github.svg.png"
                  alt=""
                />
              </a>
              <p className="text-xl font-bold leading-tight tracking-tight text-gray-900  text-center ">
                Connect to your github
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
export default Login

import { FaTrainSubway } from "react-icons/fa6";

function Login() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <div className="flex justify-center mb-6">
          <FaTrainSubway className="text-5xl text-blue-600" />
        </div>

        <h1 className="text-3xl font-bold text-center">
          MetroFlow
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          AI Metro Crowd Management
        </p>

        <form>

          <div className="mb-4">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter Email"
              className="w-full border rounded-lg p-3 mt-2"
            />
          </div>

          <div className="mb-6">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter Password"
              className="w-full border rounded-lg p-3 mt-2"
            />
          </div>

          <button
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;
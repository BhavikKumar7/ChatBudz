import { useState } from 'react';
import { Webhook } from 'lucide-react';
import { Link } from 'react-router';
import useSignup from '../hooks/useSignup';

const SignupPage = () => {

  const [SignupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signupMutation, isPending, error } = useSignup();

  const handleSignup = (e) => {
    e.preventDefault()
    signupMutation(SignupData);
  };

  return (

    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="night">
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* left-part */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* logo */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <Webhook className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              ChatBudZ
            </span>
          </div>

          {/* error msg if any */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response.data.msg}</span>
            </div>
          )}

          {/* form */}
          <div className="w-full">
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Create an Account</h2>
                  <p className="text-sm opacity-70">
                    Connect. Chat. Grow your circle with ChatBudZ.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="Label-text">Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Bhavik Kumar Rajput"
                      className="input input-bordered w-full"
                      value={SignupData.fullName}
                      onChange={(e) => setSignupData({ ...SignupData, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="Label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="bhavikrajputrr2004@gmail.com"
                      className="input input-bordered w-full"
                      value={SignupData.email}
                      onChange={(e) => setSignupData({ ...SignupData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="Label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="**************"
                      className="input input-bordered w-full"
                      value={SignupData.password}
                      onChange={(e) => setSignupData({ ...SignupData, password: e.target.value })}
                      required
                    />
                    <p className="text-xs opacity-70 mt-1">
                      Password must be at least 6 characters
                    </p>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input type="checkbox" className="checkbox checkbox-sm" required />
                      <span className="text-xs leading-tight">
                        I agree to the{" "}
                        <span className="text-primary hover:underline">terms of service</span> and {" "}
                        <span className="text-primary hover:underline">privacy policy</span>
                      </span>
                    </label>
                  </div>
                </div>

                <button className="btn btn-primary w-full" type="submit">
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Loading...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

                <div className="text-center mt-4">
                  <p className="text-sm">
                    Already Have an Account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>

              </div>
            </form>
          </div>

        </div>

        {/* right-part */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/i.png" alt="Chat App connection illustration" className="w-full h-full" />
            </div>
            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Chat with Anyone, Anywhere</h2>
              <p className="opacity-70">
                Build real connections, spark conversations, and stay close—no matter the distance.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>

  )
}

export default SignupPage;
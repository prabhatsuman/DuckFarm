import Signup from "../components/Signup";

const SignupPage = () => {
  return (
    <div className="h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Signup />
      </div>
    </div>
  );
};

export default SignupPage;

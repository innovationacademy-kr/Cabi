import RegisterForm from "../components/RegisterForm";

const RegisterPage = () => {
    return <div className="flex items-start  justify-center bg-neutral-100 dark:bg-neutral-800 transition-colors overflow-y-auto max-h-screen ">
      {/* <div className=" w-full h-full px-10 bg-red-100"> */}
        <RegisterForm/>
      {/* </div> */}
    </div>;
  };

export default RegisterPage;

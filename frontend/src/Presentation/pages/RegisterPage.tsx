import ContactForm from "../components/RegisterForm";

const RegisterPage = () => {
    return <div className="flex justify-center items-center bg-neutral-100 dark:bg-neutral-800 transition-colors">
      <div className=" w-full px-10">
        <ContactForm/>
      </div>
    </div>;
  };

export default RegisterPage;

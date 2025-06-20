import RegisterForm from "../components/RegisterForm";
import banner from '../assets/test.png'
import { RegisterType } from "../types/enum/presentation.type.enum";
import { useParams } from "react-router-dom";

const RegisterPage = () => {
  const { presentationId } = useParams();
  console.log(presentationId);

  const isEditMode = !!presentationId;

  console.log("mode edit : ", isEditMode)
  return (
      <div className="w-full h-screen flex flex-col justify-start items-center bg-neutral-100 overflow-y-auto">
          <div className="flex flex-col items-center justify-center bg-blue-500 w-full h-64 flex-shrink-0">
            <h1 className="font-bold text-4xl text-white">당신의 지식이 누군가의 영감이 됩니다</h1>
            <p className="font-bold text-xl text-white">모든 지식이 소중합니다. 부담 없이 시작해보세요</p>
            {/* <img src={banner} alt="신청페이지 배너"/> */}
          </div>
          <div className="flex-1 w-full flex justify-center">
              <RegisterForm
              type={isEditMode ? RegisterType.EDIT : RegisterType.CREATE}
              presentationId={presentationId}
              />
          </div>
      </div>
  );
};

export default RegisterPage;

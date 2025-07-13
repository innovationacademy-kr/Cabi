import React from "react";
import { ReactComponent as AboutUsMent } from "@/Presentation/assets/images/aboutUs.svg";
import { ReactComponent as IntroduceMent } from "@/Presentation/assets/images/introduce.svg";

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-20">
      <div className="max-w-4xl mx-auto p-8 space-y-12">
        <div className="text-gray-800 text-left space-y-6 text-lg leading-relaxed">
          <h1 className="text-3xl font-light mb-10">
            <span className="bg-gradient-to-r font-medium from-gray-800 to-gray-600 bg-clip-text text-transparent">
              <AboutUsMent />
              {/* 우리는 늘 고민해 왔습니다 */}
            </span>
          </h1>
          <p className="text-base mt-20">
            매주 수요일마다 42서울에서 오가는 깊이 있는 개발 이야기들, 그 소중한
            경험들이 단순한 발표로 끝나버리는 건 아쉽다고 느꼈습니다. 발표가
            끝나면 박수와 함께 사라지기보다는, 누구나 다시 찾아보고 나눌 수 있는
            공간이 필요하다고 생각했죠.
          </p>
          <p className="text-base">
            그래서 이번 리뉴얼은 단순한 '사이트 개편'이 아니라,{" "}
            <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent font-semibold">
              기억에 남기고, 함께 성장하는 플랫폼
            </span>
            으로의 진화입니다.
          </p>
          <p className="text-base">
            먼저, 이제는 모든 발표가 자동으로{" "}
            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent font-semibold">
              기록
            </span>
            되어 남습니다. 발표 내용을 다시 확인하고, 놓친 이야기를 되짚을 수
            있죠.
          </p>
          <p className="text-base">
            또한 발표는 더 이상 특정한 사람들만의 것이 아닙니다. 누구나 주제를
            제안하고,{" "}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent font-semibold">
              유동적으로 신청
            </span>
            하며 발표자가 될 수 있어요.
          </p>
          <p className="text-base">
            그리고 무엇보다 중요한 변화는, 여기는 이제 단순한 발표 공간을 넘어,
            서로 질문하고 소통할 수 있는{" "}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-semibold">
              커뮤니티
            </span>
            의 기능이 살아 숨 쉰다는 점입니다. 발표 뒤에도 계속해서 이야기가
            이어지고, 함께 배우며 성장할 수 있도록 설계했습니다.
          </p>
          <p className="text-base">지식은 나눌 때 더 커진다고 하죠.</p>
          <p className="text-base">
            이번 리뉴얼을 통해,{" "}
            <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent font-semibold">
              개인의 경험이 모두의 자산이 되는 선순환
            </span>
            이 시작되기를 바랍니다.
          </p>
        </div>

        <div className="text-gray-800  text-base leading-relaxed px-2 text-left">
          그리고 이 공간이, 더 멀리, 더 함께 나아가는 우리 모두의 도약판이
          되기를 바랍니다.
        </div>

        <div className="relative my-20">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-gradient-to-r from-slate-50 to-white px-6">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <div className="flex items-center mb-12 justify-center">
            <h2 className="text-2xl font-light text-gray-800 text-center w-full">
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 font-medium bg-clip-text text-transparent">
                <IntroduceMent />
                {/* 수요지식회의 주요 기능을 소개합니다 */}
              </span>
            </h2>
          </div>

          <div className="space-y-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-left">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                간편한 발표 신청 및 관리
              </h3>
              <p className="text-gray-600 leading-relaxed">
                누구나 쉽게 지식 공유의 주인공이 될 수 있습니다. 표준화된 신청
                시스템을 통해 몇 번의 클릭만으로 자신의 지식과 경험을 발표로
                제안할 수 있습니다. 복잡한 절차 없이 오직 발표 내용에만 집중할
                수 있는 환경을 제공합니다.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-left">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                지식 아카이브: 영상 다시보기 (VOD)
              </h3>
              <p className="text-gray-600 leading-relaxed">
                한 번의 발표가 영원한 자산이 됩니다. 발표는 영상으로 기록되어
                우리만의 지식 아카이브에 차곡차곡 쌓입니다. 놓쳤던 발표를
                언제든지 다시 보거나, 중요한 내용을 반복 학습하며 시공간의 제약
                없이 깊이 있는 지식을 내 것으로 만드세요.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-left">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                소통으로 완성되는 지식
              </h3>
              <p className="text-gray-600 leading-relaxed">
                지식은 나눌수록 빛나고, 소통할수록 깊어집니다. 발표에 대한
                생각이나 질문을 댓글로 남기고, 유용했다면 '좋아요'로 발표자에게
                응원을 보내주세요. 단순한 정보 전달을 넘어 활발한 피드백과
                토론을 통해 함께 배우고 성장하는 커뮤니티를 만들어갑니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;

import React from "react";

const CommunityRulesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12">
      <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          커뮤니티 이용 규칙
        </h1>
        <p className="text-gray-700 leading-relaxed mb-6">
          저희 커뮤니티를 이용해 주시는 모든 분들께 감사드립니다. 모두가 즐겁고
          유익한 시간을 보낼 수 있도록, 아래의 간단한 규칙을 지켜주시기
          바랍니다.
        </p>
        <div className="space-y-6 text-gray-700">
          {/* Rule 1 */}
          <div>
            <h2 className="text-xl font-medium text-gray-800 mb-2">
              1. 서로 존중해 주세요.
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>욕설, 비방, 인신공격, 차별적인 발언 등 금지</li>
              <li>특정 개인이나 집단에 대한 혐오 발언은 엄격 제재</li>
            </ul>
          </div>
          {/* Rule 2 */}
          <div>
            <h2 className="text-xl font-medium text-gray-800 mb-2">
              2. 깨끗한 환경을 함께 만들어요.
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>과도한 도배, 스팸, 광고성 게시물 및 댓글 금지</li>
              <li>음란물, 불법 사행성 정보 등 법령 위배 콘텐츠 금지</li>
            </ul>
          </div>
          {/* Rule 3 */}
          <div>
            <h2 className="text-xl font-medium text-gray-800 mb-2">
              3. 개인정보를 보호해 주세요.
            </h2>
            <p className="pl-4">
              본인 또는 타인의 동의 없이 개인정보(이름, 연락처, 주소 등) 유출
              금지
            </p>
          </div>
          {/* Rule 4 */}
          <div>
            <h2 className="text-xl font-medium text-gray-800 mb-2">
              4. 저작권을 존중해 주세요.
            </h2>
            <p className="pl-4">
              뉴스 기사, 타인의 창작물 등을 공유할 때는 반드시 출처 명확히 표기
            </p>
          </div>
        </div>

        {/* Enforcement */}
        <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600 space-y-3">
          <h3 className="font-semibold text-gray-800">
            ※ 운영 원칙 및 제재 안내
          </h3>
          <p>
            운영자는 본 이용 규칙에 위배되는 게시물이나 댓글을 사전 통보 없이
            삭제하거나 수정할 수 있습니다.
          </p>
          <p>
            규칙 위반이 반복되거나 정도가 심한 경우, 서비스 이용이 제한(활동
            정지, 접근 차단 등)될 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommunityRulesPage;

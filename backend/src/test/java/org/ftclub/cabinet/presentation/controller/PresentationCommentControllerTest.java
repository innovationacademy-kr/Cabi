package org.ftclub.cabinet.presentation.controller;

import static org.mockito.BDDMockito.given;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.post;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.preprocessRequest;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.preprocessResponse;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.prettyPrint;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import org.ftclub.cabinet.alarm.discord.DiscordWebHookMessenger;
import org.ftclub.cabinet.dto.PresentationCommentServiceCreationDto;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.ftclub.cabinet.jwt.service.JwtService;
import org.ftclub.cabinet.security.exception.SecurityExceptionHandlerManager;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import org.ftclub.cabinet.dto.PresentationCommentRequestDto;
import org.ftclub.cabinet.dto.PresentationCommentResponseDto;
import org.ftclub.cabinet.presentation.service.PresentationCommentService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(PresentationCommentController.class)
@AutoConfigureRestDocs(uriScheme = "https", uriHost = "api.cabi.42seoul.io") // Adjust host/port
public class PresentationCommentControllerTest {
    @Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@MockBean
	private PresentationCommentService presentationCommentService;

	@MockBean
	private UserInfoDto userInfoDto;

	@MockBean // TODO: 왜 필요하지?
	private DiscordWebHookMessenger discordWebHookMessenger;

	@MockBean
	private JwtService jwtService;

	@MockBean
	private SecurityExceptionHandlerManager securityExceptionHandlerManager;

	@MockBean
	private JpaMetamodelMappingContext jpaMappingContext;

	@DisplayName("프레젠테이션 댓글 정상 등록 테스트")
	@Test
	void createPresentationComment() throws Exception {
		// given
		Long userId = 1L;
		String userName = "testUser";
		Long presentationId = 42L;
		String commentDetail = "댓글 내용";
		Long commentId = 27L;
		LocalDateTime createdAt = LocalDateTime.of(2025, 1, 5, 15, 30, 29);

		PresentationCommentRequestDto requestDto = new PresentationCommentRequestDto(commentDetail);
		PresentationCommentResponseDto mockResponseDto = new PresentationCommentResponseDto(
			commentId,
			userName,
			commentDetail,
			createdAt,
			true,
			false,
			false
		);
		PresentationCommentServiceCreationDto presentationCommentServiceCreationDto = new PresentationCommentServiceCreationDto(
			userId,
			presentationId,
			commentDetail
		);

		given(userInfoDto.getUserId()).willReturn(userId);

		given(presentationCommentService.createPresentationComment(
			presentationCommentServiceCreationDto
		)).willReturn(mockResponseDto);

		// --- Authentication 객체 생성 ---
		// 1. 권한 설정
		List<GrantedAuthority> authorities = AuthorityUtils.createAuthorityList("ROLE_USER");
		// 2. Authentication 객체 생성 (첫 번째 인자가 principal)
		Authentication mockAuthentication = new UsernamePasswordAuthenticationToken(
				userInfoDto, // Principal로 userInfoDto Mock 객체를 전달
				null, // 테스트에서는 비밀번호(credentials)가 중요하지 않으면 null 사용 가능
				authorities // 권한 설정
		);

		// when & then
		mockMvc.perform(
						post("/v6/presentations/{presentationId}/comments", presentationId)
								.contentType(MediaType.APPLICATION_JSON)
								.accept(MediaType.APPLICATION_JSON)
								.content(objectMapper.writeValueAsString(requestDto))
								.with(authentication(mockAuthentication))
								.with(csrf())
								// TODO: JWT Authentication 추가 해야 함
				)
				.andDo(print())
				.andExpect(status().isOk())
				.andDo(document("create-presentation-comment", // Identifier for the generated snippets
						preprocessRequest(prettyPrint()),   // Format request JSON
						preprocessResponse(prettyPrint())  // Format response JSON
				));
	}
}

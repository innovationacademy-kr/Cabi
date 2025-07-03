package org.ftclub.cabinet.presentation.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.get;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.post;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.patch;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.delete;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.preprocessRequest;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.preprocessResponse;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.prettyPrint;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.List;
import org.ftclub.cabinet.alarm.discord.DiscordWebHookMessenger;
import org.ftclub.cabinet.auth.service.AuthPolicyService;
import org.ftclub.cabinet.presentation.dto.PresentationCommentServiceCreationDto;
import org.ftclub.cabinet.presentation.dto.PresentationCommentServiceUpdateDto;
import org.ftclub.cabinet.presentation.dto.PresentationCommentServiceDeleteDto;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.ftclub.cabinet.jwt.service.JwtService;
import org.ftclub.cabinet.security.exception.SecurityExceptionHandlerManager;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import org.ftclub.cabinet.presentation.dto.PresentationCommentRequestDto;
import org.ftclub.cabinet.presentation.dto.PresentationCommentResponseDto;
import org.ftclub.cabinet.presentation.service.PresentationCommentService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
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

@WebMvcTest(
		controllers = PresentationCommentController.class,
		properties = {"cabinet.local=true"}
)
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

	@MockBean
	private DiscordWebHookMessenger discordWebHookMessenger;

	@MockBean
	private JwtService jwtService;

	@MockBean
	private SecurityExceptionHandlerManager securityExceptionHandlerManager;

	@MockBean
	private JpaMetamodelMappingContext jpaMappingContext;

	@MockBean
	private AuthPolicyService authPolicyService;

	// Helper method to create mock authentication
	private Authentication createMockAuthentication(Long userId) {
		given(userInfoDto.getUserId()).willReturn(
				userId); // Make sure UserInfoDto mock returns the ID
		List<GrantedAuthority> authorities = AuthorityUtils.createAuthorityList("ROLE_USER");
		// Use the UserInfoDto mock as the principal
		return new UsernamePasswordAuthenticationToken(userInfoDto, null, authorities);
	}

	@DisplayName("프레젠테이션 댓글 생성 성공 테스트")
	@Test
	void createPresentationComment_성공() throws Exception {
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
				)
				.andExpect(status().isOk())
				.andDo(document("create-presentation-comment",
						// Identifier for the generated snippets
						preprocessRequest(prettyPrint()),   // Format request JSON
						preprocessResponse(prettyPrint())  // Format response JSON
				));
	}

	@DisplayName("특정 프레젠테이션 댓글 목록 조회 성공 테스트")
	@Test
	void listPresentationComments_성공() throws Exception {
		// given
		Long presentationId = 42L;
		Long userId = 1L; // Logged-in user

		LocalDateTime time1 = LocalDateTime.of(2025, 3, 9, 15, 30, 0);
		LocalDateTime time2 = LocalDateTime.of(2025, 3, 9, 15, 35, 0);

		PresentationCommentResponseDto comment1 = new PresentationCommentResponseDto(
				27L, "sokwon", "잘 봤어용 :)", time1, true, false, false // is_mine = true
		);
		PresentationCommentResponseDto comment2 = new PresentationCommentResponseDto(
				28L, "jnam", "발표 좋네요!", time2, false, false, false // is_mine = false
		);
		List<PresentationCommentResponseDto> commentList = Arrays.asList(comment1, comment2);

		given(presentationCommentService.getCommentsByPresentationId(eq(userId),
				eq(presentationId)))
				.willReturn(commentList);

		Authentication mockAuthentication = createMockAuthentication(userId);

		// when & then
		mockMvc.perform(
						get("/v6/presentations/{presentationId}/comments", presentationId)
								.accept(MediaType.APPLICATION_JSON)
								.with(authentication(mockAuthentication))
								.with(csrf())
						// CSRF might not be needed for GET, but include for consistency if configured
				)
				.andExpect(status().isOk())
				.andDo(document("presentation/comment/get-presentation-comments",
						preprocessRequest(prettyPrint()),
						preprocessResponse(prettyPrint())
				));

		// Verify service method was called
		verify(presentationCommentService).getCommentsByPresentationId(eq(userId),
				eq(presentationId)
		);
	}

	@DisplayName("프레젠테이션 댓글 수정 성공 테스트")
	@Test
	void updatePresentationComment_성공() throws Exception {
		// given
		Long userId = 1L; // User performing the update
		Long presentationId = 42L;
		Long commentId = 27L; // Comment being updated
		String updatedDetail = "업데이트된 댓글 내용입니다.";
		String userName = "sokwon";
		LocalDateTime updatedTime = LocalDateTime.of(2025, 3, 10, 10, 0, 0);

		PresentationCommentRequestDto requestDto = new PresentationCommentRequestDto(
				updatedDetail);

		PresentationCommentServiceUpdateDto presentationCommentServiceUpdateDto = new PresentationCommentServiceUpdateDto(
				userId,
				presentationId,
				commentId,
				updatedDetail
		);

		PresentationCommentResponseDto mockResponseDto = new PresentationCommentResponseDto(
				commentId, userName, updatedDetail, updatedTime, true, false, true
		);

		// Mock the service method for updating
		given(presentationCommentService.updatePresentationComment(
				presentationCommentServiceUpdateDto))
				.willReturn(mockResponseDto);

		Authentication mockAuthentication = createMockAuthentication(userId);

		// when & then
		mockMvc.perform(
						patch("/v6/presentations/{presentationId}/comments/{commentId}", presentationId,
								commentId)
								.contentType(MediaType.APPLICATION_JSON)
								.accept(MediaType.APPLICATION_JSON)
								.content(objectMapper.writeValueAsString(requestDto))
								.with(authentication(mockAuthentication))
								.with(csrf())
				)
				.andExpect(status().isOk())
				.andDo(document("presentation/comment/update-presentation-comment",
						preprocessRequest(prettyPrint()),
						preprocessResponse(prettyPrint())
				));

		// Verify service method was called
		verify(presentationCommentService).updatePresentationComment(
				presentationCommentServiceUpdateDto);
	}

	@DisplayName("프레젠테이션 댓글 삭제 성공 테스트")
	@Test
	void deletePresentationComment_성공() throws Exception {
		// given
		Long userId = 1L;
		Long presentationId = 42L;
		Long commentId = 27L;

		PresentationCommentServiceDeleteDto presentationCommentServiceDeleteDto = new PresentationCommentServiceDeleteDto(
				userId,
				presentationId,
				commentId
		);

		Authentication mockAuthentication = createMockAuthentication(userId);

		// when & then
		mockMvc.perform(
						delete("/v6/presentations/{presentationId}/comments/{commentId}", presentationId,
								commentId)
								.with(authentication(mockAuthentication))
								.with(csrf())
				)
				.andExpect(status().isOk())
				.andDo(document("presentation/comment/delete-presentation-comment",
						preprocessRequest(prettyPrint()),
						preprocessResponse(prettyPrint())
				));

		// Verify service method was called with correct parameters constructed by the controller
		ArgumentCaptor<PresentationCommentServiceDeleteDto> captor = ArgumentCaptor.forClass(
				PresentationCommentServiceDeleteDto.class);
		verify(presentationCommentService).deletePresentationComment(captor.capture());

		PresentationCommentServiceDeleteDto capturedDto = captor.getValue();
		assertEquals(userId, capturedDto.getUserId());
		assertEquals(presentationId, capturedDto.getPresentationId());
		assertEquals(commentId, capturedDto.getCommentId());
	}
}

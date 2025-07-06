package org.ftclub.cabinet.admin.presentation.controller;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.preprocessRequest;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.preprocessResponse;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.prettyPrint;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import org.ftclub.cabinet.admin.dto.AdminPresentationCommentBanRequestDto;
import org.ftclub.cabinet.admin.dto.AdminPresentationCommentBanResponseDto;
import org.ftclub.cabinet.admin.presentation.service.AdminPresentationCommentService;
import org.ftclub.cabinet.alarm.discord.DiscordWebHookMessenger;
import org.ftclub.cabinet.auth.service.AuthPolicyService;
import org.ftclub.cabinet.dto.UserInfoDto;
import org.ftclub.cabinet.jwt.service.JwtService;
import org.ftclub.cabinet.presentation.dto.PresentationCommentResponseDto;
import org.ftclub.cabinet.security.exception.SecurityExceptionHandlerManager;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = AdminPresentationCommentController.class)
@AutoConfigureRestDocs(uriScheme = "https", uriHost = "api.cabi.42seoul.io")
@MockBean(JpaMetamodelMappingContext.class)
class AdminPresentationCommentControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@MockBean
	private AdminPresentationCommentService adminPresentationCommentService;

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

	@Test
	@DisplayName("특정 발표의 모든 댓글 목록 조회 성공 테스트")
	@WithMockUser(roles = "ADMIN")
	void getPresentationComments_성공() throws Exception {
		// Given
		Long presentationId = 42L;
		LocalDateTime now = LocalDateTime.now();
		List<PresentationCommentResponseDto> comments = Collections.singletonList(
				new PresentationCommentResponseDto(1L, "user1", "Comment 1", now, false, false,
						false)
		);
		given(adminPresentationCommentService.getComments(presentationId)).willReturn(comments);

		// When & Then
		mockMvc.perform(get("/v6/admin/presentations/{presentationId}/comments", presentationId)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.data.length()").value(1))
				.andExpect(jsonPath("$.data[0].user").value("user1"))
				.andDo(document("admin/presentation/comment/getComments",
						preprocessRequest(prettyPrint()),
						preprocessResponse(prettyPrint())
				));

		verify(adminPresentationCommentService).getComments(presentationId);
	}

	@Test
	@DisplayName("댓글 밴 성공 테스트")
	@WithMockUser(roles = "ADMIN")
	void banOrUnbanPresentationComment_밴_성공() throws Exception {
		// Given
		Long presentationId = 42L;
		Long commentId = 101L;
		AdminPresentationCommentBanRequestDto requestDto = new AdminPresentationCommentBanRequestDto(
				true);
		AdminPresentationCommentBanResponseDto responseDto = new AdminPresentationCommentBanResponseDto(
				"Banned comment", true);

		given(adminPresentationCommentService.banOrUnbanComment(presentationId, commentId, true))
				.willReturn(responseDto);

		// When & Then
		mockMvc.perform(patch("/v6/admin/presentations/{presentationId}/comments/{commentId}",
						presentationId, commentId)
						.with(csrf())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(requestDto)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.data.banned").value(true))
				.andExpect(jsonPath("$.data.detail").value("Banned comment"))
				.andDo(document("admin/presentation/comment/banComment",
						preprocessRequest(prettyPrint()),
						preprocessResponse(prettyPrint())
				));

		verify(adminPresentationCommentService).banOrUnbanComment(presentationId, commentId, true);
	}

	@Test
	@DisplayName("댓글 밴 해제 성공 테스트")
	@WithMockUser(roles = "ADMIN")
	void banOrUnbanPresentationComment_밴_해제_성공() throws Exception {
		// Given
		Long presentationId = 42L;
		Long commentId = 101L;
		AdminPresentationCommentBanRequestDto requestDto = new AdminPresentationCommentBanRequestDto(
				false);
		AdminPresentationCommentBanResponseDto responseDto = new AdminPresentationCommentBanResponseDto(
				"Unbanned comment", false);

		given(adminPresentationCommentService.banOrUnbanComment(presentationId, commentId, false))
				.willReturn(responseDto);

		// When & Then
		mockMvc.perform(patch("/v6/admin/presentations/{presentationId}/comments/{commentId}",
						presentationId, commentId)
						.with(csrf())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(requestDto)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.data.banned").value(false))
				.andExpect(jsonPath("$.data.detail").value("Unbanned comment"))
				.andDo(document("admin/presentation/comment/unbanComment",
						preprocessRequest(prettyPrint()),
						preprocessResponse(prettyPrint())
				));

		verify(adminPresentationCommentService).banOrUnbanComment(presentationId, commentId, false);
	}

	@Test
	@DisplayName("댓글 삭제 성공 테스트")
	@WithMockUser(roles = "ADMIN")
	void deletePresentationComment_성공() throws Exception {
		// Given
		Long presentationId = 42L;
		Long commentId = 101L;

		// When & Then
		mockMvc.perform(delete("/v6/admin/presentations/{presentationId}/comments/{commentId}",
						presentationId, commentId)
						.with(csrf()))
				.andExpect(status().isOk())
				.andDo(document("admin/presentation/comment/deleteComment",
						preprocessRequest(prettyPrint()),
						preprocessResponse(prettyPrint())
				));

		verify(adminPresentationCommentService).deleteComment(presentationId, commentId);
	}
}

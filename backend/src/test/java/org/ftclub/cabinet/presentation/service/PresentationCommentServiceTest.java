package org.ftclub.cabinet.presentation.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import java.time.LocalDateTime;
import org.ftclub.cabinet.dto.PresentationCommentResponseDto;
import org.ftclub.cabinet.dto.PresentationCommentServiceCreationDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.domain.PresentationComment;
import org.ftclub.cabinet.presentation.repository.PresentationCommentRepository;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PresentationCommentServiceTest {

	@InjectMocks
	private PresentationCommentService presentationCommentService;

	@Mock
	private PresentationCommentRepository presentationCommentRepository;

	@Mock
	private UserQueryService userQueryService;

	@Mock
	private PresentationQueryService presentationQueryService;

	@Test
	@DisplayName("프레젠테이션 댓글 생성 성공 테스트")
	void createPresentationComment_성공() {
		// Given
		Long userId = 1L;
		Long presentationId = 10L;
		String commentDetail = "정말 유익한 발표였습니다!";
		Long expectedCommentId = 999L;
		LocalDateTime expectedCreatedAt = LocalDateTime.now();

		// Mock User
		User mockUser = mock(User.class);
		given(mockUser.getId()).willReturn(userId);
		given(mockUser.getName()).willReturn("testUser");
		given(userQueryService.getUser(userId)).willReturn(mockUser);

		// Mock Presentation
		Presentation mockPresentation = mock(Presentation.class);
		given(mockPresentation.getId()).willReturn(presentationId);
		given(presentationQueryService.getPresentation(presentationId)).willReturn(mockPresentation);

		// Mock Repository Save 동작 정의
		given(presentationCommentRepository.save(any(PresentationComment.class)))
				.willAnswer(invocation -> {
					PresentationComment originalComment = invocation.getArgument(0);

					PresentationComment savedCommentMock = mock(PresentationComment.class);

					given(savedCommentMock.getId()).willReturn(expectedCommentId);
					given(savedCommentMock.getUser()).willReturn(originalComment.getUser());
					given(savedCommentMock.getDetail()).willReturn(originalComment.getDetail());
					given(savedCommentMock.getCreatedAt()).willReturn(expectedCreatedAt);

					return savedCommentMock;
				});

		PresentationCommentServiceCreationDto dto =
				new PresentationCommentServiceCreationDto(userId, presentationId, commentDetail);

		// When
		PresentationCommentResponseDto responseDto = presentationCommentService.createPresentationComment(
				dto);

		// Then
		// Response DTO 검증
		assertNotNull(responseDto);
		assertEquals(expectedCommentId, responseDto.getId());
		assertEquals(mockUser.getName(), responseDto.getUser());
		assertEquals(commentDetail, responseDto.getDetail());
		assertEquals(expectedCreatedAt, responseDto.getDateTime());
		assertTrue(responseDto.isMine());
		assertFalse(responseDto.isBanned());
		assertFalse(responseDto.isUpdated());

		// Repository.save() 호출 검증
		ArgumentCaptor<PresentationComment> commentCaptor = ArgumentCaptor.forClass(
				PresentationComment.class);
		verify(presentationCommentRepository).save(commentCaptor.capture());
		PresentationComment capturedComment = commentCaptor.getValue();

		assertNotNull(capturedComment);
		assertEquals(commentDetail, capturedComment.getDetail());
		assertNotNull(capturedComment.getUser());
		assertEquals(userId, capturedComment.getUser().getId());
		assertNotNull(capturedComment.getPresentation());
		assertEquals(presentationId, capturedComment.getPresentation().getId());
		assertThat(capturedComment.isDeleted()).isFalse();
		assertThat(capturedComment.isBanned()).isFalse();
	}

	@Test
	@DisplayName("프레젠테이션 댓글 생성 실패 - 댓글 내용 길이 초과")
	void createPresentationComment_실패_댓글_내용_길이_초과() {
		// Given
		Long userId = 1L;
		Long presentationId = 10L;
		String longComment = "a".repeat(501); // 501 characters

		PresentationCommentServiceCreationDto dto =
				new PresentationCommentServiceCreationDto(userId, presentationId, longComment);

		// When & Then
		ServiceException exception = assertThrows(ServiceException.class, () -> {
			presentationCommentService.createPresentationComment(dto);
		});
		assertEquals(ExceptionStatus.PRESENTATION_COMMENT_TOO_LONG, exception.getStatus());
	}

	@Test
	@DisplayName("프레젠테이션 댓글 생성 실패 - 댓글 내용 비어있음")
	void createPresentationComment_실패_댓글_내용_비어있음() {
		// Given
		Long userId = 1L;
		Long presentationId = 10L;
		String emptyComment = "   "; // Blank comment


		PresentationCommentServiceCreationDto dto =
				new PresentationCommentServiceCreationDto(userId, presentationId, emptyComment);

		// When & Then
		ServiceException exception = assertThrows(ServiceException.class, () -> {
			presentationCommentService.createPresentationComment(dto);
		});
		assertEquals(ExceptionStatus.PRESENTATION_COMMENT_EMPTY, exception.getStatus());
	}

	@Test
	@DisplayName("프레젠테이션 댓글 생성 실패 - 존재하지 않는 발표")
	void createPresentationComment_실패_존재하지_않는_발표() {
		// Given
		Long userId = 1L;
		Long nonExistentPresentationId = 999L;
		String commentDetail = "Comment on non-existent presentation";

		// Configure PresentationQueryService to throw exception
		given(presentationQueryService.getPresentation(nonExistentPresentationId))
				.willThrow(ExceptionStatus.NOT_FOUND_PRESENTATION.asServiceException());

		PresentationCommentServiceCreationDto dto =
				new PresentationCommentServiceCreationDto(userId, nonExistentPresentationId,
						commentDetail);

		// When & Then
		ServiceException exception = assertThrows(ServiceException.class, () -> {
			presentationCommentService.createPresentationComment(dto);
		});
		assertEquals(ExceptionStatus.NOT_FOUND_PRESENTATION, exception.getStatus());
	}

	@Test
	@DisplayName("프레젠테이션 댓글 생성 실패 - 존재하지 않는 사용자")
	void createPresentationComment_실패_존재하지_않는_사용자() {
		// Given
		Long nonExistentUserId = 999L;
		Long presentationId = 10L;
		String commentDetail = "Comment by non-existent user";

		// Configure UserQueryService to throw exception
		given(userQueryService.getUser(nonExistentUserId))
				.willThrow(ExceptionStatus.NOT_FOUND_USER.asServiceException());

		// Mock Presentation
		Presentation mockPresentation = mock(Presentation.class);
		given(presentationQueryService.getPresentation(presentationId)).willReturn(mockPresentation);

		PresentationCommentServiceCreationDto dto =
				new PresentationCommentServiceCreationDto(nonExistentUserId, presentationId,
						commentDetail);

		// When & Then
		ServiceException exception = assertThrows(ServiceException.class, () -> {
			presentationCommentService.createPresentationComment(dto);
		});
		assertEquals(ExceptionStatus.NOT_FOUND_USER, exception.getStatus());
	}
}
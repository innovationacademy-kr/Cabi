package org.ftclub.cabinet.presentation.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.ftclub.cabinet.presentation.dto.PresentationCommentResponseDto;
import org.ftclub.cabinet.presentation.dto.PresentationCommentServiceCreationDto;
import org.ftclub.cabinet.presentation.dto.PresentationCommentServiceDeleteDto;
import org.ftclub.cabinet.presentation.dto.PresentationCommentServiceUpdateDto;
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
		given(presentationQueryService.getPresentation(presentationId)).willReturn(
				mockPresentation);

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
		String longComment = "a".repeat(501);

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
		String emptyComment = "   ";

		PresentationCommentServiceCreationDto dto =
				new PresentationCommentServiceCreationDto(userId, presentationId, emptyComment);

		// When & Then
		ServiceException exception = assertThrows(ServiceException.class, () -> {
			presentationCommentService.createPresentationComment(dto);
		});
		assertEquals(ExceptionStatus.PRESENTATION_COMMENT_EMPTY, exception.getStatus());
	}

	@Test
	@DisplayName("프레젠테이션 댓글 생성 실패 - 댓글 내용 빈 문자열")
	void createPresentationComment_실패_댓글_내용_빈_문자열() {
		// Given
		Long userId = 1L;
		Long presentationId = 10L;
		String emptyComment = ""; // Empty string

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

		given(userQueryService.getUser(nonExistentUserId))
				.willThrow(ExceptionStatus.NOT_FOUND_USER.asServiceException());

		Presentation mockPresentation = mock(Presentation.class);
		given(presentationQueryService.getPresentation(presentationId)).willReturn(
				mockPresentation);

		PresentationCommentServiceCreationDto dto =
				new PresentationCommentServiceCreationDto(nonExistentUserId, presentationId,
						commentDetail);

		// When & Then
		ServiceException exception = assertThrows(ServiceException.class, () -> {
			presentationCommentService.createPresentationComment(dto);
		});
		assertEquals(ExceptionStatus.NOT_FOUND_USER, exception.getStatus());
	}

	@Test
	@DisplayName("특정 발표 댓글 목록 조회 성공 - 여러 댓글")
	void getCommentsByPresentationId_성공_여러_댓글() {
		// Given
		Long requestingUserId = 1L; // 조회 요청하는 사용자 ID
		Long presentationId = 10L;
		Long commentOwnerId = 1L;
		Long anotherUserId = 2L;

		User ownerUser = mock(User.class);
		given(ownerUser.getId()).willReturn(commentOwnerId);
		given(ownerUser.getName()).willReturn("owner");

		User anotherUser = mock(User.class);
		given(anotherUser.getId()).willReturn(anotherUserId);
		given(anotherUser.getName()).willReturn("another");

		LocalDateTime now = LocalDateTime.now();
		PresentationComment comment1 = mock(PresentationComment.class); // 내 댓글, 수정 안됨, 밴 안됨
		given(comment1.getId()).willReturn(101L);
		given(comment1.getUser()).willReturn(ownerUser);
		given(comment1.getDetail()).willReturn("첫 번째 댓글");
		given(comment1.getCreatedAt()).willReturn(now.minusMinutes(10));
		given(comment1.getUpdatedAt()).willReturn(now.minusMinutes(10)); // 수정 안됨
		given(comment1.isBanned()).willReturn(false);

		PresentationComment comment2 = mock(PresentationComment.class); // 다른 사람 댓글, 수정됨, 밴됨
		given(comment2.getId()).willReturn(102L);
		given(comment2.getUser()).willReturn(anotherUser);
		given(comment2.getDetail()).willReturn("두 번째 댓글 (수정됨)");
		given(comment2.getCreatedAt()).willReturn(now.minusMinutes(5));
		given(comment2.getUpdatedAt()).willReturn(now.minusMinutes(1)); // 수정됨
		given(comment2.isBanned()).willReturn(true); // 밴됨

		List<PresentationComment> mockComments = Arrays.asList(comment1, comment2);
		given(presentationCommentRepository.findByPresentationIdOrderByCreatedAtAsc(presentationId))
				.willReturn(mockComments);

		// When
		List<PresentationCommentResponseDto> responseDtos = presentationCommentService.getCommentsByPresentationId(
				requestingUserId, presentationId);

		// Then
		assertNotNull(responseDtos);
		assertEquals(2, responseDtos.size());

		// 첫 번째 댓글 검증 (내 댓글)
		PresentationCommentResponseDto dto1 = responseDtos.get(0);
		assertEquals(comment1.getId(), dto1.getId());
		assertEquals(ownerUser.getName(), dto1.getUser());
		assertEquals(comment1.getDetail(), dto1.getDetail());
		assertEquals(comment1.getCreatedAt(), dto1.getDateTime());
		assertTrue(dto1.isMine()); // 요청한 사용자와 댓글 작성자가 같음
		assertFalse(dto1.isBanned());
		assertFalse(dto1.isUpdated()); // createdAt == updatedAt

		// 두 번째 댓글 검증 (다른 사람 댓글)
		PresentationCommentResponseDto dto2 = responseDtos.get(1);
		assertEquals(comment2.getId(), dto2.getId());
		assertEquals(anotherUser.getName(), dto2.getUser());
		assertEquals(comment2.getDetail(), dto2.getDetail());
		assertEquals(comment2.getCreatedAt(), dto2.getDateTime());
		assertFalse(dto2.isMine()); // 요청한 사용자와 댓글 작성자가 다름
		assertTrue(dto2.isBanned());
		assertTrue(dto2.isUpdated()); // updatedAt > createdAt
	}

	@Test
	@DisplayName("특정 발표 댓글 목록 조회 성공 - 댓글 없음")
	void getCommentsByPresentationId_성공_댓글_없음() {
		// Given
		Long requestingUserId = 1L;
		Long presentationId = 11L;

		given(presentationCommentRepository.findByPresentationIdOrderByCreatedAtAsc(presentationId))
				.willReturn(Collections.emptyList());

		// When
		List<PresentationCommentResponseDto> responseDtos = presentationCommentService.getCommentsByPresentationId(
				requestingUserId, presentationId);

		// Then
		assertNotNull(responseDtos);
		assertTrue(responseDtos.isEmpty());
	}

	@Test
	@DisplayName("특정 발표 댓글 목록 조회 실패 - 존재하지 않는 발표")
	void getCommentsByPresentationId_실패_존재하지_않는_발표() {
		// Given
		Long requestingUserId = 1L;
		Long nonExistentPresentationId = 999L;

		given(presentationQueryService.getPresentation(
				nonExistentPresentationId))
				.willThrow(ExceptionStatus.NOT_FOUND_PRESENTATION.asServiceException());

		// When & Then
		ServiceException exception = assertThrows(ServiceException.class, () -> {
			presentationCommentService.getCommentsByPresentationId(requestingUserId,
					nonExistentPresentationId);
		});
		assertEquals(ExceptionStatus.NOT_FOUND_PRESENTATION, exception.getStatus());
	}

	@Test
	@DisplayName("프레젠테이션 댓글 수정 성공")
	void updatePresentationComment_성공() {
		// Given
		Long userId = 1L; // 수정 요청자 == 댓글 소유자
		Long presentationId = 10L;
		Long commentId = 101L;
		String updatedDetail = "댓글 내용 수정했습니다.";
		LocalDateTime now = LocalDateTime.now();

		User ownerUser = mock(User.class);
		given(ownerUser.getId()).willReturn(userId);
		given(ownerUser.getName()).willReturn("owner");

		Presentation presentation = mock(Presentation.class);
		given(presentation.getId()).willReturn(presentationId);

		// Mock findById to return an existing comment
		PresentationComment existingComment = mock(PresentationComment.class);
		given(existingComment.getId()).willReturn(commentId);
		given(existingComment.getUser()).willReturn(ownerUser);
		given(existingComment.getDetail()).willReturn("원래 댓글 내용");
		given(existingComment.getUpdatedAt()).willReturn(now);
		given(existingComment.isBanned()).willReturn(false);
		given(existingComment.getPresentation()).willReturn(presentation);
		given(presentationCommentRepository.findById(commentId)).willReturn(
				Optional.of(existingComment));

		given(existingComment.getDetail()).willReturn(updatedDetail);

		PresentationCommentServiceUpdateDto dto =
				new PresentationCommentServiceUpdateDto(userId, presentationId, commentId,
						updatedDetail);

		// When
		PresentationCommentResponseDto responseDto = presentationCommentService.updatePresentationComment(
				dto);

		// Then
		assertNotNull(responseDto);
		assertEquals(commentId, responseDto.getId());
		assertEquals(ownerUser.getName(), responseDto.getUser());
		assertEquals(updatedDetail, responseDto.getDetail());
		assertEquals(now, responseDto.getDateTime());
		assertTrue(responseDto.isMine());
		assertFalse(responseDto.isBanned());
		assertTrue(responseDto.isUpdated());

		verify(existingComment).updateDetail(updatedDetail);
	}

	@Test
	@DisplayName("프레젠테이션 댓글 수정 실패 - 댓글 없음")
	void updatePresentationComment_실패_댓글_없음() {
		// Given
		Long userId = 1L;
		Long presentationId = 10L;
		Long nonExistentCommentId = 999L;
		String updatedDetail = "수정 시도";

		given(presentationCommentRepository.findById(nonExistentCommentId)).willReturn(
				Optional.empty());

		PresentationCommentServiceUpdateDto dto =
				new PresentationCommentServiceUpdateDto(userId, presentationId,
						nonExistentCommentId,
						updatedDetail);

		// When & Then
		ServiceException exception = assertThrows(ServiceException.class, () -> {
			presentationCommentService.updatePresentationComment(dto);
		});
		assertEquals(ExceptionStatus.PRESENTATION_COMMENT_NOT_FOUND, exception.getStatus());
	}

	@Test
	@DisplayName("프레젠테이션 댓글 수정 실패 - 권한 없음")
	void updatePresentationComment_실패_권한_없음() {
		// Given
		Long requestingUserId = 1L; // 수정 요청자
		Long presentationId = 10L;
		Long ownerUserId = 2L; // 실제 댓글 소유자
		Long commentId = 102L;
		String updatedDetail = "다른 사람 댓글 수정 시도";

		User ownerUser = mock(User.class);
		given(ownerUser.getId()).willReturn(ownerUserId);

		Presentation presentation = mock(Presentation.class);
		given(presentation.getId()).willReturn(presentationId);

		PresentationComment existingComment = mock(PresentationComment.class);
		given(existingComment.getPresentation()).willReturn(presentation);
		given(existingComment.getUser()).willReturn(ownerUser);
		given(presentationCommentRepository.findById(commentId)).willReturn(
				Optional.of(existingComment));

		PresentationCommentServiceUpdateDto dto =
				new PresentationCommentServiceUpdateDto(requestingUserId, presentationId, commentId,
						updatedDetail);

		// When & Then
		ServiceException exception = assertThrows(ServiceException.class, () -> {
			presentationCommentService.updatePresentationComment(dto);
		});
		assertEquals(ExceptionStatus.PRESENTATION_COMMENT_NOT_AUTHORIZED, exception.getStatus());
	}

	@Test
	@DisplayName("프레젠테이션 댓글 수정 실패 - 새 댓글 내용 길이 초과")
	void updatePresentationComment_실패_새_댓글_내용_길이_초과() {
		// Given
		Long userId = 2L;
		Long presentationId = 10L;
		Long commentId = 102L;
		String longComment = "a".repeat(501);

		User ownerUser = mock(User.class);

		Presentation presentation = mock(Presentation.class);
		given(presentation.getId()).willReturn(presentationId);

		PresentationComment existingComment = mock(PresentationComment.class);
		given(existingComment.getPresentation()).willReturn(presentation);
		given(presentationCommentRepository.findById(commentId)).willReturn(
				Optional.of(existingComment));

		PresentationCommentServiceUpdateDto dto = new PresentationCommentServiceUpdateDto(userId,
				presentationId, commentId, longComment);

		// When & Then
		ServiceException exception = assertThrows(ServiceException.class, () -> {
			presentationCommentService.updatePresentationComment(dto);
		});
		assertEquals(ExceptionStatus.PRESENTATION_COMMENT_TOO_LONG, exception.getStatus());
	}

	@Test
	@DisplayName("프레젠테이션 댓글 수정 실패 - 새 댓글 내용 비어있음")
	void updatePresentationComment_실패_새_댓글_내용_비어있음() {
		// Given
		Long userId = 2L;
		Long presentationId = 10L;
		Long commentId = 102L;
		String blankComment = "   ";

		Presentation presentation = mock(Presentation.class);
		given(presentation.getId()).willReturn(presentationId);
		given(presentationQueryService.getPresentation(presentationId)).willReturn(
				presentation);

		User user = mock(User.class);

		PresentationComment existingComment = mock(PresentationComment.class);
		given(existingComment.getPresentation()).willReturn(presentation);
		given(presentationCommentRepository.findById(commentId)).willReturn(
				Optional.of(existingComment));

		PresentationCommentServiceUpdateDto dto = new PresentationCommentServiceUpdateDto(userId,
				presentationId, commentId, blankComment);

		// When & Then
		ServiceException exception = assertThrows(ServiceException.class, () -> {
			presentationCommentService.updatePresentationComment(dto);
		});
		assertEquals(ExceptionStatus.PRESENTATION_COMMENT_EMPTY, exception.getStatus());
	}

	@Test
	@DisplayName("프레젠테이션 댓글 수정 실패 - 발표 없음")
	void updatePresentationComment_실패_발표_없음() {
		// Given
		Long userId = 1L;
		Long nonExistentPresentationId = 999L; // 존재하지 않는 발표 ID
		Long commentId = 101L;
		String updatedDetail = "수정 시도";

		PresentationComment existingComment = mock(PresentationComment.class); // 댓글은 존재한다고 가정
		given(presentationCommentRepository.findById(commentId)).willReturn(
				Optional.of(existingComment));

		given(presentationQueryService.getPresentation(nonExistentPresentationId))
				.willThrow(ExceptionStatus.NOT_FOUND_PRESENTATION.asServiceException());

		PresentationCommentServiceUpdateDto dto =
				new PresentationCommentServiceUpdateDto(userId, nonExistentPresentationId,
						commentId, updatedDetail);

		// When & Then
		ServiceException exception = assertThrows(ServiceException.class, () -> {
			presentationCommentService.updatePresentationComment(dto);
		});
		assertEquals(ExceptionStatus.NOT_FOUND_PRESENTATION, exception.getStatus());
		verify(presentationCommentRepository).findById(commentId);
		verify(presentationQueryService).getPresentation(nonExistentPresentationId);
		verify(existingComment, never()).updateDetail(anyString()); // 댓글 내용은 업데이트되면 안 됨
	}


	@Test
	@DisplayName("프레젠테이션 댓글 수정 실패 - 댓글과 발표 불일치")
	void updatePresentationComment_실패_댓글_발표_불일치() {
		// Given
		Long userId = 1L;
		Long presentationIdInDto = 10L; // DTO의 발표 ID
		Long actualPresentationId = 20L; // 댓글이 실제 속한 발표 ID (DTO와 다름)
		Long commentId = 101L;
		String updatedDetail = "수정 시도";

		User ownerUser = mock(User.class);

		Presentation presentationInDto = mock(Presentation.class); // DTO ID에 해당하는 발표 Mock
		given(presentationQueryService.getPresentation(presentationIdInDto)).willReturn(
				presentationInDto);

		Presentation actualPresentation = mock(Presentation.class);// 댓글이 실제 속한 발표 Mock
		given(actualPresentation.getId()).willReturn(actualPresentationId);

		PresentationComment existingComment = mock(PresentationComment.class);
		given(existingComment.getPresentation()).willReturn(actualPresentation);

		given(presentationCommentRepository.findById(commentId)).willReturn(
				Optional.of(existingComment));

		PresentationCommentServiceUpdateDto dto =
				new PresentationCommentServiceUpdateDto(userId, presentationIdInDto, commentId,
						updatedDetail);

		// When & Then
		ServiceException exception = assertThrows(ServiceException.class, () -> {
			presentationCommentService.updatePresentationComment(dto);
		});
		// verifyPresentationAndCommentAssociation 내부에서 비교 후 예외 발생 예상
		assertEquals(ExceptionStatus.PRESENTATION_COMMENT_INVALID_ASSOCIATION,
				exception.getStatus());
		verify(presentationCommentRepository).findById(commentId);
		verify(presentationQueryService).getPresentation(presentationIdInDto); // 발표 존재 확인은 통과해야 함
		verify(existingComment, never()).updateDetail(anyString());
	}

	@Test
	@DisplayName("프레젠테이션 댓글 삭제 성공")
	void deletePresentationComment_성공() {
		// Given
		Long userId = 1L;
		Long presentationId = 10L;
		Long commentId = 101L;

		User ownerUser = mock(User.class);
		given(ownerUser.getId()).willReturn(userId);

		Presentation presentation = mock(Presentation.class);
		given(presentation.getId()).willReturn(presentationId);

		PresentationComment existingComment = mock(PresentationComment.class);
		given(existingComment.getPresentation()).willReturn(presentation);
		given(existingComment.getUser()).willReturn(ownerUser);
		given(presentationCommentRepository.findById(commentId)).willReturn(
				Optional.of(existingComment));

		PresentationCommentServiceDeleteDto dto = new PresentationCommentServiceDeleteDto(userId,
				presentationId, commentId);

		// When & Then
		presentationCommentService.deletePresentationComment(dto);

		// Verify
		verify(existingComment).delete(); // delete() 메서드가 호출되었는지 확인
	}

	@Test
	@DisplayName("프레젠테이션 댓글 삭제 실패 - 댓글 없음")
	void deletePresentationComment_실패_댓글_없음() {
		// Given
		Long userId = 1L;
		Long presentationId = 10L;
		Long nonExistentCommentId = 999L;

		PresentationCommentServiceDeleteDto dto = new PresentationCommentServiceDeleteDto(userId,
				presentationId, nonExistentCommentId);

		// When & Then
		ServiceException exception = assertThrows(ServiceException.class, () -> {
			presentationCommentService.deletePresentationComment(dto);
		});
		assertEquals(ExceptionStatus.PRESENTATION_COMMENT_NOT_FOUND, exception.getStatus());
		verify(presentationCommentRepository).findById(nonExistentCommentId);
	}

	@Test
	@DisplayName("프레젠테이션 댓글 삭제 실패 - 발표 없음")
	void deletePresentationComment_실패_발표_없음() {
		// Given
		Long userId = 1L;
		Long nonExistentPresentationId = 999L;
		Long commentId = 101L;

		PresentationCommentServiceDeleteDto dto = new PresentationCommentServiceDeleteDto(userId,
				nonExistentPresentationId, commentId);

		// When & Then
		ServiceException exception = assertThrows(ServiceException.class, () -> {
			presentationCommentService.deletePresentationComment(dto);
		});
		assertEquals(ExceptionStatus.PRESENTATION_COMMENT_NOT_FOUND, exception.getStatus());
	}

	@Test
	@DisplayName("프레젠테이션 댓글 삭제 실패 - 댓글과 발표 불일치")
	void deletePresentationComment_실패_댓글_발표_불일치() {

		// Given
		Long userId = 1L;
		Long presentationIdInDto = 10L; // DTO의 발표 ID
		Long actualPresentationId = 20L; // 댓글이 실제 속한 발표 ID (DTO와 다름)
		Long commentId = 101L;

		User ownerUser = mock(User.class);

		Presentation presentationInDto = mock(Presentation.class); // DTO ID에 해당하는 발표 Mock
		given(presentationQueryService.getPresentation(presentationIdInDto)).willReturn(
				presentationInDto);

		Presentation actualPresentation = mock(Presentation.class); // 댓글이 실제 속한 발표 Mock
		given(actualPresentation.getId()).willReturn(actualPresentationId);

		PresentationComment existingComment = mock(PresentationComment.class);
		given(existingComment.getPresentation()).willReturn(actualPresentation);

		given(presentationCommentRepository.findById(commentId)).willReturn(
				Optional.of(existingComment));

		PresentationCommentServiceDeleteDto dto = new PresentationCommentServiceDeleteDto(userId,
				presentationIdInDto, commentId);

		// When & Then
		ServiceException exception = assertThrows(ServiceException.class, () -> {
			presentationCommentService.deletePresentationComment(dto);
		});
		assertEquals(ExceptionStatus.PRESENTATION_COMMENT_INVALID_ASSOCIATION,
				exception.getStatus());
		verify(presentationCommentRepository).findById(commentId);
		verify(presentationQueryService).getPresentation(presentationIdInDto);
		verify(existingComment, never()).delete();
	}
}
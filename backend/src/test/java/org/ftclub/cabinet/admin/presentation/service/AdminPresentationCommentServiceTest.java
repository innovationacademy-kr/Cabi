package org.ftclub.cabinet.admin.presentation.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.LocalDateTime;
import java.util.List;
import javax.persistence.EntityManager;
import org.ftclub.cabinet.admin.dto.AdminPresentationCommentBanResponseDto;
import org.ftclub.cabinet.event.RedisExpirationEventListener;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.presentation.domain.Category;
import org.ftclub.cabinet.presentation.domain.Duration;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.domain.PresentationComment;
import org.ftclub.cabinet.presentation.domain.PresentationLocation;
import org.ftclub.cabinet.presentation.domain.PresentationSlot;
import org.ftclub.cabinet.presentation.dto.PresentationCommentResponseDto;
import org.ftclub.cabinet.presentation.repository.PresentationCommentRepository;
import org.ftclub.cabinet.presentation.repository.PresentationRepository;
import org.ftclub.cabinet.presentation.repository.PresentationSlotRepository;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.boot.test.mock.mockito.MockBean;

@SpringBootTest
@Transactional
class AdminPresentationCommentServiceTest {

	@Autowired
	private AdminPresentationCommentService adminPresentationCommentService;
	@Autowired
	private PresentationCommentRepository commentRepository;
	@Autowired
	private PresentationSlotRepository presentationSlotRepository;
	@Autowired
	private PresentationRepository presentationRepository;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private EntityManager entityManager;

	@MockBean
	private RedisExpirationEventListener redisExpirationEventListener;

	private User testUser1, testUser2;
	private PresentationSlot testPresentationSlot1, testPresentationSlot2;
	private Presentation testPresentation1, testPresentation2;
	private PresentationComment testComment1;
	private PresentationComment testComment2;

	@BeforeEach
	void setUp() {
		testUser1 = userRepository.save(User.of("testPr1", "testPr1@example.com", null, "USER"));
		testUser2 = userRepository.save(User.of("testPr2", "testPr2@example.com", null, "USER"));

		testPresentationSlot1 = presentationSlotRepository.save(
				new PresentationSlot(LocalDateTime.of(2024, 5, 10, 10, 0),
						PresentationLocation.BASEMENT));
		testPresentationSlot2 = presentationSlotRepository.save(
				new PresentationSlot(LocalDateTime.of(2024, 6, 10, 10, 0),
						PresentationLocation.BASEMENT));

		testPresentation1 = Presentation.of(testUser1, Category.DEVELOP, Duration.HOUR,
				"2024-05 test title1", "test summary", "test outline", "test detail",
				null, true, true, testPresentationSlot1);
		testPresentation2 = Presentation.of(testUser2, Category.DEVELOP, Duration.HOUR,
				"2024-06 test title2", "test summary", "test outline", "test detail",
				null, true, true, testPresentationSlot2);

		presentationRepository.save(testPresentation1);
		presentationRepository.save(testPresentation2);

		testComment1 = new PresentationComment(testPresentation1, testUser1, "Comment by user 1");
		commentRepository.save(testComment1);

		testComment2 = new PresentationComment(testPresentation1, testUser2, "Comment by user 2");
		commentRepository.save(testComment2);
	}

	@Test
	@DisplayName("특정 발표의 댓글 목록 조회 성공")
	void getComments_성공() {
		// When
		List<PresentationCommentResponseDto> comments = adminPresentationCommentService.getComments(
				testPresentation1.getId());

		// Then
		assertThat(comments).isNotNull();
		assertThat(comments.size()).isEqualTo(2);

		PresentationCommentResponseDto resultComment1 = comments.get(0);
		assertThat(resultComment1.getUser()).isEqualTo(testUser1.getName());
		assertThat(resultComment1.getDetail()).isEqualTo(testComment1.getDetail());
		assertThat(resultComment1.isBanned()).isFalse();
	}

	@Test
	@DisplayName("댓글 밴 성공")
	void banOrUnbanComment_밴_성공() {
		// Given
		Long presentationId = testPresentation1.getId();
		Long commentId = testComment1.getId();
		assertThat(testComment1.isBanned()).isFalse();

		// When
		AdminPresentationCommentBanResponseDto response =
				adminPresentationCommentService.banOrUnbanComment(presentationId, commentId, true);

		// Then
		assertThat(response).isNotNull();
		assertThat(response.isBanned()).isTrue();
		assertThat(response.getDetail()).isEqualTo(testComment1.getDetail());

		entityManager.flush();
		entityManager.clear();

		PresentationComment updatedComment = commentRepository.findById(commentId).orElseThrow();
		assertThat(updatedComment.isBanned()).isTrue();
	}

	@Test
	@DisplayName("댓글 밴 해제 성공")
	void banOrUnbanComment_밴_해제_성공() {
		// Given
		Long presentationId = testPresentation1.getId();
		Long commentId = testComment1.getId();
		testComment1.ban(); // 먼저 밴 상태로 만듦
		commentRepository.saveAndFlush(testComment1);
		assertThat(testComment1.isBanned()).isTrue();

		// When
		AdminPresentationCommentBanResponseDto response =
				adminPresentationCommentService.banOrUnbanComment(presentationId, commentId, false);

		// Then
		assertThat(response).isNotNull();
		assertThat(response.isBanned()).isFalse();

		entityManager.flush();
		entityManager.clear();

		PresentationComment updatedComment = commentRepository.findById(commentId).orElseThrow();
		assertThat(updatedComment.isBanned()).isFalse();
	}

	@Test
	@DisplayName("댓글 밴/언밴 실패 - 존재하지 않는 발표")
	void banOrUnbanComment_실패_존재하지_않는_발표() {
		// Given
		Long nonExistentPresentationId = 9999L;
		Long commentId = testComment1.getId();

		// When & Then
		ServiceException exception = assertThrows(ServiceException.class,
				() -> adminPresentationCommentService.banOrUnbanComment(nonExistentPresentationId,
						commentId, true));
		assertEquals(ExceptionStatus.PRESENTATION_NOT_FOUND, exception.getStatus());
	}


	@Test
	@DisplayName("댓글 밴/언밴 실패 - 존재하지 않는 댓글")
	void banOrUnbanComment_실패_존재하지_않는_댓글() {
		// Given
		Long presentationId = testPresentation1.getId();
		Long nonExistentCommentId = 9999L;

		// When & Then
		ServiceException exception = assertThrows(ServiceException.class,
				() -> adminPresentationCommentService.banOrUnbanComment(presentationId,
						nonExistentCommentId, true));
		assertEquals(ExceptionStatus.PRESENTATION_COMMENT_NOT_FOUND, exception.getStatus());
	}


	@Test
	@DisplayName("댓글 밴/언밴 실패 - 댓글과 발표의 연관관계 없음")
	void banOrUnbanComment_실패_연관관계_없음() {
		Long presentationId = testPresentation2.getId(); // 다른 발표 ID 사용
		Long commentId = testComment1.getId();

		// When & Then
		ServiceException exception = assertThrows(ServiceException.class,
				() -> adminPresentationCommentService.banOrUnbanComment(presentationId, commentId,
						true));
		assertEquals(ExceptionStatus.PRESENTATION_COMMENT_INVALID_ASSOCIATION,
				exception.getStatus());
	}


	@Test
	@DisplayName("댓글 삭제 성공")
	void deleteComment_성공() {
		// Given
		Long presentationId = testPresentation1.getId();
		Long commentId = testComment1.getId();
		assertThat(testComment1.isDeleted()).isFalse();

		// When
		assertDoesNotThrow(
				() -> adminPresentationCommentService.deleteComment(presentationId, commentId));

		// Then
		entityManager.flush();
		entityManager.clear();

		PresentationComment deletedComment = commentRepository.findById(commentId).orElseThrow();
		assertThat(deletedComment.isDeleted()).isTrue();
	}

	@Test
	@DisplayName("댓글 삭제 실패 - 댓글과 발표의 연관관계 없음")
	void deleteComment_실패_연관관계_없음() {
		// Given
		Long presentationId = testPresentation2.getId(); // 다른 발표 ID 사용
		Long commentId = testComment1.getId();

		// When & Then
		ServiceException exception = assertThrows(ServiceException.class,
				() -> adminPresentationCommentService.deleteComment(presentationId, commentId));
		assertEquals(ExceptionStatus.PRESENTATION_COMMENT_INVALID_ASSOCIATION,
				exception.getStatus());
	}

}

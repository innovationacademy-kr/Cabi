package org.ftclub.cabinet.presentation.repository;

import java.time.LocalDateTime;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.domain.PresentationComment;
import org.ftclub.cabinet.user.domain.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import org.ftclub.cabinet.presentation.domain.Category;
import org.ftclub.cabinet.presentation.domain.Duration;
import org.ftclub.cabinet.presentation.domain.PresentationLocation;
import org.ftclub.cabinet.presentation.domain.PresentationSlot;

@DataJpaTest
@EntityScan("org.ftclub.cabinet")
class PresentationCommentRepositoryTest {

	@Autowired
	private TestEntityManager em;

	@Autowired
	private PresentationCommentRepository presentationCommentRepository;

	// 테스트에서 공통으로 사용할 엔티티 변수 선언
	private User testUser;
	private Presentation targetPresentation;
	private PresentationComment activeComment;
	private PresentationComment deletedComment;

	@BeforeEach
	void setUp() {
		// --- Given ---

		// 1. User 생성 및 영속화
		testUser = User.of("testUser", "testuser@student.42seoul.kr",
				LocalDateTime.now().plusDays(100L), "ROLE_USER");
		em.persist(testUser);

		// 2. PresentationSlot 생성 및 영속화
		PresentationSlot slot1 = new PresentationSlot(LocalDateTime.now().plusDays(7),
				PresentationLocation.BASEMENT);
		em.persist(slot1);
		PresentationSlot slot2 = new PresentationSlot(LocalDateTime.now().plusDays(8),
				PresentationLocation.FIRST);
		em.persist(slot2);

		// 3. Presentation 생성 및 영속화
		// 3-1. 테스트 대상이 될 발표
		targetPresentation = Presentation.of(testUser, Category.STUDY, Duration.HOUR,
				"JPA 완전 정복", "JPA 심층 스터디", "JPA의 기본부터 심화까지", "상세 내용...",
				"thumbnail-s3-key-1", true, true, slot1);
		em.persist(targetPresentation);

		// 3-2. 경계값 테스트를 위한 다른 발표 - 조회되지 않는 댓글 생성을 위해 사용
		Presentation otherPresentation = Presentation.of(testUser, Category.DEVELOP, Duration.HALF,
				"TDD 시작하기", "TDD 방법론 공유", "TDD의 A to Z", "상세 내용...",
				"thumbnail-s3-key-2", true, true, slot2);
		em.persist(otherPresentation);

		// 4. PresentationComment 생성 및 영속화
		// 4-1. 조회되어야 할 댓글
		activeComment = new PresentationComment(targetPresentation, testUser, "발표 잘 들었습니다!");
		em.persist(activeComment);

		// 4-2. `deleted` 플래그가 true인 댓글
		deletedComment = new PresentationComment(targetPresentation, testUser, "이 댓글은 삭제됨");
		deletedComment.delete(); // delete() 메서드로 상태 변경
		em.persist(deletedComment);

		// 4-3. 다른 발표에 달린 댓글 - 조회되지 않아야 함
		PresentationComment otherComment = new PresentationComment(otherPresentation, testUser,
				"유익해요");
		em.persist(otherComment);

		// DB에 변경사항을 즉시 반영하고, 1차 캐시를 비워서 순수한 DB 조회 환경을 만듦
		em.flush();
		em.clear();
	}

	@Test
	@DisplayName("특정 Presentation ID로 삭제되지 않은 댓글만 생성 시간 오름차순으로 조회")
	void findByPresentationIdAndDeletedFalseOrderByCreatedAtAsc_성공() {
		// --- When ---
		List<PresentationComment> foundComments = presentationCommentRepository
				.findByPresentationIdAndDeletedFalseOrderByCreatedAtAsc(targetPresentation.getId());

		// --- Then ---
		// 1. 결과 리스트는 null이 아니며, 크기는 1이어야 한다.
		assertThat(foundComments).isNotNull().hasSize(1);

		// 2. 조회된 댓글이 activeComment와 일치하는지 검증
		PresentationComment resultComment = foundComments.get(0);
		assertThat(resultComment.getId()).isEqualTo(activeComment.getId());
		assertThat(resultComment.getDetail()).isEqualTo("발표 잘 들었습니다!");
		assertThat(resultComment.isDeleted()).isFalse();

		// 3. 연관된 Presentation이 올바른지 검증
		assertThat(resultComment.getPresentation().getId()).isEqualTo(targetPresentation.getId());
	}
}

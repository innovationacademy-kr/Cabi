package org.ftclub.cabinet.lent.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;

@SpringBootTest
@Transactional
@Disabled
class LentRepositoryTest {

	@Autowired
	LentRepository lentRepository;

	@Test
	void findFirstByCabinetIdAndEndedAtIsNull() {
		LocalDateTime now = LocalDateTime.now();
		// 빌리고 있는 유저가 없는 cabinet id
		Long cabinetId = 2L;

		Optional<LentHistory> ent = lentRepository.findByCabinetIdAndEndedAtIsNull(cabinetId);
		assertTrue(ent.isEmpty());

		LentHistory lentHistory =
				LentHistory.of(now, now.plusDays(3), 1L, cabinetId);

		LentHistory saved = lentRepository.save(lentHistory);
		ent = lentRepository.findByCabinetIdAndEndedAtIsNull(cabinetId);
		assertTrue(ent.isPresent());
		assertEquals(saved, ent.get());
	}

	@Test
	void findFirstByUserIdAndEndedAtIsNull() {
		LocalDateTime now = LocalDateTime.now();
		// 빌리고 있는 사물함이 없는 user id
		Long userId = 1L;

		Optional<LentHistory> ent = lentRepository.findByUserIdAndEndedAtIsNull(userId);
		assertTrue(ent.isEmpty());

		LentHistory lentHistory =
				LentHistory.of(now, now.plusDays(3), userId, 1L);

		LentHistory saved = lentRepository.save(lentHistory);
		ent = lentRepository.findByUserIdAndEndedAtIsNull(userId);
		assertTrue(ent.isPresent());
		assertEquals(saved, ent.get());
	}

	@Test
	void findByUserId() {
		// 빌린 기록이 없는 user id
		long userId = 18L;
		List<LentHistory> lentHistories = lentRepository.findPaginationByUserId(userId,
				PageRequest.of(0, 1)).toList();
		assertTrue(lentHistories.isEmpty());

		// 빌린 기록이 12개 있는 user id
		userId = 5L;
		lentHistories = lentRepository.findPaginationByUserId(userId,
				PageRequest.of(0, 20)).toList();
		assertEquals(12, lentHistories.size());
	}

	@Test
	void findByCabinetId() {
		// 빌린 기록이 없는 cabinet id
		long cabinetId = 1L;
		List<LentHistory> lentHistories = lentRepository.findPaginationByCabinetIdJoinCabinetAndUser(
				cabinetId,
				PageRequest.of(0, 1)).toList();
		assertTrue(lentHistories.isEmpty());

		// 빌린 기록이 6개 있는 cabinet id
		cabinetId = 3L;
		lentHistories = lentRepository.findPaginationByCabinetIdJoinCabinetAndUser(cabinetId,
				PageRequest.of(0, 20)).toList();
		assertEquals(6, lentHistories.size());
	}

	@Test
	void countUserActiveLent() {
		// 빌리고 잇는 기록이 1개인 user id
		Long userId = 5L;
		int count = lentRepository.countByUserIdAndEndedAtIsNull(userId);
		assertEquals(1, count);
	}

	@Test
	void countCabinetActiveLent() {
		// 빌리고 있는 기록이 3개 있는 cabinet id
		Long cabinetId = 4L;
		int count = lentRepository.countByCabinetIdAndEndedAtIsNull(cabinetId);
		assertEquals(3, count);
	}

	@Test
	void countUserAllLent() {
		// 빌린 기록이 12개 있는 user id
		Long userId = 5L;
		int count = lentRepository.countByUserId(userId);
		assertEquals(12, count);
	}

	@Test
	void countCabinetAllLent() {
		// 빌린 기록이 6개 있는 cabinet id
		Long cabinetId = 3L;
		int count = lentRepository.countByCabinetId(cabinetId);
		assertEquals(6, count);
	}

	@Test
	void findAllActiveLentByCabinetId() {
		// 빌리고 있는 기록이 3개 있는 cabinet id
		long cabinetId = 4L;
		List<LentHistory> lentHistories = lentRepository.findAllByCabinetIdAndEndedAtIsNull(
				cabinetId);
		assertEquals(3, lentHistories.size());
		cabinetId = 2L;
		lentHistories = lentRepository.findAllByCabinetIdAndEndedAtIsNull(cabinetId);
		assertTrue(lentHistories.isEmpty());
	}
}
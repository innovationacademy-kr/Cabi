package org.ftclub.cabinet.user.repository;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;

import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@SpringBootTest
@Transactional
public class BanHistoryRepositoryTest {

	@Autowired
	private BanHistoryRepository banHistoryRepository;

	@Test
	public void 현재_active한_밴_히스토리가_있는_유저() {
		// ban history 한 개 존재
		// 2023.1.15 이 기준일이었기 때문에 현재 시간으로 한 테스트와 결과값이 다르게 나옴
		Long userId = 1L;

		List<BanHistory> activeBanList = banHistoryRepository.findUserActiveBanList(userId);

		Assertions.assertNotNull(activeBanList);
		Assertions.assertFalse(activeBanList.isEmpty());
	}

	@Test
	public void testFindBanHistoriesByUserId() {
		// penaltyuser1 의 ban history 1개 존재
		Long userId = 3L;

		List<BanHistory> banHistories = banHistoryRepository.findBanHistoriesByUserId(userId);

		assertNotNull(banHistories);
		assertFalse(banHistories.isEmpty());
		assertEquals(1, banHistories.size());
	}

	@Test
	public void testFindActiveBanList() {
		// 결과값이 다르게 나올 것. 날짜 설정 해줘야 함.
		Pageable pageable = PageRequest.of(0, 10);

		List<BanHistory> activeBanList = banHistoryRepository.findActiveBanList(pageable);

		Assertions.assertNotNull(activeBanList);
	}

	@Test
	public void testFindRecentBanHistoryByUserId() {
		// ban history가 없는 유저
		Long userId = 10L;

		Optional<BanHistory> recentBanHistory = banHistoryRepository.findRecentBanHistoryByUserId(
				userId);

		Assertions.assertTrue(recentBanHistory.isPresent());
	}
}

package org.ftclub.cabinet.user.repository;

import org.junit.jupiter.api.Disabled;
import org.springframework.boot.test.context.SpringBootTest;

import javax.transaction.Transactional;

@SpringBootTest
@Transactional
@Disabled
public class BanHistoryRepositoryTest {

//	// DB와 같이 2023.01.15 09:00:00 시간을 기준으로 했습니다.
//	LocalDateTime testDate = LocalDateTime.of(123, 1, 15, 9, 0);
//	@Autowired
//	private BanHistoryRepository banHistoryRepository;
//
//	@Test
//	public void 현재_active한_밴_히스토리가_있는_유저() {
//		// ban history 한 개 존재
//		Long userId = 1L;
//
//		List<BanHistory> activeBanList = banHistoryRepository.findByUserIdAndUnbannedAt(userId,
//				testDate);
//
//		assertNotNull(activeBanList);
//		assertFalse(activeBanList.isEmpty());
//		assertEquals(1, activeBanList.size());
//	}
//
//	@Test
//	public void testFindBanHistoriesByUserId() {
//		// penaltyuser1 의 ban history 1개 존재
//		Long userId = 3L;
//
//		List<BanHistory> banHistories = banHistoryRepository.findBanHistoriesByUserId(userId);
//
//		assertNotNull(banHistories);
//		assertFalse(banHistories.isEmpty());
//		assertEquals(1, banHistories.size());
//	}
//
//	@Test
//	public void testFindActiveBanList() {
//		Pageable pageable = PageRequest.of(0, 10);
//		List<BanHistory> activeBanList = banHistoryRepository.findPaginationActiveBanHistories(
//				pageable,
//				testDate).getContent();
//
//		assertNotNull(activeBanList);
//		assertEquals(2, activeBanList.size());
//	}
//
//	@Test
//	public void testFindRecentBanHistoryByUserId() {
//		// ban history가 없는 유저
//		Long userId = 10L;
//
//		Assertions.assertTrue(banHistoryRepository.findRecentBanHistoryByUserId(
//				userId, LocalDateTime.now(), PageRequest.of(0, 1)).isEmpty());
//
////		Assertions.assertFalse(recentBanHistory.isPresent()); to-do
//	}
}

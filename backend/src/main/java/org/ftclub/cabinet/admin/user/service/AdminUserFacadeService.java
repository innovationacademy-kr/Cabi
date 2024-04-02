package org.ftclub.cabinet.admin.user.service;

import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.user.service.BanHistoryCommandService;
import org.ftclub.cabinet.user.service.BanHistoryQueryService;
import org.springframework.stereotype.Service;

/**
 * 관리자 페이지에서 사용되는 유저 서비스
 */
@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class AdminUserFacadeService {

	private final BanHistoryQueryService banHistoryQueryService;
	private final BanHistoryCommandService banHistoryCommandService;


	/**
	 * 유저의 가장 최근의 밴 기록을 제거합니다.
	 *
	 * @param userId 유저 고유 아이디
	 * @param now    현재 시간
	 */
	public void deleteRecentBanHistory(Long userId, LocalDateTime now) {
		banHistoryQueryService.findRecentActiveBanHistory(userId, now)
				.ifPresent(banHistory ->
						banHistoryCommandService.deleteRecentBanHistory(banHistory, now));
	}
}

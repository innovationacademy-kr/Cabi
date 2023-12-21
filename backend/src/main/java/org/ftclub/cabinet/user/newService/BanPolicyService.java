package org.ftclub.cabinet.user.newService;

import java.time.LocalDateTime;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.user.domain.BanType;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class BanPolicyService {

	public BanType verifyBan(LocalDateTime endedAt, LocalDateTime expiredAt) {
		log.debug("Called verifyBan");

		if (expiredAt.isBefore(endedAt)) {
			return BanType.ALL;
		}
		return BanType.NONE;
	}

	public LocalDateTime getUnBannedAt(LocalDateTime endedAt, LocalDateTime expiredAt) {
		log.debug("Called getBanDate");

		long recentBanDays = DateUtil.calculateTwoDateDiffCeil(expiredAt, endedAt);
		double squaredBanDays = Math.pow(recentBanDays, 2);
		return endedAt.plusDays((long) squaredBanDays);
	}
}

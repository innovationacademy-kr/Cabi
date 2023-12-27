package org.ftclub.cabinet.user.newService;

import java.time.LocalDateTime;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.user.domain.BanType;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.stereotype.Service;

@Service
@Logging(level = LogLevel.DEBUG)
public class BanPolicyService {

	public BanType verifyBan(LocalDateTime endedAt, LocalDateTime expiredAt) {
		if (expiredAt.isBefore(endedAt)) {
			return BanType.ALL;
		}
		return BanType.NONE;
	}

	public LocalDateTime getUnBannedAt(LocalDateTime endedAt, LocalDateTime expiredAt) {
		long recentBanDays = DateUtil.calculateTwoDateDiffCeil(expiredAt, endedAt);
		double squaredBanDays = Math.pow(recentBanDays, 2);
		return endedAt.plusDays((long) squaredBanDays);
	}
}

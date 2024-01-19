package org.ftclub.cabinet.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class CabinetProperties {

	@Value("${cabinet.policy.lent.term.private}")
	private Integer lentTermPrivate;
	@Value("${cabinet.policy.lent.term.share}")
	private Integer lentTermShare;
	@Value("${cabinet.policy.lent.term.share-basic}")
	private Integer lentTermShareBasic;
	@Value("${cabinet.policy.lent.term.extend}")
	private Integer lentExtendTerm;
	@Value("${cabinet.policy.penalty.day.share}")
	private Integer penaltyDayShare;
	@Value("${cabinet.policy.penalty.day.padding}")
	private Integer penaltyDayPadding;
	@Value("${cabinet.policy.lent.limit.share.min-user-count}")
	private Long shareMinUserCount;
	@Value("${cabinet.policy.lent.limit.share.max-user-count}")
	private Long shareMaxUserCount;
	@Value("${cabinet.policy.in-session.term}")
	private Integer inSessionTerm;
	@Value("${cabinet.policy.lent.limit.share.max-attempt-count}")
	private Long shareMaxAttemptCount;
	@Value("${cabinet.policy.swap.term.private}")
	private Integer swapTermPrivateDays;
	@Value(("${cabinet.policy.swap.minimum-require-days}"))
	private Integer requireSwapMinimumDays;

}

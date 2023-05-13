package org.ftclub.cabinet.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class CabinetProperties {

	@Value("${cabinet.lent.term.private}")
	private Integer lentTermPrivate;
	@Value("${cabinet.lent.term.share}")
	private Integer lentTermShare;
	@Value("${cabinet.penalty.day.share}")
	private Integer penaltyDayShare;
	@Value("${cabinet.penalty.day.padding}")
	private Integer penaltyDayPadding;

}

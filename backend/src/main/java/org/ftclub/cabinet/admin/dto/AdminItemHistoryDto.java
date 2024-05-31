package org.ftclub.cabinet.admin.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminItemHistoryDto {

	private LocalDateTime purchasedAt;
	private LocalDateTime usedAt;
	private String itemName;
	private String itemDetails;
}

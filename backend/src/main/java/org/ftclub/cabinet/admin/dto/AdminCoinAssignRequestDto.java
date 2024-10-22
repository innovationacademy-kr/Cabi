package org.ftclub.cabinet.admin.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.ftclub.cabinet.item.domain.Sku;

@Getter
@AllArgsConstructor
public class AdminCoinAssignRequestDto {

	private List<Long> userIds;
	private Sku sku;
	private Long amount;
}

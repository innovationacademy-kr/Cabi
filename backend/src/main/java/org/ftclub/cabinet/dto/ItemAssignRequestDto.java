package org.ftclub.cabinet.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.ftclub.cabinet.item.domain.Sku;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ItemAssignRequestDto {

	private Sku itemSku;
	private List<Long> userIds;
}

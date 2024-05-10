package org.ftclub.cabinet.item.domain;

import io.netty.util.internal.StringUtil;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import org.ftclub.cabinet.dto.ItemUseRequestDto;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.HandlerMapping;

public class ItemUseValidator implements ConstraintValidator<ValidItemUse, ItemUseRequestDto> {

	private static final String PATH_VARIABLE_NAME = "sku";
	private static final String SKU_SWAP_NAME = "SWAP";
	private static final String SKU_ALARM_NAME = "ALARM";

	@Override
	public boolean isValid(ItemUseRequestDto itemUseRequestDto,
		ConstraintValidatorContext constraintValidatorContext) {

		ServletRequestAttributes requestAttributes =
			(ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
		HttpServletRequest request = requestAttributes.getRequest();
		Map<String, String> pathVariables =
			(Map<String, String>) request.getAttribute(
				HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE);

		String sku = pathVariables.get(PATH_VARIABLE_NAME);
		if (sku.equals(SKU_SWAP_NAME) && itemUseRequestDto.getNewCabinetId() == null) {
			return false;
		}
		if (sku.equals(SKU_ALARM_NAME) && !isValidAlarmData(itemUseRequestDto)) {
			return false;
		}
		return true;
	}

	private boolean isValidAlarmData(ItemUseRequestDto dto) {
		if (dto.getFloor() == null
			|| StringUtil.isNullOrEmpty(dto.getSection())
			|| StringUtil.isNullOrEmpty(dto.getBuilding())) {
			return false;
		}
		return true;
	}
}

package org.ftclub.cabinet.item.domain;

import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.dto.ItemUseRequestDto;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.HandlerMapping;

@Slf4j
public class ItemUseValidator implements ConstraintValidator<ValidItemUse, ItemUseRequestDto> {

	private static final String PATH_VARIABLE_NAME = "sku";

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
		if (sku.equals("SWAP") && itemUseRequestDto.getNewCabinetId() == null) {
			return false;
		}
		if (sku.equals("ALARM") && !isValidAlarmData(itemUseRequestDto)) {
			return false;
		}
		return true;
	}

	private boolean isValidAlarmData(ItemUseRequestDto dto) {
		if (dto.getBuilding() == null || dto.getFloor() == null || dto.getSection() == null) {
			return false;
		}
		if (dto.getBuilding().isBlank() || dto.getSection().isBlank()) {
			return false;
		}
		if (dto.getFloor() < 1 || dto.getFloor() > 5) {
			return false;
		}
		return true;
	}
}

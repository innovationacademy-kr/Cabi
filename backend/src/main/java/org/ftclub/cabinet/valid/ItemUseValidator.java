package org.ftclub.cabinet.valid;

import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.dto.ItemUseRequestDto;
import org.ftclub.cabinet.item.domain.Sku;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.HandlerMapping;

@Component
@Slf4j
public class ItemUseValidator implements ConstraintValidator<ItemUseValidation, ItemUseRequestDto> {

	@Override
	public void initialize(ItemUseValidation constraintAnnotation) {
		ConstraintValidator.super.initialize(constraintAnnotation);
	}

	@Override
	public boolean isValid(ItemUseRequestDto itemUseRequestDto,
			ConstraintValidatorContext context) {
		log.info("validation called : {}", itemUseRequestDto);
		ServletRequestAttributes attrs =
				(ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
		if (attrs == null) {
			return false;
		}
		HttpServletRequest request = attrs.getRequest();

		Map<String, String> pathVariables = (Map<String, String>) request
				.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE);
		Sku sku = Sku.valueOf(pathVariables.get("sku"));

		if (sku.equals(Sku.ALARM)) {
			return itemUseRequestDto.getSectionAlarmType() != null
					&& itemUseRequestDto.getCabinetPlaceId() != null;
		} else if (sku.equals(Sku.SWAP)) {
			return itemUseRequestDto.getNewCabinetId() != null;
		}
		return true;
	}
}

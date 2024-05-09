package org.ftclub.cabinet.item.domain;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import javax.validation.Constraint;
import javax.validation.Payload;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ItemUseValidator.class)
public @interface ValidItemUse {

	String message() default "잘못된 아이템 사용 요청입니다";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};
}


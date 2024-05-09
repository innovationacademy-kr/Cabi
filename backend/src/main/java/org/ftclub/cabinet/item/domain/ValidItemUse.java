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

	String message() default "Invalid item usage";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};
}


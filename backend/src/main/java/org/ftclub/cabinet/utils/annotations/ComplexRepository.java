package org.ftclub.cabinet.utils.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.stereotype.Repository;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Repository
public @interface ComplexRepository {
	Class[] entityClass() default Object[].class;
}

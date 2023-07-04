package org.ftclub.testutils;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import javax.persistence.Id;

public class TestInjector {

	public static void injectId(Object entity, Object value) throws IllegalAccessException {
		Class<?> cls = entity.getClass();
		Field[] fields = cls.getDeclaredFields();
		List<Field> id = Arrays.stream(fields)
				.filter(field -> field.isAnnotationPresent(Id.class))
				.collect(Collectors.toUnmodifiableList());
		Field field = id.get(0);
		field.setAccessible(true);
		field.set(entity, value);
		field.setAccessible(false);
	}

}

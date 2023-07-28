package org.ftclub.cabinet.utils.annotations;

import static org.mapstruct.NullValueMappingStrategy.RETURN_DEFAULT;
import static org.mapstruct.NullValueMappingStrategy.RETURN_NULL;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.mapstruct.Mapper;

/**
 * NPE를 방지하고, 빈 값들을 매핑할 수 있는 mapper 입니다.
 * <p>
 * 단일 객체가 null인 경우, null을 매핑합니다.
 * <p>
 * Map, Iterable가 비어있거나, null인 경우 빈 Map 또는 Iterable을 매핑합니다.
 */
@Mapper(componentModel = "spring",
		nullValueMappingStrategy = RETURN_NULL,
		nullValueMapMappingStrategy = RETURN_DEFAULT,
		nullValueIterableMappingStrategy = RETURN_DEFAULT)
@Target({java.lang.annotation.ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface NullableMapper {

}

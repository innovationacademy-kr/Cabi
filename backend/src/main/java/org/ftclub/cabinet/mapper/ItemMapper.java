package org.ftclub.cabinet.mapper;

import static org.mapstruct.NullValueMappingStrategy.RETURN_DEFAULT;

import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring",
		nullValueMappingStrategy = RETURN_DEFAULT,
		nullValueMapMappingStrategy = RETURN_DEFAULT,
		nullValueIterableMappingStrategy = RETURN_DEFAULT)
@Component
public interface ItemMapper {

}

package org.ftclub.cabinet.utils.annotations;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Read를 위한 정보(DTO, 값 객체들)를 가져오는 Service를 의미하는 커스텀 어노테이션입니다.
 */
@Service
@Transactional(readOnly = true)
@Target({java.lang.annotation.ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface QueryService {

}

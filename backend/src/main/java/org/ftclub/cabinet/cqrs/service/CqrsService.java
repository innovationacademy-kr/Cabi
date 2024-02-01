package org.ftclub.cabinet.cqrs.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cqrs.respository.CqrsRedis;
import org.springframework.stereotype.Service;

@Service
//@Logging(level = LogLevel.DEBUG)
@RequiredArgsConstructor
@Log4j2
public class CqrsService {

	private final CqrsRedis cqrsRedis;


}

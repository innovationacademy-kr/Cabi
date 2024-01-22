package org.ftclub.cabinet.club.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.club.repository.ClubRepository;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class ClubCommandService {

	private final ClubRepository clubRepository;

}

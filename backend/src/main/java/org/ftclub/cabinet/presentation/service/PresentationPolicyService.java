package org.ftclub.cabinet.presentation.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.presentation.domain.PresentationStatus;
import org.ftclub.cabinet.presentation.repository.PresentationRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PresentationPolicyService {

	private static final Integer MAXIMUM_MONTH = 3;
	private final PresentationRepository presentationRepository;

	/**
	 * 발표 날짜에 대해 예약 가능한지 검증한다.
	 * <p>
	 * 범위 내의 날짜(등록일 기준 3개월 이내), 예약 날짜인지 검증
	 *
	 * @param localDateTime 원하는 발표 날짜
	 */
	public void verifyReservationDate(LocalDateTime localDateTime) {
		LocalDate now = LocalDate.now();
		LocalDate reservationDate = localDateTime.toLocalDate();

		LocalDateTime startOfDay = reservationDate.atStartOfDay();
		LocalDateTime endOfDay = startOfDay.plusDays(1);

		if (reservationDate.isBefore(now) ||
				reservationDate.isAfter(now.plusMonths(MAXIMUM_MONTH))) {
			throw ExceptionStatus.INVALID_DATE.asServiceException();
		}

		presentationRepository.findByDate(startOfDay, endOfDay)
			.ifPresent(presentation -> {
				throw ExceptionStatus.PRESENTATION_ALREADY_EXISTED.asServiceException();
			});
	}

	public PresentationStatus verityPresentationStatus(String status) {

		if (status.equals("CANCEL")) {
			return PresentationStatus.CANCEL;
		}
		if (status.equals("DONE")) {
			return PresentationStatus.DONE;
		}
		if (status.equals("EXPECTED")) {
			return PresentationStatus.EXPECTED;
		}
		throw ExceptionStatus.INVALID_STATUS.asServiceException();
	}
}

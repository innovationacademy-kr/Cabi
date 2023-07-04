package org.ftclub.cabinet.lent.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.verify;

import java.time.LocalDateTime;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetPlace;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Grid;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.cabinet.domain.MapArea;
import org.ftclub.cabinet.cabinet.domain.SectionFormation;
import org.ftclub.cabinet.cabinet.repository.CabinetOptionalFetcher;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.domain.LentPolicy;
import org.ftclub.cabinet.lent.repository.LentOptionalFetcher;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.user.repository.BanHistoryRepository;
import org.ftclub.cabinet.user.repository.UserOptionalFetcher;
import org.ftclub.cabinet.user.service.UserService;
import org.ftclub.testutils.TestInjector;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class LentServiceImpUnitTest {

	LentService lentService;
	@Mock
	LentRepository lentRepository;
	@Mock
	LentPolicy lentPolicy;
	@Mock
	LentOptionalFetcher lentOptionalFetcher;
	@Mock
	CabinetOptionalFetcher cabinetOptionalFetcher;
	@Mock
	UserOptionalFetcher userExceptionHandler;
	@Mock
	UserService userService;
	@Mock
	BanHistoryRepository banHistoryRepository;

	@BeforeEach
	void setUp() {
		lentService = new LentServiceImpl(lentRepository, lentPolicy, lentOptionalFetcher,
				cabinetOptionalFetcher, userExceptionHandler, userService, banHistoryRepository);
	}

	@Test
	void startLentClubCabinet() {
	}

	@Test
	void endLentCabinet() {
	}

	@Test
	void terminateLentCabinet() {
	}

	@Test
	void terminateLentByCabinetId() {
	}

	@Nested
	@DisplayName("test startLentCabinet()")
	class StartLentCabinet {

	}

	@Nested
	@DisplayName("test assignLentCabinet()")
	class AssignLentCabinet {

		@Test
		void 대여_성공() throws Exception {
			// given
			Long existedUserId = 1L;
			Long existedCabinetId = 1L;
			Cabinet exitedCabinet = Cabinet.of(
					1, CabinetStatus.AVAILABLE,
					LentType.PRIVATE, 1, Grid.of(1, 1),
					CabinetPlace.of(Location.of("building", 1, "section"),
							SectionFormation.of(1, 1),
							MapArea.of(1, 1, 1, 1)));
			User exitedUser = User.of(
					"testName",
					"test@test.com",
					LocalDateTime.MAX,
					UserRole.USER
			);
			TestInjector.injectId(exitedCabinet, existedCabinetId);
			TestInjector.injectId(exitedUser, existedUserId);

			given(cabinetOptionalFetcher.getCabinetForUpdate(existedCabinetId))
					.willReturn(exitedCabinet);
			given(lentPolicy.generateExpirationDate(any(), any(), any()))
					.willReturn(LocalDateTime.MAX);
			given(userExceptionHandler.getUser(existedUserId))
					.willReturn(exitedUser);
			lentRepository.save(any(LentHistory.class));

			// when
			lentService.assignLent(existedUserId, existedCabinetId);

			// then
			verify(cabinetOptionalFetcher, atLeastOnce()).getCabinetForUpdate(existedCabinetId);
			verify(lentRepository, atLeastOnce()).save(any(LentHistory.class));
			verify(lentPolicy, atLeastOnce()).generateExpirationDate(any(), any(), any());
		}

		@Test
		void 대여_실패_캐비넷_없음() throws Exception {
			// given
			Long existedUserId = 1L;
			Long notExistedCabinetId = 1L;
			User exitedUser = User.of(
					"testName",
					"test@test.com",
					LocalDateTime.MAX,
					UserRole.USER
			);
			TestInjector.injectId(exitedUser, existedUserId);
			given(cabinetOptionalFetcher.getCabinetForUpdate(any()))
					.willThrow(new ServiceException(ExceptionStatus.NOT_FOUND_CABINET));
			lenient().when(userExceptionHandler.getUser(existedUserId))
					.thenReturn(exitedUser);
			// when
			try {
				lentService.assignLent(existedUserId, notExistedCabinetId);
			} catch (RuntimeException ignored) {
			}

			// then
			verify(cabinetOptionalFetcher, atLeastOnce()).getCabinetForUpdate(notExistedCabinetId);
		}

		@Test
		void 대여_실패_유저_없음() throws Exception {
			// given
			Long existedCabinetId = 1L;
			Long notExitedUserId = 1L;
			Cabinet exitedCabinet = Cabinet.of(
					1, CabinetStatus.AVAILABLE,
					LentType.PRIVATE, 1, Grid.of(1, 1),
					CabinetPlace.of(Location.of("building", 1, "section"),
							SectionFormation.of(1, 1),
							MapArea.of(1, 1, 1, 1)));
			TestInjector.injectId(exitedCabinet, existedCabinetId);
			lenient().when(cabinetOptionalFetcher.getCabinetForUpdate(existedCabinetId))
					.thenReturn(exitedCabinet);
			given(userExceptionHandler.getUser(any()))
					.willThrow(new ServiceException(ExceptionStatus.NOT_FOUND_USER));

			//when
			try {
				lentService.assignLent(1L, existedCabinetId);
			} catch (RuntimeException ignored) {
			}

			// then
			verify(userExceptionHandler, atLeastOnce()).getUser(notExitedUserId);
		}
	}
}
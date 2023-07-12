package org.ftclub.cabinet.cabinet.domain;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;

import org.ftclub.cabinet.exception.DomainException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;


@ExtendWith(MockitoExtension.class)
public class CabinetUnitTest {

	@Mock
	Grid grid = mock(Grid.class);

	@Mock
	CabinetPlace cabinetPlace = mock(CabinetPlace.class);

	Cabinet cabinet;

	@BeforeEach
	void setUp() {
		cabinet = Cabinet.of(1, CabinetStatus.AVAILABLE, LentType.PRIVATE, 1, grid,
				cabinetPlace);
	}

	@Test
	@DisplayName("Cabinet 생성 성공 테스트")
	void Cabinet_생성_성공() {
		assertDoesNotThrow(() -> Cabinet.of(1, CabinetStatus.AVAILABLE, LentType.PRIVATE, 1, grid,
				cabinetPlace));
	}

	@Test
	@DisplayName("Cabinet 생성 실패 테스트")
	void Cabinet_생성_실패() {
		Integer visibleNum = -1;
		Integer maxUser = -1;

		assertThrows(DomainException.class,
				() -> Cabinet.of(visibleNum, CabinetStatus.AVAILABLE, LentType.PRIVATE, maxUser,
						grid, cabinetPlace));
	}

	@Test
	@DisplayName("Cabinet의 status가 동일한지/아닌지 확인 테스트")
	void isStatus() {
		assertTrue(cabinet.isStatus(CabinetStatus.AVAILABLE));
		assertFalse(cabinet.isStatus(CabinetStatus.FULL));
	}

	@Test
	@DisplayName("Cabinet의 lentType이 동일한지/아닌지 확인 테스트")
	void isLentType() {
		assertTrue(cabinet.isLentType(LentType.PRIVATE));
		assertFalse(cabinet.isLentType(LentType.SHARE));
	}

	@Test
	@DisplayName("Cabinet의 visibleNum이 동일한지/아닌지 확인 테스트")
	void isVisibleNum() {
		assertTrue(cabinet.isVisibleNum(1));
		assertFalse(cabinet.isVisibleNum(2));
	}

	@Test
	@DisplayName("Cabinet의 cabinetPlace가 동일한지/아닌지 확인 테스트")
	void isCabinetPlace() {
		assertTrue(cabinet.isCabinetPlace(cabinetPlace));
		assertFalse(cabinet.isCabinetPlace(null));
	}

	@Test
	@DisplayName("Cabinet의 cabinetPlace 변경 테스트")
	void specifyCabinetPlace() {
		CabinetPlace newCabinetPlace = mock(CabinetPlace.class);

		cabinet.specifyCabinetPlace(newCabinetPlace);

		assertTrue(cabinet.isCabinetPlace(newCabinetPlace));
	}

	@Test
	@DisplayName("Cabinet의 visibleNum 변경 테스트 - 성공")
	void assignVisibleNum_성공() {
		Integer newVisibleNum = 2;

		assertDoesNotThrow(() -> cabinet.assignVisibleNum(newVisibleNum));
	}

	@Test
	@DisplayName("Cabinet의 visibleNum 변경 테스트 - 실패")
	void assignVisibleNum_실패() {
		Integer newVisibleNum = -1;

		assertThrows(DomainException.class, () -> cabinet.assignVisibleNum(newVisibleNum));
	}

	@Test
	@DisplayName("Cabinet의 status 변경 테스트 - 성공")
	void specifyStatus_성공() {
		CabinetStatus newStatus = CabinetStatus.FULL;

		assertDoesNotThrow(() -> cabinet.specifyStatus(newStatus));
	}

	@Test
	@DisplayName("Cabinet의 status 변경 테스트 - 실패")
	void specifyStatus_실패() {
		CabinetStatus newStatus = null;

		assertThrows(DomainException.class, () -> cabinet.specifyStatus(newStatus));
	}

	@Test
	@DisplayName("Cabinet maxUser 변경 테스트 - 성공")
	void specifyMaxUser_성공() {
		Integer newMaxUser = 2;

		assertDoesNotThrow(() -> cabinet.specifyMaxUser(newMaxUser));
	}

	@Test
	@DisplayName("Cabinet maxUser 변경 테스트 - 실패")
	void specifyMaxUser_실패() {
		Integer newMaxUser = -1;

		assertThrows(DomainException.class, () -> cabinet.specifyMaxUser(newMaxUser));
	}

	/**
	 * writeStatusNote에서 isValid()로 유효성을 검사하는데, isValid()는 statusNote에 대해서는 검사하지 않기 때문에 isValid()를
	 * 쓰는 의미가 없는 듯 보임.
	 */
	@Test
	@DisplayName("Cabinet StatusNote 입력 테스트")
	void writeStatusNote() {
		String newStatusNote = "test";

		assertDoesNotThrow(() -> cabinet.writeStatusNote(newStatusNote));
	}

	@Test
	@DisplayName("Cabinet의 lent type 변경 테스트 - 성공")
	void specifyLentType_성공() {
		LentType newLentType = LentType.SHARE;

		assertDoesNotThrow(() -> cabinet.specifyLentType(newLentType));
	}

	@Test
	@DisplayName("Cabinet의 lent type 변경 테스트 - 실패")
	void specifyLentType_실패() {
		LentType newLentType = null;

		assertThrows(DomainException.class, () -> cabinet.specifyLentType(newLentType));
	}

	/**
	 * writeTitle에서 isValid()로 유효성을 검사하는데, isValid()는 title에 대해서는 검사하지 않기 때문에 isValid()를 쓰는 의미가 없는 듯
	 * 보임.
	 */
	@Test
	@DisplayName("Cabinet의 title 입력 테스트")
	void writeTitle() {
		String newTitle = "test";

		assertDoesNotThrow(() -> cabinet.writeTitle(newTitle));
	}

	@Test
	@DisplayName("Cabinet의 grid 변경 테스트 - 성공")
	void coordinateGrid_성공() {
		Grid newGrid = mock(Grid.class);

		assertDoesNotThrow(() -> cabinet.coordinateGrid(newGrid));
	}

	@Test
	@DisplayName("Cabinet의 grid 변경 테스트 - 실패")
	void coordinateGrid_실패() {
		Grid newGrid = null;

		assertThrows(DomainException.class, () -> cabinet.coordinateGrid(newGrid));
	}

	/**
	 * writeMemo에서 isValid()로 유효성을 검사하는데, isValid()는 memo에 대해서는 검사하지 않기 때문에 isValid()를 쓰는 의미가 없는 듯
	 * 보임.
	 */
	@Test
	@DisplayName("Cabinet의 memo 입력 테스트")
	void writeMemo() {
		String newMemo = "test";

		assertDoesNotThrow(() -> cabinet.writeMemo(newMemo));
	}

	@Test
	@DisplayName("equals 메서드 테스트 - 같은 클래스의 객체이고 cabinetId가 같으며 참조값이 같은 경우")
	void equals_같은_객체_완전_동일() {
		Cabinet other = cabinet;

		assertTrue(() -> cabinet.equals(other));
	}

	@Test
	@DisplayName("equals 메서드 테스트 - 다른 클래스의 객체인 경우")
	void equals_다른_객체() {
		String other = String.valueOf("test");

		assertFalse(() -> cabinet.equals(other));
	}

	@Test
	@DisplayName("사물함을 이용 중인 유저 수에 따른 status 변경 테스트 - broken일 경우")
	void specifyStatusByUserCount_broken() {
		Integer userCount = 1;

		cabinet.specifyStatus(CabinetStatus.BROKEN);

		assertThrows(DomainException.class, () -> cabinet.specifyStatusByUserCount(userCount));
	}

	@Test
	@DisplayName("사물함을 이용 중인 유저 수에 따른 status 변경 테스트 - 이용 중인 유저가 없을 경우")
	void specifyStatusByUserCount_available() {
		Integer userCount = 0;
		cabinet.specifyStatus(CabinetStatus.FULL);

		cabinet.specifyStatusByUserCount(userCount);

		assertTrue(cabinet.isStatus(CabinetStatus.AVAILABLE));
	}

	@Test
	@DisplayName("사물함을 이용 중인 유저 수에 따른 status 변경 테스트 - 이용 중인 유저가 개인 사물함의 maxUser와 같을 경우")
	void specifyStatusByUserCount_full_private() {
		Integer userCount = 1;
		cabinet.specifyStatus(CabinetStatus.AVAILABLE);
		cabinet.specifyLentType(LentType.PRIVATE);
		cabinet.specifyMaxUser(1);

		cabinet.specifyStatusByUserCount(userCount);

		assertTrue(cabinet.isStatus(CabinetStatus.FULL));
	}

	@Test
	@DisplayName("사물함을 이용 중인 유저 수에 따른 status 변경 테스트 - 이용 중인 유저가 공유 사물함의 maxUser와 같을 경우")
	void specifyStatusByUserCount_full_share() {
		Integer userCount = 3;
		cabinet.specifyStatus(CabinetStatus.AVAILABLE);
		cabinet.specifyLentType(LentType.SHARE);
		cabinet.specifyMaxUser(3);

		cabinet.specifyStatusByUserCount(userCount);

		assertTrue(cabinet.isStatus(CabinetStatus.FULL));
	}

	@Test
	@DisplayName("사물함을 이용 중인 유저 수에 따른 status 변경 테스트 - 공유 사물함의 자리가 있는데 만료 기간이 설정된 경우")
	void specifyStatusByUserCount_limitedAvailable_share() {
		Integer userCount = 2;
		cabinet.specifyStatus(CabinetStatus.FULL);
		cabinet.specifyLentType(LentType.SHARE);
		cabinet.specifyMaxUser(3);

		cabinet.specifyStatusByUserCount(userCount);

		assertTrue(cabinet.isStatus(CabinetStatus.LIMITED_AVAILABLE));
	}
}

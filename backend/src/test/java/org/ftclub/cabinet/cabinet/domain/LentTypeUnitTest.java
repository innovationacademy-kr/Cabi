package org.ftclub.cabinet.cabinet.domain;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class LentTypeUnitTest {

	@Test
	@DisplayName("LentType의 isValid() 테스트 - 유효한 경우")
	void isValid_성공() {
		LentType lentTypePrivate = LentType.PRIVATE;
		LentType lentTypeShare = LentType.SHARE;
		LentType lentTypeClub = LentType.CLUB;

		assertTrue(lentTypePrivate.isValid());
		assertTrue(lentTypeShare.isValid());
		assertTrue(lentTypeClub.isValid());
	}
}

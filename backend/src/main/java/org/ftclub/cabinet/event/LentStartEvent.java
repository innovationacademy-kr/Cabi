package org.ftclub.cabinet.event;

import java.util.Date;
import lombok.Getter;
import lombok.ToString;
import org.ftclub.cabinet.cabinet.domain.Location;

/**
 * 대여 시작 이벤트 클래스
 */
@ToString
@Getter
public class LentStartEvent {
	//TO-DO : 직관적인 이해를 위해서 부득이하게 event 패키지에 위치시켰습니다. 이후에 해당하는 도메인으로 변경해야 합니다.
	/**
	 * 메일링 및 알림을 위한 정보들을 가집니다.
	 */
	private final String name;
	private final String email;
	private final Date expiredAt;
	private final Location location;
	private final Integer visibleNum;


	protected LentStartEvent(String name, String email, Date expiredAt, Location location,
			Integer visibleNum) {
		this.name = name;
		this.email = email;
		this.expiredAt = expiredAt;
		this.location = location;
		this.visibleNum = visibleNum;
	}

	/**
	 * 대여 시작 이벤트를 생성합니다.
	 * <p>
	 * 이벤트 생성에서 익셉션을 발생시키면 서비스 로직에 영향을 주므로,
	 * <br>
	 * 이벤트 리스너에서 따로 처리하도록 합니다.
	 *
	 * @param name      대여자 이름
	 * @param email     대여자 이메일
	 * @param expiredAt 대여 만료일
	 * @param location  대여한 캐비넷 위치 정보
	 * @return 이벤트
	 */
	public static LentStartEvent of(String name, String email, Date expiredAt, Location location,
			Integer visibleNum) {
		return new LentStartEvent(name, email, expiredAt, location, visibleNum);
	}
}

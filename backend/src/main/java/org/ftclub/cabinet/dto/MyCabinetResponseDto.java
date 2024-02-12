package org.ftclub.cabinet.dto;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;

/**
 * 내가 대여 중인 사물함의 정보와 그 사물함의 대여 정보들을 반환하는 DTO입니다.
 */
@AllArgsConstructor
@Getter
@Setter
@ToString
public class MyCabinetResponseDto {

	private Long cabinetId;
	private Integer visibleNum;
	private LentType lentType;
	private Integer maxUser;
	private String title;
	private String memo;
	private CabinetStatus status;
	private String statusNote;
	@JsonUnwrapped
	private Location location;
	private List<LentDto> lents;
	// 공유사물함에 필요한 정보
	private String shareCode;
	private LocalDateTime sessionExpiredAt;
	private String previousUserName;
}

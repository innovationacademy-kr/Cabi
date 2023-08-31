package org.ftclub.cabinet.redis;

import lombok.Getter;

@Getter
//@RedisHash(timeToLive = 60 * 60 * 24)
public class TicketingCabinet {

	//	@Id
//	private String id;	// hashKey
//	private String cabinetId;
	private String userNameOrUserCount;    // hashKey
	private Integer wrongPasswordCountOrUserCount;

	public TicketingCabinet(String userNameOrUserCount, Integer wrongPasswordCountOrUserCount) {
//		this.cabinetId = cabinetId;
//		this.id = id;
		this.userNameOrUserCount = userNameOrUserCount;
		this.wrongPasswordCountOrUserCount = wrongPasswordCountOrUserCount;
	}
}
package org.ftclub.cabinet.redis;

import lombok.Getter;
import org.springframework.data.redis.core.RedisHash;

import javax.persistence.Id;
import java.time.LocalDateTime;

@Getter
//@RedisHash(timeToLive = 60 * 60 * 24)
public class TicketingCabinet {

//	@Id
//	private String id;	// hashKey
//	private String cabinetId;
	private String userNameOrUserCount;	// hashKey
	private Integer wrongPasswordCountOrUserCount;

	public TicketingCabinet(String userNameOrUserCount, Integer wrongPasswordCountOrUserCount) {
//		this.cabinetId = cabinetId;
//		this.id = id;
		this.userNameOrUserCount = userNameOrUserCount;
		this.wrongPasswordCountOrUserCount = wrongPasswordCountOrUserCount;
//		this.createdAt = LocalDateTime.now();
	}
}
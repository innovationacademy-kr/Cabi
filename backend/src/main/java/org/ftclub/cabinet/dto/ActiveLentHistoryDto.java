package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ActiveLentHistoryDto {

	private final Long userId;
	private final String name;
	private final String email;
	private final Long cabinetId;
	private final Boolean isExpired;
	private final Long daysLeftFromExpireDate;

	@Override
	public String toString() {
		return "ActiveLentHistoryDto [userId=" + userId + ", name=" + name + ", email=" + email
				+ ", cabinetId="
				+ cabinetId + ", isExpired=" + isExpired + ", daysLeftFromExpireDate="
				+ daysLeftFromExpireDate + "]";
	}
}

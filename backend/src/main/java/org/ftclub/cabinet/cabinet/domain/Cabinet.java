package org.ftclub.cabinet.cabinet.domain;

import static org.ftclub.cabinet.exception.ExceptionStatus.INVALID_ARGUMENT;
import static org.ftclub.cabinet.exception.ExceptionStatus.INVALID_STATUS;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.utils.ExceptionUtil;

import javax.persistence.*;
import java.util.List;
import java.util.Objects;

import static org.ftclub.cabinet.exception.ExceptionStatus.INVALID_ARGUMENT;
import static org.ftclub.cabinet.exception.ExceptionStatus.INVALID_STATUS;

/**
 * 사물함 엔티티
 */
@Entity
@Table(name = "CABINET")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@ToString(exclude = {"cabinetPlace", "lentHistories"})
@Log4j2
public class Cabinet {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "CABINET_ID")
	private Long cabinetId;

	/**
	 * 실물로 표시되는 번호입니다.
	 */
	@Column(name = "VISIBLE_NUM")
	private Integer visibleNum;

	/**
	 * {@link CabinetStatus}
	 */
	@Enumerated(value = EnumType.STRING)
	@Column(name = "STATUS", length = 32, nullable = false)
	private CabinetStatus status;

	/**
	 * {@link LentType}
	 */
	@Enumerated(value = EnumType.STRING)
	@Column(name = "LENT_TYPE", length = 16, nullable = false)
	private LentType lentType;

	@Column(name = "MAX_USER", nullable = false)
	private Integer maxUser;

	/**
	 * 사물함의 상태에 대한 메모입니다. 주로 고장 사유를 적습니다.
	 */
	@Column(name = "STATUS_NOTE", length = 64)
	private String statusNote;

	/**
	 * {@link Grid}
	 */
	@Embedded
	private Grid grid;

	/**
	 * 서비스에서 나타내지는 사물함의 제목입니다.
	 */
	@Column(name = "TITLE", length = 64)
	private String title;

	/**
	 * 서비스에서 나타내지는 사물함의 메모입니다.
	 */
	@Column(name = "MEMO", length = 64)
	private String memo;

	/**
	 * {@link CabinetPlace}
	 */
	@ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
	@JoinColumn(name = "CABINET_PLACE_ID")
	private CabinetPlace cabinetPlace;

	@OneToMany(mappedBy = "cabinet",
			targetEntity = LentHistory.class,
			cascade = CascadeType.ALL,
			fetch = FetchType.LAZY)
	private List<LentHistory> lentHistories;

	protected Cabinet(Integer visibleNum, CabinetStatus status, LentType lentType, Integer maxUser,
	                  Grid grid, CabinetPlace cabinetPlace) {
		this.visibleNum = visibleNum;
		this.status = status;
		this.lentType = lentType;
		this.maxUser = maxUser;
		this.grid = grid;
		this.cabinetPlace = cabinetPlace;
		this.title = "";
		this.memo = "";
	}

	public static Cabinet of(Integer visibleNum, CabinetStatus status, LentType lentType,
	                         Integer maxUser,
	                         Grid grid, CabinetPlace cabinetPlace) {
		Cabinet cabinet = new Cabinet(visibleNum, status, lentType, maxUser, grid, cabinetPlace);
		ExceptionUtil.throwIfFalse(cabinet.isValid(), new DomainException(INVALID_ARGUMENT));
		return cabinet;
	}

	private boolean isValid() {
		return (visibleNum >= 0 && maxUser >= 0 && grid != null && cabinetPlace != null
				&& status != null && lentType != null);
	}

	public boolean isStatus(CabinetStatus cabinetStatus) {
		return this.status.equals(cabinetStatus);
	}

	public boolean isLentType(LentType lentType) {
		return this.lentType.equals(lentType);
	}

	public boolean isVisibleNum(Integer visibleNum) {
		return this.visibleNum.equals(visibleNum);
	}

	public boolean isCabinetPlace(CabinetPlace cabinetPlace) {
		return this.cabinetPlace.equals(cabinetPlace);
	}

	public void specifyCabinetPlace(CabinetPlace cabinetPlace) {
		log.info("setCabinetPlace : {}", cabinetPlace);
		this.cabinetPlace = cabinetPlace;
	}

	public void assignVisibleNum(Integer visibleNum) {
		log.info("assignVisibleNum : {}", visibleNum);
		this.visibleNum = visibleNum;
		ExceptionUtil.throwIfFalse(this.isValid(), new DomainException(INVALID_STATUS));
	}

	public void specifyStatus(CabinetStatus cabinetStatus) {
		log.info("specifyStatus : {}", cabinetStatus);
		this.status = cabinetStatus;
		ExceptionUtil.throwIfFalse(this.isValid(), new DomainException(INVALID_STATUS));
	}

	public void specifyMaxUser(Integer maxUser) {
		log.info("specifyMaxUser : {}", maxUser);
		this.maxUser = maxUser;
		ExceptionUtil.throwIfFalse(this.isValid(), new DomainException(INVALID_STATUS));
	}

	public void writeStatusNote(String statusNote) {
		log.info("writeStatusNote : {}", statusNote);
		this.statusNote = statusNote;
		ExceptionUtil.throwIfFalse(this.isValid(), new DomainException(INVALID_STATUS));
	}

	public void specifyLentType(LentType lentType) {
		log.info("specifyLentType : {}", lentType);
		this.lentType = lentType;
		ExceptionUtil.throwIfFalse(this.isValid(), new DomainException(INVALID_STATUS));
	}

	public void writeTitle(String title) {
		log.info("writeTitle : {}", title);
		this.title = title;
		ExceptionUtil.throwIfFalse(this.isValid(), new DomainException(INVALID_STATUS));
	}

	public void coordinateGrid(Grid grid) {
		log.info("coordinateGrid : {}", grid);
		this.grid = grid;
		ExceptionUtil.throwIfFalse(this.isValid(), new DomainException(INVALID_STATUS));
	}

	public void writeMemo(String memo) {
		log.info("writeMemo : {}", memo);
		this.memo = memo;
		ExceptionUtil.throwIfFalse(this.isValid(), new DomainException(INVALID_STATUS));
	}

	@Override
	public boolean equals(final Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof Cabinet)) {
			return false;
		}
		return this.cabinetId.equals(((Cabinet) other).cabinetId);
	}

	@Override
	public int hashCode() {
		return Objects.hash(this.cabinetId);
	}

	/**
	 * 대여 시작/종료에 따른 사용자의 수와 현재 상태에 따라 상태를 변경합니다.
	 *
	 * @param userCount 현재 사용자 수
	 */
	public void specifyStatusByUserCount(Integer userCount) {
		log.info("specifyStatusByUserCount : {}", userCount);
		if (this.status.equals(CabinetStatus.BROKEN)) {
			throw new DomainException(INVALID_STATUS);
		}
		if (userCount.equals(0)) {
			this.status = CabinetStatus.AVAILABLE;
			return;
		}
		if (userCount.equals(this.maxUser)) {
			this.status = CabinetStatus.FULL;
			return;
		}
		if (0 < userCount && userCount < this.maxUser) {
			if (this.status.equals(CabinetStatus.FULL)) {
				this.status = CabinetStatus.LIMITED_AVAILABLE;
			}
		}
	}
}

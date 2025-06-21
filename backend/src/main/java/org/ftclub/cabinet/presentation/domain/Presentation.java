package org.ftclub.cabinet.presentation.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.presentation.dto.PresentationUpdateData;
import org.ftclub.cabinet.user.domain.User;

@Entity
@Getter
@Table(name = "PRESENTATION")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Presentation {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "USER_ID", nullable = false)
	private User user;

	@Enumerated(value = EnumType.STRING)
	@Column(name = "CATEGORY", nullable = false)
	private Category category;

	@Enumerated(value = EnumType.STRING)
	@Column(name = "DURATION", nullable = false)
	private Duration duration;

	@Column(name = "TITLE", length = 50, nullable = false)
	private String title;

	@Column(name = "SUMMARY", length = 100, nullable = false)
	private String summary;

	// TODO: 추가된 column으로 dev to main 시, main-db의 data 넣어야 함
	@Column(name = "OUTLINE", length = 500, nullable = false)
	private String outline;

	@Lob
	@Column(name = "DETAIL", length = 10000, nullable = false)
	private String detail;

	@Column(name = "CANCELED", nullable = false)
	private boolean canceled = false;

	@Column(name = "THUMBNAIL_S3_KEY", length = 2048)
	private String thumbnailS3Key;

	@Column(name = "VIDEO_LINK", length = 2048)
	private String videoLink;

	@Column(name = "RECORDING_ALLOWED", nullable = false)
	private boolean recordingAllowed = false;

	@Column(name = "PUBLIC_ALLOWED", nullable = false)
	private boolean publicAllowed = false;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "PRESENTATION_SLOT_ID")
	private PresentationSlot slot;

	@Column(name = "START_TIME", nullable = false)
	private LocalDateTime startTime;

	@Enumerated(value = EnumType.STRING)
	@Column(name = "PRESENTATION_LOCATION", nullable = false)
	private PresentationLocation presentationLocation;


	@OneToMany(mappedBy = "presentation")
	private final List<PresentationComment> presentationComments = new ArrayList<>();

	@OneToMany(mappedBy = "presentation")
	private final List<PresentationLike> presentationLikes = new ArrayList<>();

	public static Presentation of(User user, Category category, Duration duration,
			String title, String summary, String outline, String detail,
			String thumbnailS3Key, boolean recodingAllowed, boolean publicAllowed,
			PresentationSlot slot) {
		Presentation presentation = new Presentation(user, category, duration,
				title, summary, outline, detail,
				thumbnailS3Key, null, recodingAllowed, publicAllowed,
				slot, slot.getStartTime(), slot.getPresentationLocation());
		if (!presentation.isValid()) {
			throw ExceptionStatus.INVALID_ARGUMENT.asDomainException();
		}
		return presentation;
	}

	protected Presentation(User user, Category category, Duration duration,
			String title, String summary, String outline, String detail,
			String thumbnailS3Key, String videoLink,
			boolean recordingAllowed, boolean publicAllowed,
			PresentationSlot slot,
			LocalDateTime startTime, PresentationLocation presentationLocation) {
		this.user = user;
		this.category = category;
		this.duration = duration;
		this.title = title;
		this.summary = summary;
		this.outline = outline;
		this.detail = detail;
		this.thumbnailS3Key = thumbnailS3Key;
		this.videoLink = videoLink;
		this.recordingAllowed = recordingAllowed;
		this.publicAllowed = publicAllowed;
		this.slot = slot;
		this.startTime = startTime;
		this.presentationLocation = presentationLocation;
	}

	/**
	 * 프레젠테이션의 슬롯과 연결된 내용을 변경합니다.
	 * <p>
	 * 변경된 슬롯의 시작 시간과 발표 장소를 프레젠테이션에 반영합니다. (중복 엔티티)
	 * </p>
	 *
	 * @param startTime            시작 시간
	 * @param presentationLocation 발표 장소
	 */
	public void changeSlotContents(LocalDateTime startTime,
			PresentationLocation presentationLocation) {
		this.startTime = startTime;
		this.presentationLocation = presentationLocation;
	}

	/**
	 * 프레젠테이션을 수정합니다.
	 * <p>
	 * PresentationUpdateData 내부의 toUpdate 필드에 따라 수정합니다.
	 * </p>
	 *
	 * @param data 프레젠테이션 수정 데이터
	 */
	public void update(PresentationUpdateData data) {
		this.category = data.getCategory();
		this.duration = data.getDuration();
		this.title = data.getTitle();
		this.summary = data.getSummary();
		this.outline = data.getOutline();
		this.detail = data.getDetail();
		this.videoLink = data.getVideoLink();
		this.recordingAllowed = data.isRecordingAllowed();
		this.publicAllowed = data.isPublicAllowed();
		this.thumbnailS3Key = data.getThumbnailS3Key();
	}

	/**
	 * 프레젠테이션을 취소합니다.
	 * <p>
	 * 연결된 slot을 삭제합니다. 취소 시, 되돌릴 수 없습니다.
	 * </p>
	 */
	public void cancel() {
		if (this.canceled) {
			throw ExceptionStatus.PRESENTATION_ALREADY_CANCELED.asDomainException();
		}
		this.canceled = true;
		this.slot = null;
	}

	/**
	 * 프레젠테이션이 유효한지 검사합니다.
	 * <p>
	 * 객체가 생성될 때에만 유효성을 검사합니다.
	 * </p>
	 *
	 * @return 유효성 검사 결과
	 */
	private boolean isValid() {
		return (user != null && category != null && duration != null
				&& title != null && !title.isBlank() && title.length() <= 50
				&& summary != null && !summary.isBlank() && summary.length() <= 100
				&& outline != null && !outline.isBlank() && outline.length() <= 500
				&& detail != null && !detail.isBlank() && detail.length() <= 10000
				&& slot != null);
	}
}

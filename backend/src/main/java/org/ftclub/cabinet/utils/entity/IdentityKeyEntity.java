package org.ftclub.cabinet.utils.entity;


import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.PostLoad;
import javax.persistence.PostPersist;
import javax.persistence.Transient;
import org.hibernate.proxy.HibernateProxy;
import org.springframework.data.domain.Persistable;

@MappedSuperclass
abstract public class IdentityKeyEntity implements Persistable<Long> {

	@Column(name = "ID")
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id = null;

	@Transient
	private Boolean isNew = true;

	@Override
	public Long getId() {
		return id;
	}
	

	@Override
	public boolean isNew() {
		return isNew;
	}

	@Override
	public boolean equals(Object o) {
		if (o == null || getId() == null) {
			return false;
		}
		if (!(o instanceof HibernateProxy)
				&& this.getClass() != o.getClass()) {
			return false;
		}
		Serializable oid = o instanceof HibernateProxy
				? ((HibernateProxy) o).getHibernateLazyInitializer().getIdentifier() :
				((IdentityKeyEntity) o).getId();
		return getId() == oid;
	}

	@Override
	public int hashCode() {
		return id.hashCode();
	}

	@PostLoad
	@PostPersist
	protected void markNotNew() {
		this.isNew = false;
	}
}

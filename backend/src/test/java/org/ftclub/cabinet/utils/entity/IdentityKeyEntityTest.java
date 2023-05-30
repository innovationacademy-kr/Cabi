package org.ftclub.cabinet.utils.entity;

import static org.assertj.core.api.Assertions.assertThat;

import javax.persistence.Entity;
import javax.persistence.Table;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.test.autoconfigure.core.AutoConfigureCache;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureTestEntityManager;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

@EntityScan(basePackageClasses = IdentityKeyEntityTest.class)
@ExtendWith(SpringExtension.class)
@EnableAutoConfiguration
@Transactional
@AutoConfigureCache
@AutoConfigureDataJpa
@AutoConfigureTestDatabase
@AutoConfigureTestEntityManager
class IdentityKeyEntityTest {

	@Entity
	@Table(name = "TEST_ENTITY")
	static class TestEntity extends IdentityKeyEntity {

		public TestEntity() {
		}
	}

	@Autowired
	TestEntityManager em;

	@Test
	@DisplayName("id가 잘 들어가는지 확인")
	void injectionIdTest() {
		TestEntity entity1 = new TestEntity();
		em.persist(entity1);
		em.flush();
		assertThat(entity1.getId()).isNotNull();
	}

	@Test
	@DisplayName("같은 엔티티 확인")
	void sameEntity() {
		TestEntity entity1 = new TestEntity();
		em.persist(entity1);
		em.flush();
		TestEntity entity2 = em.find(TestEntity.class, entity1.getId());
		assertThat(entity1).isEqualTo(entity2);
	}

	@Test
	@DisplayName("다른 엔티티 확인")
	void different() {
		TestEntity entity1 = new TestEntity();
		em.persist(entity1);
		TestEntity entity2 = new TestEntity();
		em.persist(entity2);
		em.flush();
		assertThat(entity1).isNotEqualTo(entity2);
	}

	@Test
	@DisplayName("persist안된 객체 확인")
	void notPersist() {
		TestEntity entity1 = new TestEntity();
		TestEntity entity2 = new TestEntity();
		assertThat(entity1).isNotEqualTo(entity2);
	}

	@Test
	@DisplayName("persist된 객체 비교")
	void persistSame() {
		TestEntity entity1 = new TestEntity();
		em.persist(entity1);
		em.flush();
		TestEntity target1 = em.find(TestEntity.class, entity1.getId());
		TestEntity target2 = em.find(TestEntity.class, entity1.getId());

		assertThat(target1).isEqualTo(target2);
	}
}
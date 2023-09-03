package utils

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonSetter
import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import org.jetbrains.exposed.sql.Database

/**
 * hikari cp를 사용하는 db manager.
 * 쿼리 전에 connect()를 호출해야 한다.
 * @see connect
 */
class DbManager {
    private val dataSource: HikariDataSource

    init {
        val dbConfig = ConfigLoader.create(DbManagerConfig::class)
        val config = HikariConfig().apply {
            setDriverClassName(dbConfig.driverClassName)
            jdbcUrl = dbConfig.url
            username = dbConfig.username
            password = dbConfig.password
        }
        dataSource = HikariDataSource(config)
    }

    /**
     * Database.connect()를 호출한다.
     * - db query가 필요하다면 실행하기 전에 반드시 호출해야 한다.
     * @see Database.connect
     */
    fun connect() {
        Database.connect(dataSource)
    }
}

/**
 * A configuration of DbManager.
 *
 * @param url The database url.
 * @param driverClassName The driver class name.
 * @param username The username.
 * @param password The password.
 */
data class DbManagerConfig
@JsonCreator(mode = JsonCreator.Mode.PROPERTIES)
constructor(
    @JsonSetter("url")
    val url: String,
    @JsonSetter("driverClassName")
    val driverClassName: String,
    @JsonSetter("username")
    val username: String,
    @JsonSetter("password")
    val password: String
): Configuration

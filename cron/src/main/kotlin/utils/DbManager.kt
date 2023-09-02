package utils

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonSetter
import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import org.jetbrains.exposed.sql.Database

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

    fun connect() {
        Database.connect(dataSource)
    }
}

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

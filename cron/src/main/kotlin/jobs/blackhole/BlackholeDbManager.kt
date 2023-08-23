package jobs.blackhole

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonSetter
import jobs.Configuration
import org.jetbrains.exposed.sql.Database
import utils.ConfigLoader

interface BlackholeDbManager {
    companion object {
        @JvmStatic fun create(): BlackholeDbManager {
            val config = ConfigLoader.create(BlackholeDbConfig::class)
            return BlackholeDbManagerImpl(config)
        }
    }
}

class BlackholeDbManagerImpl(config: BlackholeDbConfig): BlackholeDbManager {
    init {
        Database.connect(
            url = config.url,
            driver = config.driverClassName,
            user = config.user,
            password = config.password
        )
    }
}

data class BlackholeDbConfig
@JsonCreator(mode = JsonCreator.Mode.PROPERTIES)
constructor(
    @JsonSetter("url")
    val url: String,
    @JsonSetter("driverClassName")
    val driverClassName: String,
    @JsonSetter("user")
    val user: String,
    @JsonSetter("password")
    val password: String
): Configuration

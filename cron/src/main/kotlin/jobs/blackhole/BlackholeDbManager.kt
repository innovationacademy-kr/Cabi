package jobs.blackhole

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonSetter
import com.squareup.okhttp.internal.Internal.logger
import jobs.Configuration
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.StdOutSqlLogger
import org.jetbrains.exposed.sql.addLogger
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction
import utils.ConfigLoader
import java.sql.ResultSet

interface BlackholeDbManager {
    companion object {
        @JvmStatic fun create(): BlackholeDbManager {
            val config = ConfigLoader.create(BlackholeDbConfig::class)
            return BlackholeDbManagerImpl(config)
        }
    }
    fun connectionTest(): String
}

class BlackholeDbManagerImpl(config: BlackholeDbConfig): BlackholeDbManager {
    init {
        println("${config.url}, ${config.driverClassName}, ${config.username}, ${config.password}")
        Database.connect(
            url = config.url,
            driver = config.driverClassName,
            user = config.username,
            password = config.password
        )
    }

    override fun connectionTest(): String {
        var result: ResultSet? = null
        transaction {
            addLogger(StdOutSqlLogger)
            val conn = TransactionManager.current().connection
            val query = "select name from user where user_id = 1"
            result = conn.prepareStatement(query,false).executeQuery()
        }
        result!!.next()
        return result!!.getString("name")
    }
}

data class BlackholeDbConfig
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

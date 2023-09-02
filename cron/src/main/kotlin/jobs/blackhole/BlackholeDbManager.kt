package jobs.blackhole

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.javatime.datetime
import org.jetbrains.exposed.sql.transactions.transaction
import utils.DbManager
import java.time.LocalDateTime

private object Users : Table("user") {
    val userId: Column<Long> = long("user_id").autoIncrement()
    val name: Column<String> = varchar("name", 100)
    val email: Column<String> = varchar("email", 100)
    val role: Column<String> = varchar("role", 100)
    val blackholedAt: Column<LocalDateTime?> = datetime("blackholed_at").nullable()
    val deletedAt: Column<LocalDateTime?>  = datetime("deleted_at").nullable()
}

private fun ResultRow.toUserProfile() =
    UserProfile(
        name = this[Users.name],
        email = this[Users.email],
        blackholedAt = this[Users.blackholedAt],
    )


class BlackholeDbManager {
    private val dbManager: DbManager = DbManager()

    fun filterRequiredUpdate(users: List<UserProfile>): List<UserProfile> {
        dbManager.connect()
        val queryRst: ArrayList<UserProfile> = ArrayList()
        transaction {
            addLogger(StdOutSqlLogger)
            Users.select { Users.email inList users.map { it.email } }
                .forEach { queryRst.add(it.toUserProfile()) }
        }
        return users.filter { user ->
            queryRst.stream().anyMatch {
                (it.email == user.email)
                    .and(it.name == user.name)
                    .and(it.blackholedAt != user.blackholedAt)
        }}
    }

    fun updateBlackholedUsers(users: List<UserProfile>) {
        dbManager.connect()
        transaction {
            addLogger(StdOutSqlLogger)
            users.forEach { user ->
                Users.update({ (Users.email eq user.email) and (Users.name eq user.name) }) {
                    it[Users.blackholedAt] = user.blackholedAt
                }
            }
        }
    }
}

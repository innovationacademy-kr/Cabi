import jobs.blackhole.BlackholeChecker
import kotlin.system.exitProcess

fun main(args: Array<String>) {
    try {
        BlackholeChecker.create().getBlackholeIds().let { println(it) }
    } catch (e: Exception) {
        println(e.message)
        exitProcess(1)
    }
}
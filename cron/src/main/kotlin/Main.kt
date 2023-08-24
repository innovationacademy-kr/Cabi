import jobs.blackhole.BlackholeChecker
import kotlin.system.exitProcess

fun main(args: Array<String>) {
    println("Start!")
    try {
        BlackholeChecker.create().sprint().let { println(it) }
    } catch (e: Exception) {
        println(e.message)
        exitProcess(1)
    }
}
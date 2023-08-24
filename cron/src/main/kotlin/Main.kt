import jobs.blackhole.BlackholeChecker
import jobs.blackhole.BlackholeDbManager
import kotlin.system.exitProcess

fun main(args: Array<String>) {
    println("Start!")
    try {
        BlackholeDbManager.create().connectionTest()
            .let {
                println(it)
            }
    } catch (e: Exception) {
        println(e.message)
        exitProcess(1)
    }
}
package utils

/**
 * job sprinter
 * main 함수에서 job을 실행할 때 사용한다.
 * @param T
 */
fun interface Sprinter<T> {
    /**
     * job sprint
     * @return T
     * @throws Exception
     */
    fun sprint(): T
}
package com.healthcarelocator.utils

import java.util.concurrent.AbstractExecutorService
import java.util.concurrent.Executor
import java.util.concurrent.ExecutorService
import java.util.concurrent.TimeUnit

object Utils {
    fun immediateExecutorService(): ExecutorService {
        return object : AbstractExecutorService() {
            override fun shutdown() = Unit

            override fun shutdownNow(): List<Runnable>? = null

            override fun isShutdown(): Boolean = false

            override fun isTerminated(): Boolean = false

            @Throws(InterruptedException::class)
            override fun awaitTermination(l: Long, timeUnit: TimeUnit): Boolean = false

            override fun execute(runnable: Runnable) = runnable.run()
        }
    }

    fun immediateExecutor(): Executor {
        return Executor { command -> command.run() }
    }
}
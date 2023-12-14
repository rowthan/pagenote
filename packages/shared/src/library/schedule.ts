interface FrequencyOption {
    name?: string
    duration: number // 调用控制周期
    limit: number // 周期限制调用次数
    parallel: number // 1s内并发运行个数
    parallelDuration?: number // 并发统计周期，默认 200 ,单位 ms
}

interface RunListener<T> {
    (taskId: T): void
}

interface Task {
    (): any
}

interface TaskMeta {
    taskId: string
    startTime: number
    endTime: number
}

interface TaskOption {
    rightNow?: boolean
    block?: boolean
    taskId?: string
}

interface TaskQuenItem {
    options: TaskOption
    initTime: number
}

const defaultFrequency = function (): FrequencyOption {
    return {
        duration: 10 * 1000, // 调用控制周期
        limit: 10, // 周期限制调用次数
        parallel: 3, // 1s内并发运行个数
    }
}

enum SCHEDULE_STATUS {
    pause = 0,
    running = 1,
    no_task = -1,
}

const PARALLEL_DURATION = 200

// 根据限制条件、已运行历史 判断是否可放行
const checkRelease = function (
    limitSetting: FrequencyOption,
    taskHistory: TaskMeta[]
): boolean {
    const currentTime = new Date().getTime()

    const {
        duration,
        limit,
        parallel,
        parallelDuration = PARALLEL_DURATION,
    } = limitSetting

    const parallelLast = taskHistory[parallel - 1]
    if (parallelLast && currentTime - parallelLast.startTime < parallelDuration) {
        return false
    }

    // 数第1个任务
    const firstHistory = taskHistory[limit - 1]
    // 总执行任务数，少于限制数量，放行
    if (!firstHistory) {
        return true
    }

    // 第一个任务的开始时间
    const firstTaskRunTime = firstHistory.startTime

    const fromNow = currentTime - firstTaskRunTime
    //
    if (fromNow > duration) {
        return true
    }

    // 不放行
    return false
}

// 方法运行调度器
class Schedule {
    public frequency = defaultFrequency()
    public retryTimeout = 8000
    public progressListener: RunListener<any>[] = []
    public listener: Record<string, RunListener<any>>
    public history: TaskMeta[]
    public taskQuen: TaskQuenItem[]
    public status: SCHEDULE_STATUS
    public taskIdIndex: number
    public taskFunMap: Record<string, Task> = {}
    public nextTimer: NodeJS.Timeout
    private pauseBefore: number // 在此时间前暂停执行

    constructor(frequency: FrequencyOption) {
        this.frequency = frequency
        this.retryTimeout = Math.max(
            1,
            Math.min(
                frequency.duration / frequency.limit,
                frequency.parallelDuration / frequency.parallel
            )
        )
        this.progressListener = []
        this.listener = {}
        this.history = []
        this.taskQuen = []
        this.status = SCHEDULE_STATUS.no_task
        this.pauseBefore = 0
    }

    // 添加方法
    addFun<T>(fun: Task, options: TaskOption): Promise<T> {
        const {rightNow, block, taskId} = options || {}
        if (typeof fun !== 'function') {
            return Promise.resolve(null)
        }
        // 根据 taskId 判断是否已经在队列中，避免重复请求
        const uniqueTaskId = taskId || this.taskIdIndex.toString()

        const task: TaskQuenItem = {
            options: {
                block,
                rightNow,
                taskId: uniqueTaskId,
            },
            initTime: Date.now(),
        }

        // 不存在老方法时，追加task
        if (this.taskFunMap[taskId] === undefined) {
            // 进入运行队列
            if (rightNow) {
                this.taskQuen.unshift(task)
            } else {
                this.taskQuen.push(task)
            }
        }
        // id 递增 避免重复taskid
        this.taskIdIndex++

        this.taskFunMap[taskId] = fun

        const responsePromise: Promise<T> = new Promise((resolve) => {
            this.addRunListener(function (result: T) {
                resolve(result)
            }, uniqueTaskId)
        })

        this.runFun()
        return responsePromise
    }

    runFun(): boolean {
        // 无待办
        if (this.taskQuen.length === 0) {
            this.status = SCHEDULE_STATUS.no_task
            clearTimeout(this.nextTimer)
            this.nextTimer = null
            return false
        }
        if (this.pauseBefore) {
            const diff = this.pauseBefore - Date.now()
            if (diff > 0) {
                clearTimeout(this.nextTimer)
                this.nextTimer = setTimeout(() => {
                    this.runFun()
                }, diff)
                return false
            }
        }

        if (this.history.length > this.frequency.limit * 2) {
            // 删除历史记录，避免内存移除
            this.history.splice(this.frequency.limit)
        }

        const currentTask = this.taskQuen[0]
        const releaseResult = checkRelease(this.frequency, this.history)
        this.status = releaseResult
            ? SCHEDULE_STATUS.running
            : SCHEDULE_STATUS.pause
        if (releaseResult) {
            const newHistory: TaskMeta = {
                taskId: currentTask.options.taskId,
                startTime: new Date().getTime(),
                endTime: 0,
            }
            this.history.unshift(newHistory)
            this.taskQuen.splice(0, 1)

            let currentTaskResult
            try {
                currentTaskResult = this.taskFunMap[currentTask.options.taskId]()
            } catch (e) {
                // 即便执行异常 也释放任务，由外部自行决定是否重试
                console.warn(
                    '传入方法执行错误，不会重试。请在外部 catch 后检查是否需要重新加入任务列表',
                    currentTask
                )
                throw new Error(e)
            }
            delete this.taskFunMap[currentTask.options.taskId]

            // 释放listener，避免内存溢出
            const listen = this.listener[currentTask.options.taskId]
            typeof listen === 'function' && listen(currentTaskResult)
            this.progressListener.forEach(function (fn) {
                fn(currentTask.options.taskId)
            })
            delete this.listener[currentTask.options.taskId]

            newHistory.endTime = new Date().getTime()
            this.runFun()
            return true
        } else {
            clearTimeout(this.nextTimer)
            // 等一下再试
            this.nextTimer = setTimeout(() => {
                this.runFun()
            }, this.retryTimeout)
            return false
        }
    }

    // listener
    addRunListener<T>(callback: RunListener<T>, taskId: string) {
        if (typeof callback !== 'function') {
            return
        }
        if (taskId === undefined) {
            this.progressListener.push(callback)
        } else {
            this.listener[taskId] = callback
        }
    }

    // 暂停执行
    pauseFun(duration: number) {
        this.pauseBefore = Date.now() + duration
    }

    // 计算剩余任务时长，计算某个任务需要多久可执行
    // computeTime(taskId?: string): number {
    //
    // }
}

export type {Task, TaskOption}

export default Schedule

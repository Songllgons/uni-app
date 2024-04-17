/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @file
 * @kit ArkTS
 */
/**
 * JS cross-thread task executor.
 *
 * @namespace taskpool
 * @syscap SystemCapability.Utils.Lang
 * @since 9
 */
/**
 * JS cross-thread task executor.
 *
 * @namespace taskpool
 * @syscap SystemCapability.Utils.Lang
 * @crossplatform
 * @since 10
 */
/**
 * JS cross-thread task executor.
 *
 * @namespace taskpool
 * @syscap SystemCapability.Utils.Lang
 * @crossplatform
 * @atomicservice
 * @since 11
 */
declare namespace taskpool {
    /**
     * The Priority defines the task priority.
     *
     * @enum { number } Priority
     * @syscap SystemCapability.Utils.Lang
     * @since 9
     */
    /**
     * The Priority defines the task priority.
     *
     * @enum { number } Priority
     * @syscap SystemCapability.Utils.Lang
     * @crossplatform
     * @since 10
     */
    /**
     * The Priority defines the task priority.
     *
     * @enum { number } Priority
     * @syscap SystemCapability.Utils.Lang
     * @crossplatform
     * @atomicservice
     * @since 11
     */
    enum Priority {
        /**
         * set task priority to high.
         *
         * @syscap SystemCapability.Utils.Lang
         * @since 9
         */
        /**
         * set task priority to high.
         *
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @since 10
         */
        /**
         * set task priority to high.
         *
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        HIGH = 0,
        /**
         * set task priority to medium.
         *
         * @syscap SystemCapability.Utils.Lang
         * @since 9
         */
        /**
         * set task priority to medium.
         *
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @since 10
         */
        /**
         * set task priority to medium.
         *
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        MEDIUM = 1,
        /**
         * set task priority to low.
         *
         * @syscap SystemCapability.Utils.Lang
         * @since 9
         */
        /**
         * set task priority to low.
         *
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @since 10
         */
        /**
         * set task priority to low.
         *
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        LOW = 2
    }
    /**
     * The Task class provides an interface to create a task.
     *
     * @syscap SystemCapability.Utils.Lang
     * @since 9
     */
    /**
     * The Task class provides an interface to create a task.
     *
     * @syscap SystemCapability.Utils.Lang
     * @crossplatform
     * @since 10
     */
    /**
     * The Task class provides an interface to create a task.
     *
     * @syscap SystemCapability.Utils.Lang
     * @crossplatform
     * @atomicservice
     * @since 11
     */
    class Task {
        /**
         * Create a Task instance.
         *
         * @param { Function } func - func func Concurrent function to execute in taskpool.
         * @param { unknown[] } args - args args The concurrent function arguments.
         * @throws { BusinessError } 401 - The input parameters are invalid.
         * @throws { BusinessError } 10200014 - The function is not mark as concurrent.
         * @syscap SystemCapability.Utils.Lang
         * @since 9
         */
        /**
         * Create a Task instance.
         *
         * @param { Function } func - func func Concurrent function to execute in taskpool.
         * @param { unknown[] } args - args args The concurrent function arguments.
         * @throws { BusinessError } 401 - The input parameters are invalid.
         * @throws { BusinessError } 10200014 - The function is not mark as concurrent.
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @since 10
         */
        /**
         * Create a Task instance.
         *
         * @param { Function } func - func func Concurrent function to execute in taskpool.
         * @param { Object[] } args - args args The concurrent function arguments.
         * @throws { BusinessError } 401 - The input parameters are invalid.
         * @throws { BusinessError } 10200014 - The function is not mark as concurrent.
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        constructor(func: Function, ...args: Object[]);
        /**
         * Create a Task instance.
         *
         * @param { string } name - name name The name of Task.
         * @param { Function } func - func func Concurrent function to execute in taskpool.
         * @param { Object[] } args - args args The concurrent function arguments.
         * @throws { BusinessError } 401 - The input parameters are invalid.
         * @throws { BusinessError } 10200014 - The function is not mark as concurrent.
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        constructor(name: string, func: Function, ...args: Object[]);
        /**
         * Check current running Task is canceled or not.
         *
         * @returns { boolean } Returns {@code true} if current running task is canceled; returns {@code false} otherwise.
         * @static
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @since 10
         */
        /**
         * Check current running Task is canceled or not.
         *
         * @returns { boolean } Returns {@code true} if current running task is canceled; returns {@code false} otherwise.
         * @static
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        static isCanceled(): boolean;
        /**
         * Send data back to the host side and trigger the registered callback
         *
         * @param { Object[] } args - Data to be used as the input parameter of the registered callback.
         * @throws { BusinessError } 401 - The input parameters are invalid.
         * @throws { BusinessError } 10200006 - An exception occurred during serialization.
         * @throws { BusinessError } 10200022 - The function is not called in the taskpool thread.
         * @throws { BusinessError } 10200023 - The function is not called in the concurrent function.
         * @throws { BusinessError } 10200024 - The callback is not registered on the host side.
         * @static
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        static sendData(...args: Object[]): void;
        /**
         * Set transfer list for this task.
         *
         * @param { ArrayBuffer[] } [transfer] - transfer Transfer list of this task, empty array is default.
         * @throws { BusinessError } 401 - The input parameters are invalid.
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @since 10
         */
        /**
         * Set transfer list for this task.
         *
         * @param { ArrayBuffer[] } [transfer] - transfer Transfer list of this task, empty array is default.
         * @throws { BusinessError } 401 - The input parameters are invalid.
         * @throws { BusinessError } 10200029 - Can not set an arraybuffer to both transferList and cloneList.
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        setTransferList(transfer?: ArrayBuffer[]): void;
        /**
         * Set clone list for this task.
         *
         * @param { Object[] | ArrayBuffer[] } cloneList - Sendable objects or arrayBuffer objects in this list
         * will be transmitted to worker thread in a copy way.
         * @throws { BusinessError } 401 - The input parameters are invalid.
         * @throws { BusinessError } 10200029 - Can not set an arraybuffer to both transferList and cloneList.
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        setCloneList(cloneList: Object[] | ArrayBuffer[]): void;
        /**
         * Register a callback for this task to receive and handle data from the taskpool worker thread.
         *
         * @param { Function } [callback] - Callback to be registered and executed later on the host side.
         * @throws { BusinessError } 401 - The input parameters are invalid.
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        onReceiveData(callback?: Function): void;
        /**
         * Add dependencies on the task array for this task.
         *
         * @param { Task[] } tasks - tasks tasks An array of dependent tasks.
         * @throws { BusinessError } 401 - The input parameters are invalid.
         * @throws { BusinessError } 10200026 - There is a circular dependency.
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        addDependency(...tasks: Task[]): void;
        /**
         * Remove dependencies on the task array for this task.
         *
         * @param { Task[] } tasks - tasks tasks An array of dependent tasks.
         * @throws { BusinessError } 401 - The input parameters are invalid.
         * @throws { BusinessError } 10200027 - The dependency does not exist.
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        removeDependency(...tasks: Task[]): void;
        /**
         * Concurrent function to execute in taskpool.
         *
         * @syscap SystemCapability.Utils.Lang
         * @since 9
         */
        /**
         * Concurrent function to execute in taskpool.
         *
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @since 10
         */
        /**
         * Concurrent function to execute in taskpool.
         *
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        function: Function;
        /**
         * The concurrent function arguments.
         *
         * @syscap SystemCapability.Utils.Lang
         * @since 9
         */
        /**
         * The concurrent function arguments.
         *
         * @type { ?unknown[] }
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @since 10
         */
        /**
         * The concurrent function arguments.
         *
         * @type { ?Object[] }
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        arguments?: Object[];
        /**
         * Task name.
         *
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        name: string;
        /**
         * Total duration of task execution.
         *
         * @type { number }
         * @default 0
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        totalDuration: number;
        /**
         * IO duration of task execution.
         *
         * @type { number }
         * @default 0
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        ioDuration: number;
        /**
         * CPU duration of task execution.
         *
         * @type { number }
         * @default 0
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        cpuDuration: number;
    }
    /**
     * The TaskGroup class provides an interface to create a task group.
     *
     * @syscap SystemCapability.Utils.Lang
     * @crossplatform
     * @since 10
     */
    /**
     * The TaskGroup class provides an interface to create a task group.
     *
     * @syscap SystemCapability.Utils.Lang
     * @crossplatform
     * @atomicservice
     * @since 11
     */
    class TaskGroup {
        /**
         * Create a TaskGroup instance.
         *
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @since 10
         */
        /**
         * Create a TaskGroup instance.
         *
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        constructor();
        /**
         * Create a TaskGroup instance.
         *
         * @param { string } name - name name The name of taskGroup.
         * @throws { BusinessError } 401 - The input parameters are invalid.
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        constructor(name: string);
        /**
         * Add a Concurrent function into task group.
         *
         * @param { Function } func - func func Concurrent function to add in task group.
         * @param { unknown[] } args - args args The concurrent function arguments.
         * @throws { BusinessError } 401 - The input parameters are invalid.
         * @throws { BusinessError } 10200014 - The function is not mark as concurrent.
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @since 10
         */
        /**
         * Add a Concurrent function into task group.
         *
         * @param { Function } func - func func Concurrent function to add in task group.
         * @param { Object[] } args - args args The concurrent function arguments.
         * @throws { BusinessError } 401 - The input parameters are invalid.
         * @throws { BusinessError } 10200014 - The function is not mark as concurrent.
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        addTask(func: Function, ...args: Object[]): void;
        /**
         * Add a Task into TaskGroup.
         *
         * @param { Task } task - task task The task want to add in task group.
         * @throws { BusinessError } 401 - The input parameters are invalid.
         * @throws { BusinessError } 10200014 - The function is not mark as concurrent.
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @since 10
         */
        /**
         * Add a Task into TaskGroup.
         *
         * @param { Task } task - task task The task want to add in task group.
         * @throws { BusinessError } 401 - The input parameters are invalid.
         * @throws { BusinessError } 10200014 - The function is not mark as concurrent.
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        addTask(task: Task): void;
        /**
         * TaskGroup name.
         *
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        name: string;
    }
    /**
     * The SequenceRunner class provides an interface to create a task sequence runner.
     *
     * @syscap SystemCapability.Utils.Lang
     * @crossplatform
     * @atomicservice
     * @since 11
     */
    class SequenceRunner {
        /**
         * Create a SequenceRunner instance.
         *
         * @param { Priority } priority - Task execution priority, MEDIUM is default.
         * @throws { BusinessError } 401 - The input parameters are invalid.
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        constructor(priority?: Priority);
        /**
         * Execute a concurrent function.
         *
         * @param { Task } task - The task want to execute.
         * @returns { Promise<Object> }
         * @throws { BusinessError } 401 - The input parameters are invalid.
         * @throws { BusinessError } 10200003 - Worker initialization failure.
         * @throws { BusinessError } 10200006 - An exception occurred during serialization.
         * @throws { BusinessError } 10200025 - Add dependent task to SequenceRunner.
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        execute(task: Task): Promise<Object>;
    }
    /**
     * The State defines the task state.
     *
     * @enum { number } State
     * @syscap SystemCapability.Utils.Lang
     * @crossplatform
     * @since 10
     */
    /**
     * The State defines the task state.
     *
     * @enum { number } State
     * @syscap SystemCapability.Utils.Lang
     * @crossplatform
     * @atomicservice
     * @since 11
     */
    enum State {
        /**
         * the task state is waiting.
         *
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @since 10
         */
        /**
         * the task state is waiting.
         *
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        WAITING = 1,
        /**
         * the task state is running.
         *
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @since 10
         */
        /**
         * the task state is running.
         *
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        RUNNING = 2,
        /**
         * the task state is canceled.
         *
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @since 10
         */
        /**
         * the task state is canceled.
         *
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        CANCELED = 3
    }
    /**
     * Indicates the internal information of the worker thread.
     *
     * @syscap SystemCapability.Utils.Lang
     * @crossplatform
     * @since 10
     */
    /**
     * Indicates the internal information of the worker thread.
     *
     * @syscap SystemCapability.Utils.Lang
     * @crossplatform
     * @atomicservice
     * @since 11
     */
    class TaskInfo {
        /**
         * Task identity.
         *
         * @type { number }
         * @default 0
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @since 10
         */
        /**
         * Task identity.
         *
         * @type { number }
         * @default 0
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        taskId: number;
        /**
         * Task state.
         *
         * @type { State }
         * @default State::WAITING
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @since 10
         */
        /**
         * Task state.
         *
         * @type { State }
         * @default State::WAITING
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        state: State;
        /**
         * Duration of task execution.
         *
         * @type { ?number }
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @since 10
         */
        /**
         * Duration of task execution.
         *
         * @type { ?number }
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        duration?: number;
    }
    /**
     * Indicates the internal information of the worker thread.
     *
     * @syscap SystemCapability.Utils.Lang
     * @crossplatform
     * @since 10
     */
    /**
     * Indicates the internal information of the worker thread.
     *
     * @syscap SystemCapability.Utils.Lang
     * @crossplatform
     * @atomicservice
     * @since 11
     */
    class ThreadInfo {
        /**
         * Thread id.
         *
         * @type { number }
         * @default 0
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @since 10
         */
        /**
         * Thread id.
         *
         * @type { number }
         * @default 0
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        tid: number;
        /**
         * Task id list that running on current thread.
         *
         * @type { ?number[] }
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @since 10
         */
        /**
         * Task id list that running on current thread.
         *
         * @type { ?number[] }
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        taskIds?: number[];
        /**
         * Thread priority.
         *
         * @type { ?Priority }
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @since 10
         */
        /**
         * Thread priority.
         *
         * @type { ?Priority }
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        priority?: Priority;
    }
    /**
     * Indicates the internal information of the taskpool.
     *
     * @syscap SystemCapability.Utils.Lang
     * @crossplatform
     * @since 10
     */
    /**
     * Indicates the internal information of the taskpool.
     *
     * @syscap SystemCapability.Utils.Lang
     * @crossplatform
     * @atomicservice
     * @since 11
     */
    class TaskPoolInfo {
        /**
         * An array of taskpool thread information.
         *
         * @type { ThreadInfo[] }
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @since 10
         */
        /**
         * An array of taskpool thread information.
         *
         * @type { ThreadInfo[] }
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        threadInfos: ThreadInfo[];
        /**
         * An array of taskpool task information.
         *
         * @type { TaskInfo[] }
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @since 10
         */
        /**
         * An array of taskpool task information.
         *
         * @type { TaskInfo[] }
         * @syscap SystemCapability.Utils.Lang
         * @crossplatform
         * @atomicservice
         * @since 11
         */
        taskInfos: TaskInfo[];
    }
    /**
     * Execute a concurrent function.
     *
     * @param { Function } func - func func Concurrent function want to execute.
     * @param { unknown[] } args - args args The concurrent function arguments.
     * @returns { Promise<unknown> }
     * @throws { BusinessError } 401 - The input parameters are invalid.
     * @throws { BusinessError } 10200003 - Worker initialization failure.
     * @throws { BusinessError } 10200006 - An exception occurred during serialization.
     * @throws { BusinessError } 10200014 - The function is not mark as concurrent.
     * @syscap SystemCapability.Utils.Lang
     * @since 9
     */
    /**
     * Execute a concurrent function.
     *
     * @param { Function } func - func func Concurrent function want to execute.
     * @param { unknown[] } args - args args The concurrent function arguments.
     * @returns { Promise<unknown> }
     * @throws { BusinessError } 401 - The input parameters are invalid.
     * @throws { BusinessError } 10200003 - Worker initialization failure.
     * @throws { BusinessError } 10200006 - An exception occurred during serialization.
     * @throws { BusinessError } 10200014 - The function is not mark as concurrent.
     * @syscap SystemCapability.Utils.Lang
     * @crossplatform
     * @since 10
     */
    /**
     * Execute a concurrent function.
     *
     * @param { Function } func - func func Concurrent function want to execute.
     * @param { Object[] } args - args args The concurrent function arguments.
     * @returns { Promise<Object> }
     * @throws { BusinessError } 401 - The input parameters are invalid.
     * @throws { BusinessError } 10200003 - Worker initialization failure.
     * @throws { BusinessError } 10200006 - An exception occurred during serialization.
     * @throws { BusinessError } 10200014 - The function is not mark as concurrent.
     * @syscap SystemCapability.Utils.Lang
     * @crossplatform
     * @atomicservice
     * @since 11
     */
    function execute(func: Function, ...args: Object[]): Promise<Object>;
    /**
     * Execute a concurrent task.
     *
     * @param { Task } task - task task The task want to execute.
     * @param { Priority } [priority] - priority priority Task priority, MEDIUM is default.
     * @returns { Promise<unknown> }
     * @throws { BusinessError } 401 - The input parameters are invalid.
     * @throws { BusinessError } 10200003 - Worker initialization failure.
     * @throws { BusinessError } 10200006 - An exception occurred during serialization.
     * @throws { BusinessError } 10200014 - The function is not mark as concurrent.
     * @syscap SystemCapability.Utils.Lang
     * @since 9
     */
    /**
     * Execute a concurrent task.
     *
     * @param { Task } task - task task The task want to execute.
     * @param { Priority } [priority] - priority priority Task priority, MEDIUM is default.
     * @returns { Promise<unknown> }
     * @throws { BusinessError } 401 - The input parameters are invalid.
     * @throws { BusinessError } 10200003 - Worker initialization failure.
     * @throws { BusinessError } 10200006 - An exception occurred during serialization.
     * @throws { BusinessError } 10200014 - The function is not mark as concurrent.
     * @syscap SystemCapability.Utils.Lang
     * @crossplatform
     * @since 10
     */
    /**
     * Execute a concurrent task.
     *
     * @param { Task } task - task task The task want to execute.
     * @param { Priority } [priority] - priority priority Task priority, MEDIUM is default.
     * @returns { Promise<Object> }
     * @throws { BusinessError } 401 - The input parameters are invalid.
     * @throws { BusinessError } 10200003 - Worker initialization failure.
     * @throws { BusinessError } 10200006 - An exception occurred during serialization.
     * @throws { BusinessError } 10200014 - The function is not mark as concurrent.
     * @syscap SystemCapability.Utils.Lang
     * @crossplatform
     * @atomicservice
     * @since 11
     */
    function execute(task: Task, priority?: Priority): Promise<Object>;
    /**
     * Execute a concurrent task group.
     *
     * @param { TaskGroup } group - group group The task group want to execute.
     * @param { Priority } [priority] - priority priority Task group priority, MEDIUM is default.
     * @returns { Promise<unknown[]> }
     * @throws { BusinessError } 401 - The input parameters are invalid.
     * @throws { BusinessError } 10200006 - An exception occurred during serialization.
     * @syscap SystemCapability.Utils.Lang
     * @crossplatform
     * @since 10
     */
    /**
     * Execute a concurrent task group.
     *
     * @param { TaskGroup } group - group group The task group want to execute.
     * @param { Priority } [priority] - priority priority Task group priority, MEDIUM is default.
     * @returns { Promise<Object[]> }
     * @throws { BusinessError } 401 - The input parameters are invalid.
     * @throws { BusinessError } 10200006 - An exception occurred during serialization.
     * @syscap SystemCapability.Utils.Lang
     * @crossplatform
     * @atomicservice
     * @since 11
     */
    function execute(group: TaskGroup, priority?: Priority): Promise<Object[]>;
    /**
     * Execute a concurrent task after the specified time.
     *
     * @param { number } delayTime - delayTime delayTime The time want to delay.
     * @param { Task } task - task task The task want to execute.
     * @param { Priority } [priority] - priority priority Task priority, MEDIUM is default.
     * @returns { Promise<Object> }
     * @throws { BusinessError } 401 - The input parameters are invalid.
     * @throws { BusinessError } 10200028 - The delayTime is less than zero.
     * @syscap SystemCapability.Utils.Lang
     * @crossplatform
     * @atomicservice
     * @since 11
     */
    function executeDelayed(delayTime: number, task: Task, priority?: Priority): Promise<Object>;
    /**
     * Cancel a concurrent task.
     *
     * @param { Task } task - task task The task want to cancel.
     * @throws { BusinessError } 401 - The input parameters are invalid.
     * @throws { BusinessError } 10200015 - The task does not exist when it is canceled.
     * @throws { BusinessError } 10200016 - The task is executing when it is canceled.
     * @syscap SystemCapability.Utils.Lang
     * @since 9
     */
    /**
     * Cancel a concurrent task.
     *
     * @param { Task } task - task task The task want to cancel.
     * @throws { BusinessError } 401 - The input parameters are invalid.
     * @throws { BusinessError } 10200015 - The task does not exist when it is canceled.
     * @syscap SystemCapability.Utils.Lang
     * @crossplatform
     * @since 10
     */
    /**
     * Cancel a concurrent task.
     *
     * @param { Task } task - task task The task want to cancel.
     * @throws { BusinessError } 401 - The input parameters are invalid.
     * @throws { BusinessError } 10200015 - The task does not exist when it is canceled.
     * @syscap SystemCapability.Utils.Lang
     * @crossplatform
     * @atomicservice
     * @since 11
     */
    function cancel(task: Task): void;
    /**
     * Cancel a concurrent task group.
     *
     * @param { TaskGroup } group - group group The task group want to cancel.
     * @throws { BusinessError } 401 - The input parameters are invalid.
     * @throws { BusinessError } 10200018 - The task group does not exist when it is canceled.
     * @syscap SystemCapability.Utils.Lang
     * @crossplatform
     * @since 10
     */
    /**
     * Cancel a concurrent task group.
     *
     * @param { TaskGroup } group - group group The task group want to cancel.
     * @throws { BusinessError } 401 - The input parameters are invalid.
     * @throws { BusinessError } 10200018 - The task group does not exist when it is canceled.
     * @syscap SystemCapability.Utils.Lang
     * @crossplatform
     * @atomicservice
     * @since 11
     */
    function cancel(group: TaskGroup): void;
    /**
     * Get task pool internal information.
     *
     * @returns { TaskPoolInfo }
     * @syscap SystemCapability.Utils.Lang
     * @crossplatform
     * @since 10
     */
    /**
     * Get task pool internal information.
     *
     * @returns { TaskPoolInfo }
     * @syscap SystemCapability.Utils.Lang
     * @crossplatform
     * @atomicservice
     * @since 11
     */
    function getTaskPoolInfo(): TaskPoolInfo;
}
export default taskpool;
import { ToastProps, VariantType, useToastProvider } from "@openfun/cunningham-react"
import React, { useEffect, useRef } from "react"

interface TransitionOptions<T> {
    /**
     * 
     * @param originState The origin state of the transition
     * @param targetState The destination state of the transition
    */
    computeMessage: (originState: T, targetState: T) => string,
    /**
     * @remarks 
     * 
     */
    variant: VariantType,
}

type CustomCheck<T> = (p: T, n: T) => boolean

interface EventHandlerCapabilities {
    watchState: (event: any) => void,
}
/**
     * An Event is an abstraction to handle state changes in order to trigger `Toast`.
     * It is based on two principles :
     * - FSM allowing users to define state transition and associated notification to trigger (use {@link onSwitch} )
     * - Additionnal custom checks allowing to compare origin and target states (use {@link onCheck})
     * 
     * @remarks
     * One should prefer using `onSwitch` method over `onCheck` when possible because FSM is based on `Map`
     * data structures which provide better performances.
     */
export class Event<T>{
    /**
     * The state to watch
     */
    private state: T
    /**
     * The common props of the toast you want to display when notifications trigger
     */
    private toast: ToastProps
    /**
     * The final state machine representation
     */
    private fsm: Map<any, Map<any, TransitionOptions<T>>>
    /**
     * A list of additional checks to run when FSM is not applicable
     */
    private additionalChecks: Array<[CustomCheck<T>, TransitionOptions<T>]>
    /**
     * When using `onSwitch`, specifies a function to apply to the underlying state before comparing origin and target states
     * @example
     * Typically, if your state is something like
     * ```
     * {
     *  value : boolean,
     *  anotherValue : string
     * }
     * ```
     * and you want to perform state transition based on the `value`field, you will set compute function as follows :
     * ```
     * compute = (state : T) => state.value
     * ```
     * 
     */
    private compute: (origin: T) => any

    /**
     * 
     * @param state The `state`to watch @see {@link Event.state}
     * @param props The props to set for the `Toast` @see {@link Event.toast}
     * @param compute The compute function @see {@link Event.compute}
     */
    constructor(state: T, props: ToastProps, compute: (state: T) => any = (r): boolean => {
        return true
    }) {
        this.toast = props
        this.state = state
        this.fsm = new Map()
        this.compute = compute
        this.additionalChecks = new Array
    }

    /**
     * Allows one to define a transition in the final state machine and an associated {@link TransitionOptions}
     * 
     * @param previous The origin state of the transition you want to trigger
     * @param destination The destination state of the transition you want to trigger
     * @param options @see {@link TransitionOptions}
     */
    onSwitch(origin: any, destination: any, options: TransitionOptions<T>) {
        if (this.fsm.get(origin) == undefined) {
            this.fsm.set(origin, new Map())
        }
        const target = this.fsm.get(origin)
        target?.set(destination, options)
    }

    /**
     * Allows one to define a custom check to run in order to determine if a notification has to trigger 
     * and define an associated {@link TransitionOptions}
     * 
     * @param check 
     * @param options 
     * 
     * @remarks Prefer {@link onSwitch} when possible
     */
    onCheck(check: CustomCheck<T>, options: TransitionOptions<T>) {
        this.additionalChecks.push([check, options])
    }

    /**
     * 
     * @returns The state {@link state}
     */
    getState(): T {
        return this.state
    }

    /**
     * 
     * @returns The compute function {@link compute}
     */
    getCompute(): (origin: T) => any {
        return this.compute
    }

    /**
     * 
     * @returns Additional checks {@link additionalChecks}
     */
    getAdditionalChecks(): Array<[CustomCheck<T>, TransitionOptions<T>]> {
        return this.additionalChecks
    }

    /**
     * 
     * @returns The underlying FSM {@link fsm}
     */
    getFsm(): Map<any, Map<any, TransitionOptions<T>>> {
        return this.fsm
    }

    /**
     * 
     * @returns Toast props {@link toast}
     */
    getToast(): ToastProps {
        return this.toast
    }
}


const EventHandlerContext = React.createContext<EventHandlerCapabilities>({} as EventHandlerCapabilities)

/**
 * 
 * @returns The {@link EventHandlerContext} context
 */
export const useEventHandler = () => {
    const context = React.useContext(EventHandlerContext)
    return context
}

/**
 * A React component wrapping a {@link EventHandlerContext} context
 * 
 * @param props 
 * @returns Children wrapped in a {@link EventHandlerContext}
 */
export const EventHandlerProvider = (props: any) => {
    const { toast } = useToastProvider()

    const watchState = (event: Event<any>): void => {
        const r = useRef(event.getState())
        useEffect(() => {
            const target = event.getState()
            const origin = r.current
            /// Check state machine 
            const target_c = event.getCompute()(target)
            const origin_c = event.getCompute()(origin)
            const transition = event.getFsm().get(origin_c)?.get(target_c)
            if (transition) {
                toast(transition.computeMessage(origin_c, target_c), transition.variant, event.getToast())
            }

            /// Run additional check
            for (let i = 0; i < event.getAdditionalChecks().length; i++) {
                const [check, options] = event.getAdditionalChecks()[i];
                if (check(origin, target)) {
                    toast(options.computeMessage(origin, target), options.variant, event.getToast())
                    break
                }
            }
            r.current = event.getState()
        }, [event.getState()])
    }

    return (
        <EventHandlerContext.Provider value={{ watchState: watchState }}>
            {props.children}
        </EventHandlerContext.Provider>
    )
}
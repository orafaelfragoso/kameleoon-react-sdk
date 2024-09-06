import { KameleoonError } from '@kameleoon/javascript-sdk'

export function compose<T extends (...args: any[]) => any>(
  client: any,
  queueRef: React.MutableRefObject<Record<string, any[]>>,
  methodName: string,
  queueable = false,
) {
  return (...args: Parameters<T>): ReturnType<T> | void => {
    if (!client && queueable) {
      queueRef.current[methodName].push(args)
    }

    if (client) {
      try {
        return client[methodName](...args)
      } catch (error) {
        if (error instanceof KameleoonError) {
          console.error(`Kameleoon error: ${error.message}`)
        } else {
          console.error(`Error in Kameleoon method '${methodName}':`, error)
        }
      }
    }
  }
}

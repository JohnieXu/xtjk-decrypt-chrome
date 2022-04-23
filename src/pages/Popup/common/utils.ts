/**
 * 生成 id
 * @returns id
 */
export const genId = (): string => {
  return Date.now() + ''
}

/**
 * 获取当前日期
 * @returns 当前日期
 */
export const getNow = (): string => {
  return new Date().toLocaleString()
}

/**
 * 空函数
 */
export const noop = (): void => { }

/**
 * 打印调试日志
 * @param module 模块名
 * @param e 要打印的数据
 */
export const debug = (module: string, e: any, label?: string): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[xtjk-decrypt-chrome][${module ? module : ''}] ${label ? label : ''}`, e)
  }
}

/**
 * 生成打印调试日志方法
 * @param module 模块名
 * @returns 打印调试日志方法
 */
export const genDebug = (module: string) => {
  return (e: any, label?: string): void => {
    debug(module, e, label)
  }
}

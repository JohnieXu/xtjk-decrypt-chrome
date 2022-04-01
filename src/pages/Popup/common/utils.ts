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
export const getNow = (): Date => {
  return new Date()
}

/**
 * 空函数
 */
export const noop = (): void => { }

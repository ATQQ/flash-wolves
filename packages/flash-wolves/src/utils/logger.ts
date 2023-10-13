import colors from 'colors'

export default class Logger {
  static tag = 'FW'

  static debug(...message: any[]) {
    this.log(colors.grey(`[${this.tag}]`), ...message)
  }

  static info(...message: any[]) {
    this.log(colors.cyan(`[${this.tag}]`), ...message)
  }

  static warn(...message) {
    this.log(colors.yellow(`[${this.tag}]`), ...message)
  }

  static error(...message) {
    this.log(colors.red(`[${this.tag}]`), ...message)
  }

  static trace(...message) {
    if (!process.env.FW_LOGGING) return
    console.trace(colors.gray(`[${this.tag}]`), ...message)
  }

  static log(message?: any, ...optionalParams: any[]) {
    if (!process.env.FW_LOGGING) return
    console.log(message, ...optionalParams)
  }
}

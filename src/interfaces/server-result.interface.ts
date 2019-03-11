export default interface IServerResult<T> {
  error: boolean
  message?: string
  result?: T
  code: number
}

import { get } from '@/api/fetch'

export function getInfo() {
  return get('/users/info')
}

export function getAll(params) {
  return get('/users', params)
}

import { post } from '@/api/fetch'
import Qs from 'qs'
export function login(username, password) {
  return post('/login', Qs.stringify({ username, password }))
}

export function logout() {
  return post('/logout')
}

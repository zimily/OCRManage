import request from '@/utils/request'

export function getOcrData() {
  return request.get('/templates')
}

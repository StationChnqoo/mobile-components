import type { PaginationProps } from '@/constants/t'
import BaseService from './BaseService'

export default class NextService extends BaseService {
  constructor(token: string) {
    super(token)
  }

  async selectProperties(page: PaginationProps) {
    let result = await this.instance.get(`/selectProperties.do`, {
      params: page,
    })
    return result.data
  }
}

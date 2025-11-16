import { http } from './service'
import type { BotLogGetAllItems } from '@/models/BotLogItem'

// Dạng chuẩn response backend
export interface ApiResponse<T> {
  status: number
  msg: string
  data: T
  errorCode: number
}

export interface EventRecord {
  id: number
  eventType: string
  transId: string
  dataJson: string
}

export interface GetAllEventCallParams {
  transId: string
  eventType?: 'summary' | string
}

export interface GetAllBotLogParams {
  botId: string
  transId: string
}

/** ---------- NEW: exchange module token ---------- */
export interface GetModuleTokenParams {
  projectCode: string
  uid: string
  type?: string      // mặc định 'TICKET-WC'
  source?: string    // mặc định 'Desktop-RTC'
}

export interface ModuleTokenData {
  token: string
  refreshToken: string
  tokenType: string // 'Bearer'
}

export async function getModuleToken(params: GetModuleTokenParams): Promise<ApiResponse<ModuleTokenData>> {
  // baseURL hiện tại là root (https://.../v1.0)
  const res = await http.get<ApiResponse<ModuleTokenData>>('api/module-cdr/token', {
    params: {
      projectCode: params.projectCode,
      uid: params.uid,
      type: 'CDR-WC',
      source: 'Desktop-RTC',
    },
  })
  return res.data
}

/** ---------- UPDATED: dùng full-path vì baseURL là root ---------- */
export async function getAllEventCall(params: GetAllEventCallParams): Promise<ApiResponse<EventRecord[]>> {
  const res = await http.get<ApiResponse<EventRecord[]>>(
    'api/module-ticket/webhook/getAllEventCall',
    { params: { transId: params.transId, eventType: params.eventType } },
  )
  return res.data
}

export async function getAllBotLog(params: GetAllBotLogParams): Promise<ApiResponse<BotLogGetAllItems>> {
  const res = await http.get<ApiResponse<BotLogGetAllItems>>(
    'api/botLog/getAll',
    { params: { botId: params.botId, transId: params.transId } },
  )
  return res.data
}

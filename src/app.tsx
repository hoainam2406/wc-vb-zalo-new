import { getAllEventCall, getModuleToken } from '@/api/history-call'
import { setApiBaseUrl, setAuthToken } from '@/api/service'
import '@/components/VbAITag'
import '@/components/VbAiChatItem'
import '@/components/VbEmpty'
import '@/components/VbError'
import type { ChatItem } from '@/models/ChatItem'
import { sharedStyle } from '@/style/sharedStyle'
import { tailwind } from '@/tailwind'
import { themeSignal, useTheme } from '@/utils/themeSignal'
import { Component, tag } from 'omi'

declare global {
  interface Window {
    toogleDark(): void
  }
}

type Props = {
  theme?: string
  transId: string
  customerName: string
  agentName: string
  /** Base URL gốc (vd: https://api-sandbox-h01.vbot.vn/v1.0) */
  apiBaseUrl: string
  /** Host token (token 1) */
  accessToken: string
  tokenType: string

  /** NEW: dùng để đổi module token */
  projectCode: string
  uid: string
  /** NEW: nguồn gọi token (mặc định Desktop-RTC) */
  source?: string
}

type State = {
  loading: boolean
  error: string | null
  items: ChatItem[]
  transId: string | null
}

@tag('vb-wc-history-call-voice-to-text-v2')
export default class extends Component<Props> {
  static css = [tailwind, sharedStyle]

  static props = {
    theme: {
      type: String,
      default: 'system',
      changed(newValue: string) {
        if (['normal', 'dark', 'system'].indexOf(newValue) !== -1) {
          themeSignal.value = newValue
        }
      },
    },
    transId: { type: String, default: '' },
    customerName: { type: String, default: 'Customer' },
    agentName: { type: String, default: 'Agent' },

    apiBaseUrl: { type: String, default: '' },
    accessToken: { type: String, default: '' },
    tokenType: { type: String, default: 'Bearer' },

    // NEW
    projectCode: { type: String, default: '' },
    uid: { type: String, default: '' },
    source: { type: String, default: 'Desktop-RTC' },
  }

  receiveProps(nextProps: Props) {
    // Cập nhật baseURL nếu thay đổi
    if (nextProps.apiBaseUrl && nextProps.apiBaseUrl !== this.props.apiBaseUrl) {
      setApiBaseUrl(nextProps.apiBaseUrl)
    }

    // Nếu host token thay đổi: gắn lại (để sẵn sàng đổi module token lần nữa)
    if (nextProps.accessToken !== this.props.accessToken || nextProps.tokenType !== this.props.tokenType) {
      if (nextProps.accessToken) setAuthToken(nextProps.accessToken, nextProps.tokenType || 'Bearer')
      else setAuthToken(undefined)
    }

    // Nếu transId thay đổi sau khi mount -> tự reload
    if (nextProps.transId && nextProps.transId !== this.state.transId) {
      this.state.transId = nextProps.transId
      this.safeLoadFlow(nextProps.transId)
    }
  }

  state: State = {
    loading: false,
    error: null,
    items: [],
    transId: null,
  }

  private disposeTheme?: () => void

  private mapSpeechToChatItems(conversations: any[]): ChatItem[] {
    const customerName = this.props.customerName
    const agentName = this.props.agentName

    return conversations.map((c) => {
      let name = ''
      let type: 'member' | 'customer' = 'customer'

      if (c.speaker === 'td') {
        name = agentName
        type = 'member'
      } else if (c.speaker === 'kh') {
        name = customerName
        type = 'customer'
      } else {
        name = c.speaker || '' // fallback
      }

      return {
        type,
        name,
        content: c.text,
        time: this.formatTime(c.startTime),
      } as ChatItem
    })
  }

  // Format seconds -> mm:ss
  private formatTime(seconds: number): string {
    if (seconds === null || seconds === undefined) return ''
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const mm = mins < 10 ? '0' + mins : String(mins)
    const ss = secs < 10 ? '0' + secs : String(secs)
    return `${mm}:${ss}`
  }

  // Đổi module token bằng host token đang gắn sẵn
  private async exchangeModuleToken() {
    const { projectCode, uid, source = 'Desktop-RTC' } = this.props
    if (!projectCode || !uid) {
      throw new Error('Missing projectCode or uid for module token exchange.')
    }
    const res = await getModuleToken({
      projectCode,
      uid,
      type: 'TICKET-WC',
      source,
    })
    const tk = (res as any)?.data?.token
    const tkType = (res as any)?.data?.tokenType || 'Bearer'
    if (!tk) throw new Error('Module token not found in response.')
    // Gắn module token để gọi các API module-ticket
    setAuthToken(tk, tkType)
    return { token: tk, tokenType: tkType }
  }

  // Fetch API data
  private async loadData(transId: string) {
    this.state.loading = true
    this.state.error = null
    this.update()

    try {
      const result = await getAllEventCall({ transId, eventType: 'emotion' })
      let dataJson: any = null
      if (result.data && result.data.length > 0 && (result.data as any)[0].dataJson) {
        dataJson = JSON.parse((result.data as any)[0].dataJson)
      }
      console.log('API result', dataJson)

      const conversations = dataJson?.result?.speech?.conversations ?? []
      const items = this.mapSpeechToChatItems(conversations)

      this.state.items = items
    } catch (err: any) {
      this.state.error = err?.message || 'Failed to load call data.'
      this.state.items = []
    } finally {
      this.state.loading = false
      this.update()
    }
  }

  // Thực thi luồng: đổi token module -> load dữ liệu
  private async safeLoadFlow(transId: string) {
    try {
      // 1) Gắn host token (đã gắn ở install/receiveProps)
      if (!this.props.accessToken) {
        throw new Error('Missing host accessToken.')
      }
      // 2) Đổi module token
      await this.exchangeModuleToken()
      // 3) Gọi data
      await this.loadData(transId)
    } catch (e: any) {
      this.state.error = e?.message || 'Failed to exchange module token.'
      this.update()
    }
  }

  // Omi lifecycle: runs once before the first render (register theme)
  install() {
    this.disposeTheme = useTheme(this)
    if (this.props.theme) themeSignal.value = this.props.theme

    // baseURL = root (https://.../v1.0)
    const baseUrl = this.props.apiBaseUrl || import.meta.env.VITE_API_BASE
    if (baseUrl) setApiBaseUrl(baseUrl)
    else console.error('API baseURL not provided. Please pass the api-base-url prop.')

    // set host token trước để gọi /api/module-cdr/token
    if (this.props.accessToken) {
      setAuthToken(this.props.accessToken, this.props.tokenType || 'Bearer')
    } else {
      setAuthToken(undefined)
    }
  }

  // Omi lifecycle: runs after first render -> safe to call APIs
  installed() {
    const transId = this.props.transId
    this.state.transId = transId

    if (!transId) {
      this.state.error = 'Missing transId. Please pass trans-id attribute or query parameter ?transId=...'
      this.update()
      return
    }

    // Luồng mới: đổi module token rồi mới load dữ liệu
    this.safeLoadFlow(transId)
  }

  uninstall() {
    this.disposeTheme?.()
  }

  render() {
    const { loading, error, items } = this.state

    return (
      <div class="h-full bg-vb-bg text-vb-text rounded-[8px]">
        <div class="flex flex-col rounded-[8px] gradient-border-animated overflow-hidden h-full">
          {/* Header */}
          <div class="h-[3rem] flex items-center px-4 flex-none">
            <div class="gradient-text-animated font-medium flex flex-row gap-2">
              <vb-ai-tag />
              Nội dung cuộc gọi
            </div>
          </div>

          {/* Content */}
          <div class="flex-1 min-h-0 overflow-y-auto w-full flex flex-col gap-2 p-4">
            {loading && (
              <div class="flex h-full items-center justify-center">
                <div
                  class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-neutral-200 motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                ></div>
              </div>
            )}

            {!loading && error && (
              <div class="h-full">
                {/* <vb-error></vb-error> */}
                <vb-empty></vb-empty>
              </div>
            )}

            {!loading && !error && items.length === 0 && (
              <div class="h-full">
                <vb-empty></vb-empty>
              </div>
            )}

            {!loading && !error && items.length > 0 && (
              <div class="flex flex-col gap-2">
                {items.map((item) => (
                  <vb-ai-chat-item-v2 item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

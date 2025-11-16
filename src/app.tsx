import { setApiBaseUrl, setAuthToken } from '@/api/service'
import { getAllZaloOAAPI } from '@/api/zalo-oa'
import '@/components/VbButton'
import '@/components/VbEmpty'
import { sharedStyle } from '@/style/sharedStyle'
import { tailwind } from '@/tailwind'
import { getTranslation, type Locale } from '@/translate/index'
import { themeSignal, useTheme } from '@/utils/themeSignal'
import { Component, tag } from 'omi'
import { ZaloOAItem } from './models/zaloOAItem'
declare global {
  interface Window {
    handleZaloOAuthResult?: (success: boolean, message?: string) => void
  }
}

type Props = {
  theme?: string
  projectCode: string
  /** Base URL gốc (vd: https://api-sandbox-h01.vbot.vn/v1.0) */
  apiBaseUrl: string
  /** Host token (token 1) */
  accessToken: string
  tokenType: string
  /** NEW: uid để đổi module token */
  uid: string
  /** NEW: nguồn gọi token (mặc định Desktop-RTC) */
  source?: string
  locale?: Locale
}

type State = {
  loading: boolean
  error: string | null
  items: ZaloOAItem[]
  projectCode: string
  oauthStatus: 'idle' | 'authorizing' | 'success' | 'error'
  imageErrors: { [key: number]: boolean }
}

@tag('vb-wc-zalo')
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
    projectCode: { type: String, default: '' },
    apiBaseUrl: { type: String, default: '' },
    accessToken: { type: String, default: '' },
    tokenType: { type: String, default: 'Bearer' },
    uid: { type: String, default: '' },
    source: { type: String, default: 'Desktop-RTC' },
    locale: { type: String, default: 'vi' },
  }

  state: State = {
    loading: false,
    error: null,
    items: [],
    projectCode: '',
    oauthStatus: 'idle',
    imageErrors: {}
  }

  private disposeTheme?: () => void
  private popupCheckInterval?: number

  // Getter để lấy translation object
  private get t() {
    return getTranslation(this.props.locale || 'vi')
  }

  // Public method for parent page to call
  public openZaloOAPopup() {
    this.handleAddZaloOAPopup()
  }

  install() {
    this.disposeTheme = useTheme(this)
    window.handleZaloOAuthResult = this.handleZaloOAuthResult

    // Thiết lập theme
    if (this.props.theme) themeSignal.value = this.props.theme

    // Thiết lập API base URL
    const baseUrl = this.props.apiBaseUrl || import.meta.env.VITE_API_BASE
    if (baseUrl) {
      setApiBaseUrl(baseUrl)
    } else {
      console.error('API baseURL not provided. Please pass the api-base-url prop.')
    }

    // Thiết lập host token để gọi API đổi module token
    if (this.props.accessToken) {
      setAuthToken(this.props.accessToken, this.props.tokenType || 'Bearer')
    } else {
      setAuthToken(undefined)
    }
  }

  installed() {

    // Kiểm tra OAuth callback khi popup load trang này
    this.checkOAuthResult()

    const projectCode = this.props.projectCode
    this.state.projectCode = projectCode

    if (!projectCode) {
      this.state.error = 'Missing projectCode. Please pass project-code attribute.'
      this.update()
      return
    }

    // Luồng mới: đổi module token rồi mới load dữ liệu
    this.safeLoadFlow()
  }

  uninstall() {
    this.disposeTheme?.()
    if (this.popupCheckInterval) clearInterval(this.popupCheckInterval)
    delete window.handleZaloOAuthResult
  }

  receiveProps(nextProps: Props) {
    // Cập nhật baseURL nếu thay đổi
    if (nextProps.apiBaseUrl && nextProps.apiBaseUrl !== this.props.apiBaseUrl) {
      setApiBaseUrl(nextProps.apiBaseUrl)
    }

    // Nếu host token thay đổi: gắn lại
    if (
      nextProps.accessToken !== this.props.accessToken ||
      nextProps.tokenType !== this.props.tokenType
    ) {
      if (nextProps.accessToken) {
        setAuthToken(nextProps.accessToken, nextProps.tokenType || 'Bearer')
      } else {
        setAuthToken(undefined)
      }
    }

    // Nếu projectCode thay đổi -> reload
    if (nextProps.projectCode && nextProps.projectCode !== this.state.projectCode) {
      this.state.projectCode = nextProps.projectCode
      this.safeLoadFlow()
    }

    // Re-render khi locale thay đổi
    if (nextProps.locale !== this.props.locale) {
      this.update()
    }
  }



  // Thực thi luồng: đổi token module -> load dữ liệu
  private async safeLoadFlow() {
    try {
      // 1) Gắn host token (đã gắn ở install/receiveProps)
      if (!this.props.accessToken) {
        throw new Error('Missing host accessToken.')
      }

      // 3) Gọi data
      await this.loadData()
    } catch (e: any) {
      this.state.error = e?.message || 'Failed to exchange module token.'
      this.state.loading = false
      this.update()
    }
  }

  private async loadData() {
    this.state.loading = true
    this.state.error = null
    this.update()

    try {
      const result = await getAllZaloOAAPI({ p_code: this.state.projectCode })
      this.state.items = result.data
    } catch (err: any) {
      this.state.error = err?.message || 'Unable to load Zalo OA data.'
      this.state.items = []
    } finally {
      this.state.loading = false
      this.update()
    }
  }

  private checkOAuthResult() {
    const currentUrl = new URL(window.location.href)
    const code = currentUrl.searchParams.get('code')

    if (code && window.opener) {
      const isSuccess = code === '200'
      const message = isSuccess ? 'OA link added successfully!' : 'Failed to add OA link!'

      if (window.opener.handleZaloOAuthResult) {
        window.opener.handleZaloOAuthResult(isSuccess, message)
      }

      window.close()
    }
  }

  private handleZaloOAuthResult = (success: boolean, message?: string) => {
    if (this.popupCheckInterval) {
      clearInterval(this.popupCheckInterval)
      this.popupCheckInterval = undefined
    }

    if (success) {
      this.state.oauthStatus = 'success'
      this.state.error = null
      this.update()
      this.showNotification('🎉 ' + message, 'success')

      this.safeLoadFlow() // Reload với luồng mới
      this.state.oauthStatus = 'idle'
      this.update()
    } else {
      this.state.oauthStatus = 'error'
      this.state.error = message || 'Failed to add OA link!'
      this.update()
      this.showNotification('❌ ' + this.state.error, 'error')

      this.state.oauthStatus = 'idle'
      this.state.error = null
      this.update()
    }
  }

  private handleAddZaloOAPopup = () => {
    const callbackUrl = `${window.location.origin}/oauth-callback.html`
    const oauthUrl = `https://zalo-sandbox.vbot.vn/oa/connect?p_code=${this.state.projectCode}&callback_uri=${encodeURIComponent(callbackUrl)}`



    const popup = window.open(
      oauthUrl,
      'zalo-oauth',
      'width=600,height=700,scrollbars=yes,resizable=yes'
    )

    if (!popup) {
      this.showNotification('❌ Popup was blocked. Please allow popups and try again.', 'error')
      return
    }

    this.state.oauthStatus = 'authorizing'
    this.update()

    this.monitorPopup(popup)
  }

  private monitorPopup(popup: Window) {
    this.popupCheckInterval = setInterval(() => {
      try {
        if (popup.closed) {
          clearInterval(this.popupCheckInterval!)
          this.popupCheckInterval = undefined

          if (this.state.oauthStatus === 'authorizing') {
            this.state.oauthStatus = 'idle'
            this.update()
          }
        }
      } catch (e) {
        console.error('Error monitoring popup:', e)
      }
    }, 1000)
  }

  private showNotification(message: string, type: 'success' | 'error' = 'success') {
    const notification = document.createElement('div')
    const bgColor = type === 'success' ? '#4CAF50' : '#f44336'

    notification.style.cssText = `
      position: fixed; top: 20px; right: 20px; background: ${bgColor}; color: white;
      padding: 1rem 1.5rem; border-radius: 8px; z-index: 10000; font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15); max-width: 300px;
    `
    notification.textContent = message
    document.body.appendChild(notification)

    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification)
      }
    }, type === 'error' ? 5000 : 3000)
  }

  getFirstLetterAvatar = (name: string): string => {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return '?'
    }

    const firstChar = name.trim().charAt(0).toUpperCase()

    const accentMap: { [key: string]: string } = {
      À: 'A', Á: 'A', Â: 'A', Ã: 'A', Ă: 'A', Ạ: 'A', Ả: 'A',
      Ấ: 'A', Ầ: 'A', Ẩ: 'A', Ẫ: 'A', Ậ: 'A', Ắ: 'A', Ằ: 'A',
      Ẳ: 'A', Ẵ: 'A', Ặ: 'A', È: 'E', É: 'E', Ê: 'E', Ẹ: 'E',
      Ẻ: 'E', Ẽ: 'E', Ế: 'E', Ề: 'E', Ể: 'E', Ễ: 'E', Ệ: 'E',
      Ì: 'I', Í: 'I', Ĩ: 'I', Ỉ: 'I', Ị: 'I', Ò: 'O', Ó: 'O',
      Ô: 'O', Õ: 'O', Ơ: 'O', Ọ: 'O', Ỏ: 'O', Ố: 'O', Ồ: 'O',
      Ổ: 'O', Ỗ: 'O', Ộ: 'O', Ớ: 'O', Ờ: 'O', Ở: 'O', Ỡ: 'O',
      Ợ: 'O', Ù: 'U', Ú: 'U', Ũ: 'U', Ư: 'U', Ụ: 'U', Ủ: 'U',
      Ứ: 'U', Ừ: 'U', Ử: 'U', Ữ: 'U', Ự: 'U', Ỳ: 'Y', Ý: 'Y',
      Ỷ: 'Y', Ỹ: 'Y', Ỵ: 'Y', Đ: 'D'
    }

    return accentMap[firstChar] || firstChar
  }

  getBgColor = (name: string): string => {
    const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#6366f1', '#ef4444']
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  handleImageError = (index: number) => {
    this.state.imageErrors[index] = true
    this.update()
  }

  render() {
    const { loading, error, items, oauthStatus, imageErrors } = this.state
    const hasItems = !loading && items.length > 0
    const isEmpty = !loading && !error && items.length === 0
    const hasError = !loading && error
    const isProcessing = oauthStatus === 'authorizing'
    const currentLocale = this.props.locale || 'vi'

    return (
      <div class='flex flex-col gap-4 overflow-hidden h-full bg-vb-bg'>

        {oauthStatus === 'error' && (
          <div class='bg-red-50 border-b border-red-200 p-3'>
            <div class='flex items-center justify-between text-red-700'>
              <span class='text-sm'>{error}</span>
              <vb-button
                title={this.t.close}
                locale={currentLocale}
                onButton-click={() => {
                  this.state.oauthStatus = 'idle'
                  this.state.error = null
                  this.update()
                }}
              />
            </div>
          </div>
        )}

        <div class="flex-1">
          {loading && (
            <div class='flex items-center justify-center gap-2 text-sm opacity-70 h-full w-full'>
              <div class='animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full'></div>
              <span>{this.t.loading}</span>
            </div>
          )}

          {hasItems && (
            <div class='flex flex-col'>
              <div class='h-[275px] overflow-y-auto'>
                <div class='grid grid-cols-2 gap-4'>
                  {items.map((item, index) => (
                    <div class='flex items-center gap-2 p-2 border rounded-lg'>
                      <div class='w-10 min-w-[40px] h-10 min-h-[40px] rounded-full'>
                        {imageErrors[index] ? (
                          <div
                            class='w-full h-full text-white flex items-center justify-center font-semibold rounded-full'
                            style={{
                              backgroundColor: this.getBgColor(item.name),
                              fontSize: `${40 * 0.45}px`
                            }}
                          >
                            {this.getFirstLetterAvatar(item.name)}
                          </div>
                        ) : (
                          <img
                            src={item.avatar}
                            onError={() => this.handleImageError(index)}
                            class='w-10 h-10 rounded-full'
                            alt={item.name}
                          />
                        )}
                      </div>
                      <div class='truncate w-[300px] text-[var(--el-text-color-primary)]'>
                        <div class='truncate'>{item.name}</div>
                        <div class='truncate text-xs'>{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div class='pt-4 flex justify-end'>
                <vb-button
                  locale={currentLocale}
                  title={this.t.addOALink}
                  isProcessing={isProcessing}
                  onButton-click={this.handleAddZaloOAPopup}
                />
              </div>
            </div>
          )}

          {isEmpty && (
            <div class='text-center py-8'>
              <div class='my-5'>
                <vb-empty locale={currentLocale}></vb-empty>
              </div>
              <vb-button
                locale={currentLocale}
                title={this.t.addOALink}
                isProcessing={isProcessing}
                onButton-click={this.handleAddZaloOAPopup}
              />
            </div>
          )}

          {hasError && (
            <div class='text-center py-8'>
              <div class='text-red-500 mb-4'>{error}</div>

              <vb-button
                locale={currentLocale}
                title={this.t.tryAgain}
                onButton-click={this.safeLoadFlow}
              />
            </div>
          )}
        </div>
      </div>
    )
  }
}


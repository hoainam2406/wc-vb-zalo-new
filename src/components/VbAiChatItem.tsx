import { tag, Component } from 'omi'
import type { ChatItem } from '../models/ChatItem'
import { tailwind } from '../tailwind'
import { useTheme } from '../utils/themeSignal'
import { sharedStyle } from '@/style/sharedStyle'

@tag('vb-ai-chat-item-v2')
class VbAIChatItem extends Component<{ item: ChatItem }> {
  static css = [tailwind, sharedStyle]
  private disposeTheme?: () => void

  install() {
    this.disposeTheme = useTheme(this)
  }

  uninstall() {
    this.disposeTheme?.()
  }

  // Hàm trợ giúp để viết hoa chữ cái đầu
  capitalizeFirstLetter(str: string): string {
    // Kiểm tra nếu chuỗi không tồn tại hoặc rỗng, trả về chuỗi rỗng
    if (!str) return ''

    // Xóa khoảng trắng ở đầu và cuối chuỗi
    const trimmedStr = str.trim()

    // Kiểm tra lại sau khi trim để tránh lỗi với chuỗi chỉ toàn khoảng trắng
    if (!trimmedStr) return ''

    // Chuyển ký tự đầu tiên thành chữ hoa và nối với phần còn lại của chuỗi
    return trimmedStr.charAt(0).toUpperCase() + trimmedStr.slice(1)
  }

  render(props: { item: ChatItem }) {
    const item = props.item
    const capitalizedContent = this.capitalizeFirstLetter(item.content)

    return (
      <div class={`flex flex-col gap-1 ${item.type === 'member' ? 'text-right' : 'text-left'}`}>
        <div class="text-xs">{item.name}</div>
        <div class={`flex ${item.type === 'member' ? 'justify-end' : 'justify-start'}`}>
          <div
            class={`flex flex-col items-end px-3 py-1 border border-solid border-[var(--el-border-color-light)] rounded-[var(--el-card-border-radius)] shadow ${item.type === 'member' ? 'bg-[var(--el-bg-color-app-bar)]' : 'bg-customer-bg'} max-w-[80%] break-words`}
          >
            <div class="text-left text-sm">{capitalizedContent}</div>
            <div class="text-xs opacity-70">{item.time}</div>
          </div>
        </div>
      </div>
    )
  }
}
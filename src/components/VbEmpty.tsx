import { tag, Component } from 'omi'
import { tailwind } from '@/tailwind'
import { useTheme, themeSignal } from '@/utils/themeSignal'
import '@/icons/VbEmptyImg'
import { sharedStyle } from '@/style/sharedStyle'

@tag('vb-empty')
class VbAITag extends Component {
  static css = [tailwind, sharedStyle]

  private disposeTheme?: () => void

  install() {
    // Chỉ cần 1 dòng để có theme support!
    this.disposeTheme = useTheme(this)
  }

  uninstall() {
    this.disposeTheme?.()
  }

  render() {
    return (
      <div class="flex flex-col gap-2 justify-center items-center h-full">
        <vb-empty-img size="80" />
        <div class='text-[--el-text-color-placeholder] text-sm'>Không có dữ liệu</div>
      </div>
    )
  }
}

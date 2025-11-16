import '@/icons/VbEmptyImg'
import { sharedStyle } from '@/style/sharedStyle'
import { tailwind } from '@/tailwind'
import { getTranslation, type Locale } from '@/translate'
import { useTheme } from '@/utils/themeSignal'
import { Component, tag } from 'omi'

@tag('vb-empty')
class VbEmpty extends Component<{
  locale?: Locale  // Thêm prop locale
}> {
  static css = [tailwind, sharedStyle]

  static props = {
    locale: { type: String, default: 'vi' }  // Định nghĩa prop
  }

  private disposeTheme?: () => void

  // Getter để lấy translation
  private get t() {
    return getTranslation(this.props.locale || 'vi')
  }

  install() {
    this.disposeTheme = useTheme(this)
  }

  uninstall() {
    this.disposeTheme?.()
  }

  render() {
    return (
      <div class="flex flex-col gap-2 justify-center items-center h-full">
        <vb-empty-img size="80" />
        <div class='text-[--el-text-color-placeholder] text-sm'>
          {this.t.noData}
        </div>
      </div>
    )
  }
}

export default VbEmpty

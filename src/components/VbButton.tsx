import { sharedStyle } from '@/style/sharedStyle'
import { getTranslation, type Locale } from '@/translate'
import { Component, tag } from 'omi'
import { tailwind } from '../tailwind'
import { useTheme } from '../utils/themeSignal'

@tag('vb-button')
class VbButton extends Component<{
    title: string
    isProcessing?: boolean
    disabled?: boolean
    locale?: Locale  // Thêm prop locale
}> {
    static css = [tailwind, sharedStyle]

    static props = {
        title: { type: String, default: '' },
        isProcessing: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        locale: { type: String, default: 'vi' }  // Thêm prop
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

    handleClick = (e: MouseEvent) => {
        if (!this.props.isProcessing) {
            this.fire('button-click', {
                originalEvent: e,
                timestamp: Date.now()
            })
        }
    }

    render(props: {
        title: string
        isProcessing?: boolean
        disabled?: boolean
        locale?: Locale
    }) {
        const { title, isProcessing = false, disabled = false } = props

        return (
            <button
                class='px-4 py-2 rounded-[4px] text-sm !text-white font-medium transition-all bg-[var(--el-color-primary)]'
                onClick={this.handleClick}
                disabled={disabled || isProcessing}
            >
                {isProcessing ? (
                    <div class="flex items-center gap-2">
                        <div class='animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full'></div>
                        <span>{this.t.processing}</span>
                    </div>
                ) : (
                    <div class="flex items-center gap-2">
                        <span>{title}</span>
                    </div>
                )}
            </button>
        )
    }
}

export default VbButton

package base.activity

import android.content.res.Configuration
import android.os.Bundle
import android.view.KeyEvent
import androidx.appcompat.app.AppCompatActivity
import androidx.databinding.DataBindingUtil
import androidx.databinding.ViewDataBinding
import base.fragments.*
import com.healthcarelocator.R
import com.healthcarelocator.extensions.mapZoomInEvent
import com.healthcarelocator.extensions.mapZoomOutEvent
import java.util.*

abstract class AppActivity<BINDING : ViewDataBinding>(private val layoutId: Int) :
        AppCompatActivity(), IPrevChangeFragAction {
    abstract fun initView(savedInstanceState: Bundle?)
    abstract val stackFragment: ArrayList<IFragment>
    abstract val activeStack: Int
    private val passingEventListenerMap by lazy { hashMapOf<String, (data: Any) -> Unit>() }
    private val configurationEventMap by lazy { hashMapOf<String, (newConfig: Configuration) -> Unit>() }

    private val fragmentState: IFragmentState by lazy {
        FragmentState(this.supportFragmentManager, R.id.fragmentContainer)
    }
    private var binding: BINDING? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        require(layoutId != 0) { "The layout id can not be 0 or nullable." }
        binding = DataBindingUtil.setContentView(this, layoutId)
        initView(savedInstanceState)
        if (stackFragment.isNotEmpty())
            fragmentState.run {
                enableAnim(false)
                setStacksRootFragment(stackFragment)
                showStack(activeStack)
                enableAnim(true)
            }
    }

    override fun onBackPressed() {
        when {
            stackFragment.isEmpty() -> super.onBackPressed()
            !fragmentState.isRootFragment -> {
                fragmentState.popFragment(1)
            }
            else -> super.onBackPressed()
        }
    }

    override fun execute() {

    }

    override fun onKeyUp(keyCode: Int, event: KeyEvent?): Boolean {
        when (keyCode) {
            KeyEvent.KEYCODE_PAGE_DOWN -> {
                notifyPassingEventListener(mapZoomInEvent)
                return true
            }
            KeyEvent.KEYCODE_PAGE_UP -> {
                notifyPassingEventListener(mapZoomOutEvent)
                return true
            }
        }
        return super.onKeyUp(keyCode, event)
    }

    fun getBinding(): BINDING? = binding

    fun <T : AppFragment<*, *>> changeFragment(fragment: T) {
        fragmentState.pushFragmentKeepOld(this, fragment)
    }

    fun <T : AppFragment<*, *>> changeFragment(fragment: T, allowDuplicated: Boolean) {
        fragmentState.pushFragmentKeepOld(this, fragment, allowDuplicated)
    }

    fun changeRootStack(root: IFragment, stack: Int) {
        fragmentState.changeRootFragment(root, stack)
    }

    protected fun getFragmentInState(): IFragmentState = fragmentState

    fun registerPassingEventListener(key: String, event: (data: Any) -> Unit) {
        passingEventListenerMap[key] = event
    }

    fun unregisterPassingEventListener(key: String) {
        passingEventListenerMap.remove(key)
    }

    fun registerConfigurationChanged(key: String, event: (newConfig: Configuration) -> Unit) {
        configurationEventMap[key] = event
    }

    fun unregisterConfigurationChanged(key: String) {
        configurationEventMap.remove(key)
    }

    fun notifyConfigurationChanged(data: Configuration) {
        configurationEventMap.map { entry: Map.Entry<String, (data: Configuration) -> Unit> ->
            entry.value(data)
        }
    }

    private fun notifyPassingEventListener(data: Any) {
        passingEventListenerMap.map { entry: Map.Entry<String, (data: Any) -> Unit> ->
            entry.value(data)
        }
    }

}
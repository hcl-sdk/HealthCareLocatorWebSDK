package base.fragments

import android.content.res.Configuration
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import base.activity.AppActivity
import base.extensions.changeLocale
import base.viewmodel.IViewModel
import com.healthcarelocator.state.HealthCareLocatorSDK

/**
 * This class will be used for the fragments where the binding functions are called already.
 * @param T: is the fragment class where will be extended.
 * @param VM: is the class where will extend from IViewModel to use view model.
 * @param BINDING: is the layout binding to use data binding.
 * @param layoutId: provide the layout for fragment to show on view.
 */
abstract class AppFragment<T, VM : IViewModel<T>>(private val layoutId: Int) :
        IFragment() {
    /**
     * This value will be initialized the view model class.
     */
    abstract val viewModel: VM

    /**
     * This method will call when the view created and returned a view for using.
     */
    abstract fun initView(view: View, savedInstanceState: Bundle?)
    open val onPassingEventListener: (data: Any) -> Unit = {}
    open val onConfigurationChanged: (newConfig: Configuration) -> Unit = {}
    private val screenId: String by lazy { "${System.currentTimeMillis()}" }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        changeLocale(HealthCareLocatorSDK.getInstance().getConfiguration().locale)
        val view = inflater.inflate(layoutId, container, false)
        viewModel.bindView(this as T)
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        getAppActivity()?.registerPassingEventListener(screenId, onPassingEventListener)
        getAppActivity()?.registerConfigurationChanged(screenId, onConfigurationChanged)
        initView(view, savedInstanceState)
    }

    override fun onDestroyView() {
        getAppActivity()?.unregisterPassingEventListener(screenId)
        getAppActivity()?.unregisterConfigurationChanged(screenId)
        super.onDestroyView()
        viewModel.unbindView()
    }

    override fun onDestroy() {
        super.onDestroy()
    }

    fun getAppActivity(): AppActivity<*>? = activity as? AppActivity<*>

    fun changeFragment(fragment: AppFragment<*, *>) {
        getAppActivity()?.changeFragment(fragment)
    }

    fun addChildFragment(containerId: Int, fragment: Fragment) {
        with(childFragmentManager) {
            val transaction = beginTransaction()
            transaction.replace(containerId, fragment, fragment::class.java.simpleName)
                    .commitAllowingStateLoss()
        }
    }

    open fun changeLocale(language: String) {
        if (activity == null) return
        activity!!.changeLocale(language)
    }
}
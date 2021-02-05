package base.viewmodel

import androidx.fragment.app.Fragment
import base.fragments.IFragment
import io.reactivex.FlowableTransformer
import io.reactivex.ObservableTransformer
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers
import java.lang.ref.WeakReference

abstract class AppViewModel<T> : IViewModel<T>() {
    protected var disposable: CompositeDisposable? = null
    protected var reference:WeakReference<T>?=null
    override fun bindView(t: T) {
        super.bindView(t)
        disposable = CompositeDisposable()
        reference = WeakReference(t)
    }

    override fun unbindView() {
        super.unbindView()
        reference?.clear()
        disposable?.apply {
            clear()
            dispose()
        }
    }

    fun getFragmentReference():Fragment? = reference?.get() as? Fragment

    protected fun <S> compose(): FlowableTransformer<S, S> =
        FlowableTransformer {
            it.subscribeOn(Schedulers.newThread()).observeOn(AndroidSchedulers.mainThread())
        }
    protected fun <S> composeObservable(): ObservableTransformer<S, S> =
        ObservableTransformer {
            it.subscribeOn(Schedulers.newThread()).observeOn(AndroidSchedulers.mainThread())
        }
}
package base.viewmodel

import io.reactivex.FlowableTransformer
import io.reactivex.ObservableTransformer
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers

abstract class AppViewModel<T> : IViewModel<T>() {
    protected var disposable: CompositeDisposable? = null
    override fun bindView(t: T) {
        super.bindView(t)
        disposable = CompositeDisposable()
    }

    override fun unbindView() {
        super.unbindView()
        disposable?.apply {
            clear()
            dispose()
        }
    }

    protected fun <S> compose(): FlowableTransformer<S, S> =
        FlowableTransformer {
            it.subscribeOn(Schedulers.newThread()).observeOn(AndroidSchedulers.mainThread())
        }
    protected fun <S> composeObservable(): ObservableTransformer<S, S> =
        ObservableTransformer {
            it.subscribeOn(Schedulers.newThread()).observeOn(AndroidSchedulers.mainThread())
        }
}
package base.viewmodel

abstract class AppViewModel<T> : IViewModel<T>() {
    override fun bindView(t: T) {
        super.bindView(t)
    }

    override fun unbindView() {
        super.unbindView()
    }
}
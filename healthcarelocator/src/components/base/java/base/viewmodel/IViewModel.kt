package base.viewmodel

import androidx.lifecycle.ViewModel

/**
 * This class is customized class.
 * IViewModel will use for live data which will be bound with a lifecycle
 */
abstract class IViewModel<T> : ViewModel() {

    /**
     * This method will make the subscription when the view is bound.
     */
    open fun bindView(t: T) {}

    /**
     * This method will be call when the destroyed of life cycle is called.
     * To clear the subscription to prevent the leak.
     */
    open fun unbindView() {
        onCleared()
    }

}
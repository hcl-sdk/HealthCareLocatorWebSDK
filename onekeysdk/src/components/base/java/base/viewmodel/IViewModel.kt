package base.viewmodel

import androidx.databinding.Observable
import androidx.databinding.PropertyChangeRegistry
import androidx.lifecycle.ViewModel

/**
 * This class is customized class.
 * IViewModel will use for live data which will be bound with a lifecycle
 * Implemented Observable to using data binding and update to view directly
 */
abstract class IViewModel<T> : ViewModel(), Observable {
    private val callbacks: PropertyChangeRegistry by lazy { PropertyChangeRegistry() }

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

    override fun addOnPropertyChangedCallback(callback: Observable.OnPropertyChangedCallback) {
        callbacks.add(callback)
    }

    override fun removeOnPropertyChangedCallback(callback: Observable.OnPropertyChangedCallback) {
        callbacks.remove(callback)
    }

    /**
     * Notifies listeners that all properties of this instance have changed.
     */
    open fun notifyChange() {
        callbacks.notifyCallbacks(this, 0, null)
    }

    /**
     * Notifies listeners that a specific property has changed. The getter for the property
     * that changes should be marked with [Bindable] to generate a field in
     * `BR` to be used as `fieldId`.
     *
     * @param fieldId The generated BR id for the @Bindable field.
     */
    open fun notifyPropertyChanged(fieldId: Int) {
        callbacks.notifyCallbacks(this, fieldId, null)
    }
}
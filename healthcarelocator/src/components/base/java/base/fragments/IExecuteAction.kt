package base.fragments

import androidx.fragment.app.FragmentTransaction


interface IExecuteAction {
    fun execute(fragmentTransaction: FragmentTransaction)
}
